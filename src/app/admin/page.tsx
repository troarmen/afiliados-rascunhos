import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CabecalhoAdmin } from '@/components/admin/CabecalhoAdmin'
import { estaAutenticado } from '@/lib/auth'
import { metricas, modoPersistencia } from '@/lib/store'
import { listarCampanhas, listarProgramas, resumoMateriais } from '@/lib/store-materiais'
import { listarInteressesProdutor } from '@/lib/store-produtores'

export const dynamic = 'force-dynamic'

/**
 * Página inicial do painel: o que há para fazer, em ordem de urgência, e
 * onde cada coisa fica. Antes, /admin abria direto na tabela de
 * candidaturas — quem entrava pela primeira vez não sabia que existiam
 * materiais, campanhas ou produtores.
 */
export default async function InicioAdmin() {
  if (!(await estaAutenticado())) redirect('/admin/entrar?voltar=/admin')

  const programas = await listarProgramas()
  const programa = programas[0]
  const [funil, materiais, campanhas, produtores] = await Promise.all([
    metricas(),
    programa ? resumoMateriais(programa.id) : Promise.resolve({ total: 0, recomendados: 0, porTipo: {}, usos: 0 }),
    programa ? listarCampanhas(programa.id) : Promise.resolve([]),
    listarInteressesProdutor(),
  ])
  const produtoresNovos = produtores.filter((p) => p.status === 'novo').length
  const campanhasAtivas = campanhas.filter((c) => c.ativa).length

  const tarefas = [
    {
      href: '/admin/candidaturas?status=novo',
      titulo: 'Triar candidaturas',
      numero: funil.naFila,
      rotulo: funil.naFila === 1 ? 'aguardando análise' : 'aguardando análise',
      texto: 'Ler o canal, anotar a impressão e decidir. Todo mundo recebe resposta em até 7 dias úteis.',
      urgente: funil.naFila > 0,
    },
    {
      href: '/admin/produtores',
      titulo: 'Responder produtores',
      numero: produtoresNovos,
      rotulo: produtoresNovos === 1 ? 'sem contato' : 'sem contato',
      texto: 'Canais e escolas que querem afiliados. A conversa sobre encaixe começa por e-mail.',
      urgente: produtoresNovos > 0,
    },
    {
      href: '/admin/materiais',
      titulo: 'Publicar materiais',
      numero: materiais.total,
      rotulo: materiais.total === 1 ? 'material ativo' : 'materiais ativos',
      texto: 'Thumbnail, corte, roteiro, cupom. O que está aqui é o que o parceiro encontra na biblioteca.',
      urgente: materiais.total === 0 && funil.aprovados > 0,
    },
    {
      href: '/admin/campanhas',
      titulo: 'Organizar campanhas',
      numero: campanhasAtivas,
      rotulo: campanhasAtivas === 1 ? 'campanha ativa' : 'campanhas ativas',
      texto: 'Agrupe materiais com prazo — lançamento, promoção — para o parceiro planejar a pauta.',
      urgente: false,
    },
  ]

  return (
    <div className="adm">
      <CabecalhoAdmin modo={modoPersistencia()} />
      <div className="adm__conteudo">
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)' }}>Início</h1>
          <p className="campo__dica" style={{ maxWidth: '64ch' }}>
            {programa ? `Programa: ${programa.nome}. ` : ''}
            {funil.aprovados} parceiro{funil.aprovados === 1 ? '' : 's'} aprovado{funil.aprovados === 1 ? '' : 's'} ·{' '}
            {materiais.usos} uso{materiais.usos === 1 ? '' : 's'} de material até agora.
          </p>
        </div>

        {modoPersistencia() === 'arquivo' && (
          <div className="aviso aviso--erro">
            <p>
              <strong>Modo local ativo.</strong> Tudo está sendo gravado em <code>.data/</code>, que não
              sobrevive a um deploy. Configure o Supabase antes de colocar o site no ar.
            </p>
          </div>
        )}

        <div className="tarefas">
          {tarefas.map((t) => (
            <Link key={t.href} className="tarefa" href={t.href} data-urgente={t.urgente}>
              <span className="tarefa__numero">{t.numero}</span>
              <span className="tarefa__rotulo">{t.rotulo}</span>
              <h2>{t.titulo}</h2>
              <p>{t.texto}</p>
              <span className="link-ambar">Abrir →</span>
            </Link>
          ))}
        </div>

        <details className="ajuda-painel">
          <summary>Como este painel funciona</summary>
          <div className="ajuda-painel__corpo">
            <ol>
              <li><strong>Candidaturas</strong> chegam pelo formulário do site com uma pontuação de triagem (0–100) que só ordena a fila — a decisão é humana. Aprovar libera a área do parceiro e dispara o e-mail de boas-vindas.</li>
              <li><strong>Materiais</strong> são o que o parceiro aprovado encontra na biblioteca dele: arquivo para baixar, texto para copiar ou link para abrir. Marque <em>Recomendado</em> no que deve aparecer primeiro; <em>Arquivar</em> tira da biblioteca sem apagar.</li>
              <li><strong>Campanhas</strong> agrupam materiais com prazo. O parceiro filtra por elas e vê as que estão em andamento na página do programa.</li>
              <li><strong>Produtores</strong> são canais, escolas e criadores com curso que pediram afiliados. Marque o status conforme a conversa avança.</li>
            </ol>
            <p className="campo__dica">
              Quer ver a biblioteca exatamente como o parceiro vê? Use <strong>Ver como parceiro</strong> na
              página de materiais.
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
