-- ===========================================================================
-- PARE — Projeto Afiliado Rascunhos Econômicos
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
