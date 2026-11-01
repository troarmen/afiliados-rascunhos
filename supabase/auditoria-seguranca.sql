-- ===========================================================================
-- Auditoria de segurança do banco — SÓ LEITURA, não altera nada.
--
-- Rode no Supabase → SQL Editor. Devolve uma tabela com tudo que a API
-- pública (chave anon/publishable) consegue alcançar, mais grave primeiro.
-- Rode antes de cada entrega e depois de criar tabela, view ou função nova.
-- ===========================================================================
with achados as (

  -- Tabelas: RLS ligado em todas? Quantas policies cada uma tem?
  select
    case when not c.relrowsecurity then 1 else 9 end as ordem,
    case when not c.relrowsecurity then 'CRÍTICO' else 'ok' end as risco,
    'tabela' as tipo,
    c.relname as objeto,
    case
      when not c.relrowsecurity then 'RLS DESLIGADO: a chave pública lê e escreve tudo'
      else 'RLS ligado, ' || (
        select count(*) from pg_policies p
        where p.schemaname = 'public' and p.tablename = c.relname
      ) || ' policy(s)'
    end as situacao
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r', 'p')

  union all

  -- Policies: qualquer uma é exceção ao "ninguém acessa"; `true` libera geral.
  select
    case when p.qual = 'true' or p.with_check = 'true' then 2 else 5 end,
    case when p.qual = 'true' or p.with_check = 'true' then 'ALTO' else 'revisar' end,
    'policy',
    p.schemaname || '.' || p.tablename || ' → ' || p.policyname,
    p.cmd || ' para ' || array_to_string(p.roles, ', ')
      || ' | using: ' || coalesce(p.qual, '-')
      || ' | check: ' || coalesce(p.with_check, '-')
  from pg_policies p
  where p.schemaname in ('public', 'storage')

  union all

  -- Views: sem security_invoker elas ignoram o RLS da tabela de origem.
  select
    case when not invoker and anon_le then 2 else 9 end,
    case when not invoker and anon_le then 'ALTO' else 'ok' end,
    'view',
    relname,
    case when invoker then 'security_invoker (respeita RLS)' else 'IGNORA o RLS' end
      || case when anon_le then ', chave pública pode ler' else ', chave pública sem acesso' end
  from (
    select
      c.relname,
      coalesce(c.reloptions && array['security_invoker=true', 'security_invoker=on'], false) as invoker,
      has_table_privilege('anon', c.oid, 'SELECT') as anon_le
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('v', 'm')
  ) v

  union all

  -- Funções: security definer roda como dono (fura o RLS). Se a chave pública
  -- pode chamar via /rpc, é uma porta aberta.
  select
    case
      when prosecdef and anon_exec then 2
      when prosecdef and not caminho_fixo then 4
      else 9
    end,
    case
      when prosecdef and anon_exec then 'ALTO'
      when prosecdef and not caminho_fixo then 'médio'
      else 'ok'
    end,
    'função',
    proname,
    case when prosecdef then 'security definer' else 'security invoker' end
      || case when caminho_fixo then '' else ', search_path solto' end
      || case when anon_exec then ', chave pública pode executar' else ', chave pública sem acesso' end
  from (
    select
      p.proname,
      p.prosecdef,
      coalesce(exists (select 1 from unnest(p.proconfig) cfg where cfg like 'search_path=%'), false) as caminho_fixo,
      has_function_privilege('anon', p.oid, 'EXECUTE') as anon_exec
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prokind = 'f'
  ) f

  union all

  -- Buckets de arquivo: público = qualquer um baixa sabendo o caminho.
  select
    case when b.public then 2 else 9 end,
    case when b.public then 'ALTO' else 'ok' end,
    'bucket',
    b.name,
    case when b.public then 'PÚBLICO' else 'privado' end
      || coalesce(', limite ' || (b.file_size_limit / 1048576) || ' MB', ', sem limite de tamanho')
  from storage.buckets b
)
select risco, tipo, objeto, situacao
from achados
order by ordem, tipo, objeto;
