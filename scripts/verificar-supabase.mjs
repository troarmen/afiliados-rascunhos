/**
 * Confere se o Supabase está pronto para receber a aplicação.
 *
 *   npm run verificar:supabase
 *
 * Roda depois de executar `supabase/schema.sql` no SQL Editor. Checa cada
 * objeto que o código espera encontrar — tabela, coluna, visão, função e
 * bucket — e diz exatamente o que faltou, em vez de deixar o erro aparecer
 * mais tarde como uma tela quebrada.
 *
 * Usa a service_role key, que ignora RLS: é por isso que só roda no terminal,
 * nunca no navegador.
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

// --- .env.local -------------------------------------------------------------
// Lido à mão para o script funcionar em qualquer versão do Node e para não
// depender de uma flag na linha de comando.
const arquivoEnv = path.join(process.cwd(), '.env.local')
if (fs.existsSync(arquivoEnv)) {
  for (const linha of fs.readFileSync(arquivoEnv, 'utf8').split('\n')) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    const valor = m[2].trim().replace(/^["'](.*)["']$/, '$1')
    if (!(m[1] in process.env)) process.env[m[1]] = valor
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const CHAVE = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = process.env.MATERIAIS_BUCKET || 'materiais'

const verde = (t) => `\x1b[32m${t}\x1b[0m`
const vermelho = (t) => `\x1b[31m${t}\x1b[0m`
const amarelo = (t) => `\x1b[33m${t}\x1b[0m`
const cinza = (t) => `\x1b[90m${t}\x1b[0m`

if (!URL || !CHAVE) {
  console.error(vermelho('\n✗ Supabase não configurado.\n'))
  console.error('  Faltam variáveis em .env.local:')
  if (!URL) console.error('    NEXT_PUBLIC_SUPABASE_URL')
  if (!CHAVE) console.error('    SUPABASE_SERVICE_ROLE_KEY')
  console.error(cinza('\n  Supabase → Project Settings → API\n'))
  process.exit(1)
}

if (/^eyJ/.test(URL) || !/^https:\/\//.test(URL)) {
  console.error(vermelho('\n✗ NEXT_PUBLIC_SUPABASE_URL não parece uma URL.'))
  console.error(cinza('  Esperado algo como https://abcdefgh.supabase.co\n'))
  process.exit(1)
}

const db = createClient(URL, CHAVE, { auth: { persistSession: false } })

// --- Preflight de conectividade ---------------------------------------------
// Sem isto, um host inalcançável faz TODAS as checagens falharem com
// "fetch failed" e o resumo final acusa o schema — que pode estar
// perfeito. Erro de rede e erro de schema são problemas diferentes e
// precisam de mensagens diferentes.
try {
  await fetch(`${URL}/rest/v1/`, {
    method: 'HEAD',
    headers: { apikey: CHAVE },
    signal: AbortSignal.timeout(15000),
  })
} catch (e) {
  const causa = e?.cause?.code ?? e?.name ?? ''
  console.error(vermelho(`\n✗ Não foi possível alcançar ${URL}\n`))
  if (causa === 'ENOTFOUND' || causa === 'EAI_AGAIN') {
    console.error('  O endereço não resolve em DNS. Causas prováveis:')
    console.error('    • o projeto ainda está sendo criado (aguarde e repita);')
    console.error('    • o projeto está pausado — projetos free pausam após 7 dias parados;')
    console.error('    • a URL está errada. Confira em Project Settings → API → Project URL,')
    console.error('      e use a raiz (https://<ref>.supabase.co), sem /rest/v1.')
  } else if (causa === 'TimeoutError' || causa === 'AbortError') {
    console.error('  A conexão expirou. Rede local, proxy ou firewall podem estar no caminho.')
  } else {
    console.error(`  ${e.message}${causa ? cinza(` (${causa})`) : ''}`)
  }
  console.error(cinza('\n  Nada foi verificado no banco — o problema é de rede, não de schema.\n'))
  process.exit(1)
}

const falhas = []
const avisos = []

function ok(rotulo, detalhe = '') {
  console.log(`  ${verde('✓')} ${rotulo}${detalhe ? cinza(` — ${detalhe}`) : ''}`)
}
function erro(rotulo, motivo) {
  console.log(`  ${vermelho('✗')} ${rotulo}${motivo ? cinza(` — ${motivo}`) : ''}`)
  falhas.push(rotulo)
}
function aviso(rotulo, motivo) {
  console.log(`  ${amarelo('!')} ${rotulo}${motivo ? cinza(` — ${motivo}`) : ''}`)
  avisos.push(rotulo)
}

/** Uma tabela existe se dá para contar linhas nela com a service_role. */
async function tabela(nome) {
  const { count, error } = await db.from(nome).select('*', { count: 'exact', head: true })
  if (error) return erro(`tabela ${nome}`, error.message)
  ok(`tabela ${nome}`, `${count ?? 0} linha(s)`)
}

/** Uma coluna existe se dá para pedi-la explicitamente no select. */
async function coluna(nomeTabela, nomeColuna) {
  const { error } = await db.from(nomeTabela).select(nomeColuna).limit(1)
  if (error) return erro(`coluna ${nomeTabela}.${nomeColuna}`, error.message)
  ok(`coluna ${nomeTabela}.${nomeColuna}`)
}

console.log(`\n${cinza('Projeto:')} ${URL}\n`)

console.log('Candidaturas')
await tabela('candidaturas')
await tabela('produtores_interessados')

console.log('\nMateriais e programas')
await tabela('programas')
await tabela('campanhas')
await tabela('materiais')
await tabela('materiais_usos')
await tabela('afiliacoes')
await coluna('programas', 'plataforma')
await coluna('programas', 'url_afiliacao')

console.log('\nVisões de acompanhamento')
for (const v of ['funil_candidaturas', 'candidaturas_por_area']) {
  const { error } = await db.from(v).select('*').limit(1)
  if (error) erro(`visão ${v}`, error.message)
  else ok(`visão ${v}`)
}

console.log('\nFunção de contagem de uso')
{
  // UUID inexistente de propósito: a função devolve 0 e não grava nada.
  // É a sonda mais barata para saber se ela existe com a assinatura certa.
  const { data, error } = await db.rpc('incrementar_uso_material', {
    p_material_id: '00000000-0000-0000-0000-000000000000',
    p_candidatura_id: null,
    p_acao: 'abrir',
  })
  if (error) erro('incrementar_uso_material', error.message)
  else if (data !== 0) aviso('incrementar_uso_material', `respondeu ${data}, esperado 0`)
  else ok('incrementar_uso_material')
}

console.log('\nStorage')
{
  const { data, error } = await db.storage.listBuckets()
  if (error) {
    erro(`bucket ${BUCKET}`, error.message)
  } else {
    const b = data.find((x) => x.id === BUCKET || x.name === BUCKET)
    if (!b) erro(`bucket ${BUCKET}`, 'não existe')
    else if (b.public) erro(`bucket ${BUCKET}`, 'está PÚBLICO — precisa ser privado')
    else ok(`bucket ${BUCKET}`, 'privado')
  }
}

console.log('\nPrograma inicial')
{
  const { data, error } = await db.from('programas').select('slug, nome, plataforma, url_afiliacao')
  if (error) {
    erro('programas', error.message)
  } else if (!data.length) {
    erro('programas', 'nenhum programa cadastrado — o schema.sql insere o do Rascunhos')
  } else {
    for (const p of data) {
      ok(`programa ${p.slug}`, `${p.nome} · ${p.plataforma}`)
      if (!p.url_afiliacao) {
        aviso(
          `programa ${p.slug}`,
          'sem url_afiliacao — o botão "Solicitar afiliação" fica sem atalho',
        )
      }
    }
  }
}

console.log('')
if (falhas.length) {
  console.log(vermelho(`✗ ${falhas.length} item(ns) faltando.`))
  console.log(cinza('  Rode supabase/schema.sql inteiro no SQL Editor e tente de novo.'))
  console.log(cinza('  Ele é idempotente: rodar duas vezes não duplica nem apaga nada.\n'))
  process.exit(1)
}
if (avisos.length) {
  console.log(amarelo(`✓ Estrutura completa, com ${avisos.length} aviso(s) não bloqueante(s).\n`))
} else {
  console.log(verde('✓ Supabase pronto. A aplicação já pode gravar no banco.\n'))
}
