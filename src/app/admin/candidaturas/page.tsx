import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CabecalhoAdmin } from '@/components/admin/CabecalhoAdmin'
import { estaAutenticado } from '@/lib/auth'
import { listarCandidaturas, metricas, modoPersistencia } from '@/lib/store'
import { STATUS, STATUS_ROTULO, type Status } from '@/lib/schema'
import { areas } from '@/lib/programa'
import { faixaDoScore } from '@/lib/score'
import { dataCurta, nomeDaArea } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ListaCandidaturas({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  if (!(await estaAutenticado())) redirect('/admin/entrar?voltar=/admin/candidaturas')

  const filtros = await searchParams
  const status = (filtros.status ?? 'todos') as Status | 'todos'
  const area = filtros.area ?? 'todas'
  const busca = filtros.busca ?? ''

  const [lista, resumo] = await Promise.all([
    listarCandidaturas({ status, area, busca }),
    metricas(),
  ])

  return (
    <div className="adm">
      <CabecalhoAdmin modo={modoPersistencia()} />

      <div className="adm__conteudo">
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)' }}>Candidaturas</h1>
          <p className="campo__dica" style={{ maxWidth: '64ch' }}>
            Quem se inscreveu em <code>/inscricao</code>. Abra a ficha para ler o canal, anotar a análise e
            mudar o status. Ao marcar <strong>Aprovado</strong>, o candidato recebe o e-mail de boas-vindas
            e passa a entrar na área do parceiro.
          </p>
        </div>

        <div className="adm__metricas">
          <div className="metrica">
            <p className="metrica__valor">{resumo.total}</p>
            <p className="metrica__rotulo">Candidaturas no total</p>
          </div>
          <div className="metrica">
            <p className="metrica__valor">{resumo.ultimos7}</p>
            <p className="metrica__rotulo">Nos últimos 7 dias</p>
          </div>
          <div className="metrica">
            <p className="metrica__valor">{resumo.naFila}</p>
            <p className="metrica__rotulo">Aguardando análise</p>
          </div>
          <div className="metrica">
            <p className="metrica__valor">{resumo.aprovados}</p>
            <p className="metrica__rotulo">Parceiros aprovados</p>
          </div>
        </div>

        {modoPersistencia() === 'arquivo' && (
          <div className="aviso aviso--erro">
            <p>
              <strong>Modo local ativo.</strong> As candidaturas estão sendo gravadas em{' '}
              <code>.data/candidaturas.json</code>, que não sobrevive a um deploy. Configure{' '}
              <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>SUPABASE_SERVICE_ROLE_KEY</code> antes
              de colocar o site no ar.
            </p>
          </div>
        )}

        <form className="adm__filtros" method="get">
          <div className="campo">
            <label htmlFor="f-status">Status</label>
            <select id="f-status" name="status" defaultValue={status}>
              <option value="todos">Todos</option>
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_ROTULO[s]}
                  {resumo.porStatus[s] ? ` (${resumo.porStatus[s]})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="f-area">Área</label>
            <select id="f-area" name="area" defaultValue={area}>
              <option value="todas">Todas</option>
              {areas.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="f-busca">Buscar</label>
            <input
              id="f-busca"
              name="busca"
              type="search"
              placeholder="Nome, e-mail ou canal"
              defaultValue={busca}
            />
          </div>

          <button className="botao" type="submit">
            Filtrar
          </button>
          <a className="botao botao--secundario" href="/api/admin/exportar" download title="Baixa a lista inteira em CSV, para planilha">
            Exportar CSV
          </a>
          {(status !== 'todos' || area !== 'todas' || busca) && (
            <Link className="botao botao--fantasma" href="/admin/candidaturas">
              Limpar
            </Link>
          )}
        </form>

        <div className="tabela-caixa">
          {lista.length === 0 ? (
            <p className="adm__vazio">
              Nenhuma candidatura encontrada com esses filtros.
            </p>
          ) : (
            <table className="adm-tabela">
              <thead>
                <tr>
                  <th>Prioridade</th>
                  <th>Candidato</th>
                  <th>Canal</th>
                  <th>Área</th>
                  <th>Audiência</th>
                  <th>Status</th>
                  <th>Recebida</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((c) => {
                  const faixa = faixaDoScore(c.score)
                  return (
                    <tr key={c.id}>
                      <td>
                        <span className="pontuacao" data-tom={faixa.tom} title={faixa.rotulo}>
                          {c.score}
                          <span className="pontuacao__barra">
                            <span
                              className="pontuacao__preenchimento"
                              style={{ width: `${c.score}%` }}
                            />
                          </span>
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/${c.id}`}>{c.nome}</Link>
                        <p className="celula-secundaria">{c.email}</p>
                      </td>
                      <td>
                        {c.canalNome}
                        <p className="celula-secundaria">{c.plataformaPrincipal}</p>
                      </td>
                      <td>{nomeDaArea(c.area)}</td>
                      <td>{c.audiencia}</td>
                      <td>
                        <span className="etiqueta" data-status={c.status}>
                          {STATUS_ROTULO[c.status]}
                        </span>
                      </td>
                      <td>{dataCurta(c.criadoEm)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="campo__dica">
          {lista.length} candidatura{lista.length === 1 ? '' : 's'} listada
          {lista.length === 1 ? '' : 's'}. A pontuação é uma triagem automática para ordenar a
          fila — a decisão continua sendo humana.
        </p>
      </div>
    </div>
  )
}
