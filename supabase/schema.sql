-- ===========================================================================
-- Duck Affiliate — programa de afiliados para canais educacionais
-- Rode este arquivo no SQL Editor do Supabase (projeto novo, uma vez só).
-- ===========================================================================

create extension if not exists "pgcrypto";

create table if not exists public.candidaturas (
  id                      uuid primary key default gen_random_uuid(),
  criado_em               timestamptz not null default now(),
  atualizado_em           timestamptz not null default now(),

  -- Identificação
  nome                    text not null,
  email                   text not null,
  telefone                text not null,

  -- Canal / projeto
  canal_nome              text not null,
  canal_url               text not null,
  plataforma_principal    text not null,
  redes                   jsonb not null default '{}'::jsonb,

  -- Perfil
  area                    text not null,
  audiencia               text not null,
  formas_divulgacao       text[] not null default '{}',

  -- Experiência
  ja_eh_afiliado_hotmart  boolean not null default false,
  experiencia             text not null default '',
  motivacao               text not null,
  como_conheceu           text not null default '',

  -- Atribuição
  utm                     jsonb not null default '{}'::jsonb,
  origem                  text not null default '',

  -- Triagem
  status                  text not null default 'novo',
  score                   integer not null default 0,
  notas                   text not null default '',
  responsavel             text not null default '',

  constraint candidaturas_email_unico unique (email),
  constraint candidaturas_status_valido check (
    status in ('novo','em_analise','contatado','reuniao','aprovado','reprovado','standby')
  ),
  constraint candidaturas_score_faixa check (score between 0 and 100)
);

create index if not exists candidaturas_criado_em_idx on public.candidaturas (criado_em desc);
create index if not exists candidaturas_status_idx    on public.candidaturas (status);
create index if not exists candidaturas_area_idx      on public.candidaturas (area);
create index if not exists candidaturas_score_idx     on public.candidaturas (score desc);

-- `atualizado_em` sempre coerente, mesmo em update feito direto no painel do Supabase.
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists candidaturas_atualizado_em on public.candidaturas;
create trigger candidaturas_atualizado_em
  before update on public.candidaturas
  for each row execute function public.tocar_atualizado_em();

-- ---------------------------------------------------------------------------
-- Segurança
--
-- RLS ligado e SEM política de acesso: nenhuma chave anônima lê ou escreve
-- nesta tabela. A aplicação usa a service_role key, que ignora RLS e só existe
-- no servidor. Se um dia o formulário passar a gravar direto do navegador,
-- crie uma política de INSERT específica — nunca de SELECT.
-- ---------------------------------------------------------------------------
alter table public.candidaturas enable row level security;

-- ---------------------------------------------------------------------------
-- Visões úteis para acompanhar o funil sem sair do Supabase.
-- ---------------------------------------------------------------------------
create or replace view public.funil_candidaturas as
select
  status,
  count(*)                              as total,
  round(avg(score))                     as score_medio,
  count(*) filter (where criado_em > now() - interval '7 days') as ultimos_7_dias
from public.candidaturas
group by status
order by total desc;

create or replace view public.candidaturas_por_area as
select
  area,
  count(*)                                          as total,
  count(*) filter (where status = 'aprovado')       as aprovados,
  round(avg(score))                                 as score_medio
from public.candidaturas
group by area
order by total desc;

-- ===========================================================================
-- Biblioteca de materiais de divulgação
-- Rode este bloco depois do bloco de candidaturas (projeto já existente).
-- ===========================================================================

create table if not exists public.programas (
  id          uuid primary key default gen_random_uuid(),
  criado_em   timestamptz not null default now(),
  slug        text not null unique,
  nome        text not null,
  produtor    text not null default '',
  descricao   text not null default '',
  ativo       boolean not null default true
);

-- O programa padrão. Multiprodutor (fase 3) é inserir outra linha aqui.
insert into public.programas (slug, nome, produtor, descricao)
values (
  'rascunhos-economicos',
  'Rascunhos Econômicos',
  'Rascunhos Econômicos',
  'Cursos de economia para quem quer entender o sistema, não decorar fórmula. O primeiro catálogo do Duck Affiliate.'
)
on conflict (slug) do nothing;

create table if not exists public.campanhas (
  id           uuid primary key default gen_random_uuid(),
  criado_em    timestamptz not null default now(),
  programa_id  uuid not null references public.programas (id) on delete cascade,
  nome         text not null,
  descricao    text not null default '',
  inicio       date,
  fim          date,
  ativa        boolean not null default true
);

create index if not exists campanhas_programa_idx on public.campanhas (programa_id);

create table if not exists public.materiais (
  id             uuid primary key default gen_random_uuid(),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now(),
  programa_id    uuid not null references public.programas (id) on delete cascade,
  campanha_id    uuid references public.campanhas (id) on delete set null,

  tipo           text not null,
  origem         text not null,
  titulo         text not null,
  descricao      text not null default '',
  formato        text not null default '',
  tags           text[] not null default '{}',
  recomendado    boolean not null default false,
  arquivado      boolean not null default false,
  usos           integer not null default 0,

  -- origem = arquivo
  caminho        text,
  nome_arquivo   text,
  mime           text,
  tamanho        bigint,
  largura        integer,
  altura         integer,
  -- origem = texto
  conteudo       text,
  -- origem = link
  url            text,

  constraint materiais_tipo_valido check (
    tipo in ('imagem','video','banner','social','email','copy','cupom','logo','pdf','link','outro')
  ),
  constraint materiais_origem_valida check (origem in ('arquivo','texto','link')),
  -- Cada origem exige o seu campo. Mesma regra do zod, repetida no banco
  -- para um insert feito à mão no painel do Supabase não criar material oco.
  constraint materiais_origem_completa check (
    (origem = 'arquivo' and caminho is not null) or
    (origem = 'texto'   and conteudo is not null) or
    (origem = 'link'    and url is not null)
  )
);

create index if not exists materiais_programa_idx   on public.materiais (programa_id, arquivado, criado_em desc);
create index if not exists materiais_campanha_idx   on public.materiais (campanha_id);
create index if not exists materiais_tipo_idx       on public.materiais (programa_id, tipo);
create index if not exists materiais_usos_idx       on public.materiais (programa_id, usos desc);

drop trigger if exists materiais_atualizado_em on public.materiais;
create trigger materiais_atualizado_em
  before update on public.materiais
  for each row execute function public.tocar_atualizado_em();

-- Log de uso: quem baixou/copiou/abriu o quê. Hoje só alimenta o contador;
-- amanhã responde "o que este parceiro já usou" sem migração.
create table if not exists public.materiais_usos (
  id              bigserial primary key,
  em              timestamptz not null default now(),
  material_id     uuid not null references public.materiais (id) on delete cascade,
  candidatura_id  uuid references public.candidaturas (id) on delete set null,
  acao            text not null check (acao in ('baixar','copiar','abrir'))
);

create index if not exists materiais_usos_material_idx on public.materiais_usos (material_id);
create index if not exists materiais_usos_candidatura_idx on public.materiais_usos (candidatura_id, em desc);

-- Incremento atômico + log numa chamada só (evita ler-somar-gravar com corrida).
create or replace function public.incrementar_uso_material(
  p_material_id uuid,
  p_candidatura_id uuid,
  p_acao text
)
returns integer
language plpgsql
security definer
as $$
declare
  novo_total integer;
begin
  update public.materiais
     set usos = usos + 1
   where id = p_material_id
   returning usos into novo_total;
  if novo_total is null then
    return 0;
  end if;
  insert into public.materiais_usos (material_id, candidatura_id, acao)
  values (p_material_id, p_candidatura_id, p_acao);
  return novo_total;
end;
$$;

-- RLS ligado, sem política: só a service_role (servidor) lê e escreve.
alter table public.programas       enable row level security;
alter table public.campanhas       enable row level security;
alter table public.materiais       enable row level security;
alter table public.materiais_usos  enable row level security;

-- ---------------------------------------------------------------------------
-- Storage: bucket PRIVADO. O servidor assina URL de upload (para o admin
-- enviar direto do navegador) e URL de leitura de 60 s (para o parceiro
-- baixar). Nenhum arquivo é público.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('materiais', 'materiais', false, 262144000)  -- 250 MB
on conflict (id) do nothing;

-- ===========================================================================
-- Produtores interessados (canal, escola ou curso que quer afiliados)
-- ===========================================================================

create table if not exists public.produtores_interessados (
  id             uuid primary key default gen_random_uuid(),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now(),
  nome           text not null,
  email          text not null,
  telefone       text not null default '',
  projeto        text not null,
  url            text not null default '',
  plataforma     text not null,
  catalogo       text not null,
  status         text not null default 'novo',
  notas          text not null default '',
  constraint produtores_status_valido check (status in ('novo','contatado','em_conversa','integrado','descartado'))
);

create index if not exists produtores_criado_em_idx on public.produtores_interessados (criado_em desc);

drop trigger if exists produtores_atualizado_em on public.produtores_interessados;
create trigger produtores_atualizado_em
  before update on public.produtores_interessados
  for each row execute function public.tocar_atualizado_em();

alter table public.produtores_interessados enable row level security;

-- ===========================================================================
-- Link de vendas do parceiro (afiliação parceiro × programa)
-- ===========================================================================

-- O programa sabe em que plataforma vende: é o que valida o link do
-- parceiro e escolhe as instruções ("crie a conta na Hotmart…").
alter table public.programas add column if not exists plataforma text not null default 'hotmart';
alter table public.programas add column if not exists url_afiliacao text;
alter table public.programas drop constraint if exists programas_plataforma_valida;
alter table public.programas add constraint programas_plataforma_valida
  check (plataforma in ('hotmart','eduzz','kiwify','outra'));

-- Um link por parceiro por programa. Salvar de novo substitui.
create table if not exists public.afiliacoes (
  id              uuid primary key default gen_random_uuid(),
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  candidatura_id  uuid not null references public.candidaturas (id) on delete cascade,
  programa_id     uuid not null references public.programas (id) on delete cascade,
  url             text not null,
  constraint afiliacoes_unica unique (candidatura_id, programa_id)
);

create index if not exists afiliacoes_programa_idx on public.afiliacoes (programa_id);

drop trigger if exists afiliacoes_atualizado_em on public.afiliacoes;
create trigger afiliacoes_atualizado_em
  before update on public.afiliacoes
  for each row execute function public.tocar_atualizado_em();

alter table public.afiliacoes enable row level security;
