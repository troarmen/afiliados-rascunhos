-- ===========================================================================
-- Correções de segurança — rodar UMA vez no SQL Editor (pode repetir, é idempotente).
-- O schema.sql já foi atualizado com isto; este arquivo é para o banco que
-- já existe. Rode `auditoria-seguranca.sql` antes e depois para comparar.
--
-- Nada aqui afeta o site: ele só fala com o banco pela service_role, que
-- ignora RLS e mantém todas as permissões.
-- ===========================================================================
begin;

-- 1. Views de acompanhamento: passam a respeitar o RLS de `candidaturas`
--    e saem do alcance da chave pública. Continuam funcionando no painel.
alter view public.funil_candidaturas    set (security_invoker = true);
alter view public.candidaturas_por_area set (security_invoker = true);
revoke all on public.funil_candidaturas, public.candidaturas_por_area from anon, authenticated;

-- 2. Função de contagem de uso: só o servidor chama. Sem isto, qualquer um
--    com a chave pública inflava contadores via /rest/v1/rpc.
--    search_path vazio: em security definer, impede sequestrar a função
--    criando um objeto de mesmo nome em outro schema.
alter function public.incrementar_uso_material(uuid, uuid, text) set search_path = '';
revoke execute on function public.incrementar_uso_material(uuid, uuid, text) from public, anon, authenticated;
grant  execute on function public.incrementar_uso_material(uuid, uuid, text) to service_role;

alter function public.tocar_atualizado_em() set search_path = '';

-- 3. Segunda camada: o RLS já barra, mas a chave pública nem precisa ter
--    permissão nas tabelas. Se um dia o navegador gravar direto, conceda
--    só o necessário + policy específica.
revoke all on all tables in schema public from anon, authenticated;

commit;
