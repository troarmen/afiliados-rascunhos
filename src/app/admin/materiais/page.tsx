import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CabecalhoAdmin } from '@/components/admin/CabecalhoAdmin'
import { IconeTipo } from '@/components/parceiro/IconeTipo'
import { estaAutenticado } from '@/lib/auth'
import { modoPersistencia } from '@/lib/store'
import { listarCampanhas, listarMateriais, listarProgramas } from '@/lib/store-materiais'
import { TIPOS, ehImagem, extensao, tipo as tipoDe, type TipoMaterial } from '@/lib/materiais'
import { dataCurta } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function MateriaisAdmin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  if (!(await estaAutenticado())) redirect('/admin/entrar?voltar=/admin/materiais')

  const f = await searchParams
  const programas = await listarProgramas(false)
  const programa = programas.find((p) => p.id === f.programa) ?? programas[0]
  if (!programa) {
    return (
      <div className="adm">
        <CabecalhoAdmin modo={modoPersistencia()} />
        <div className="adm__conteudo">
          <p className="adm__vazio">Nenhum programa cadastrado.</p>
        </div>
      </div>
    )
  }

  const [todos, campanhas] = await Promise.all([
    listarMateriais(programa.id, { incluirArquivados: true }),
    listarCampanhas(programa.id),
  ])

  const tipo = (f.tipo ?? 'todos') as TipoMaterial | 'todos'
  const campanha = f.campanha ?? 'todas'
  const mostrar = f.mostrar ?? 'ativos'
  const busca = (f.busca ?? '').trim().toLowerCase()

  let lista = todos
  if (mostrar === 'ativos') lista = lista.filter((m) => !m.arquivado)
  if (mostrar === 'arquivados') lista = lista.filter((m) => m.arquivado)
  if (tipo !== 'todos') lista = lista.filter((m) => m.tipo === tipo)
  if (campanha !== 'todas') lista = lista.filter((m) => (m.campanhaId ?? 'sem') === campanha)
  if (busca) lista = lista.filter((m) => [m.titulo, m.descricao, m.tags.join(' ')].join(' ').toLowerCase().includes(busca))

  const ativos = todos.filter((m) => !m.arquivado)
  const nomeCampanha = (id: string | null) => campanhas.find((c) => c.id === id)?.nome ?? '—'
  const filtrado = tipo !== 'todos' || campanha !== 'todas' || mostrar !== 'ativos' || busca

  return (
    <div className="adm">
      <CabecalhoAdmin modo={modoPersistencia()} />

      <div className="adm__conteudo">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)' }}>Materiais de divulgação</h1>
            <p className="campo__dica">
              {programa.nome} · o que o parceiro vê em <code>/parceiro/{programa.slug}/materiais</code>
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              className="botao botao--secundario"
              href={`/parceiro/${programa.slug}/materiais`}
              target="_blank"
              rel="noopener noreferrer"
              title="Abre a biblioteca exatamente como o parceiro aprovado vê, em outra aba"
            >
              Ver como parceiro ↗
            </a>
            <Link className="botao" href="/admin/materiais/novo">
              + Novo material
            </Link>
          </div>
        </div>

        <details className="ajuda-painel" open={todos.length === 0}>
          <summary>Como a biblioteca funciona</summary>
          <div className="ajuda-painel__corpo">
            <ol>
              <li>Publique um material em <strong>Novo material</strong>: arquivo (baixar), texto (copiar) ou link (abrir).</li>
              <li>Escolha o <strong>tipo</strong> mais específico — é o filtro do parceiro — e, se tiver prazo, a <strong>campanha</strong>.</li>
              <li>Marque <strong>Recomendado</strong> no que deve aparecer primeiro. <strong>Arquivar</strong> esconde sem apagar; <strong>Excluir</strong> apaga o arquivo.</li>
            </ol>
          </div>
        </details>

        <div className="adm__metricas">
          <div className="metrica">
            <p className="metrica__valor">{ativos.length}</p>
            <p className="metrica__rotulo">Materiais ativos</p>
          </div>
          <div className="metrica">
            <p className="metrica__valor">{ativos.filter((m) => m.recomendado).length}</p>
            <p className="metrica__rotulo">Recomendados</p>
          </div>
          <div className="metrica">
            <p className="metrica__valor">{ativos.reduce((s, m) => s + m.usos, 0)}</p>
            <p className="metrica__rotulo">Usos (download, cópia, clique)</p>
          </div>
          <div className="metrica">
            <p className="metrica__valor">{campanhas.filter((c) => c.ativa).length}</p>
            <p className="metrica__rotulo">Campanhas ativas</p>
          </div>
        </div>

        <form className="adm__filtros" method="get">
          {programas.length > 1 && (
            <div className="campo">
              <label htmlFor="f-programa">Programa</label>
              <select id="f-programa" name="programa" defaultValue={programa.id}>
                {programas.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
          )}
          <div className="campo">
            <label htmlFor="f-tipo">Tipo</label>
            <select id="f-tipo" name="tipo" defaultValue={tipo}>
              <option value="todos">Todos</option>
              {TIPOS.map((t) => (
                <option key={t.slug} value={t.slug}>{t.rotulo}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-campanha">Campanha</label>
            <select id="f-campanha" name="campanha" defaultValue={campanha}>
              <option value="todas">Todas</option>
              <option value="sem">Sem campanha</option>
              {campanhas.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-mostrar">Mostrar</label>
            <select id="f-mostrar" name="mostrar" defaultValue={mostrar}>
              <option value="ativos">Ativos</option>
              <option value="arquivados">Arquivados</option>
              <option value="todos">Todos</option>
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-busca">Buscar</label>
            <input id="f-busca" name="busca" type="search" placeholder="Título, descrição ou tag" defaultValue={f.busca ?? ''} />
          </div>
          <button className="botao" type="submit">Filtrar</button>
          {filtrado && (
            <Link className="botao botao--fantasma" href="/admin/materiais">Limpar</Link>
          )}
        </form>

        <div className="tabela-caixa">
          {lista.length === 0 ? (
            <div className="adm__vazio">
              <p>{todos.length === 0 ? 'Nenhum material ainda.' : 'Nada com esses filtros.'}</p>
              {todos.length === 0 && (
                <Link className="botao" href="/admin/materiais/novo" style={{ marginTop: 16 }}>
                  Enviar o primeiro material
                </Link>
              )}
            </div>
          ) : (
            <table className="adm-tabela">
              <thead>
                <tr>
                  <th style={{ width: 64 }}></th>
                  <th>Material</th>
                  <th>Tipo</th>
                  <th>Formato</th>
                  <th>Campanha</th>
                  <th>Usos</th>
                  <th>Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((m) => {
                  const t = tipoDe(m.tipo)
                  return (
                    <tr key={m.id} style={m.arquivado ? { opacity: 0.55 } : undefined}>
                      <td>
                        <span className="mini-capa" style={{ ['--cor-tipo' as string]: t.cor }}>
                          {ehImagem(m) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={`/api/materiais/${m.id}/arquivo`} alt="" loading="lazy" />
                          ) : (
                            <IconeTipo tipo={m.tipo} />
                          )}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/materiais/${m.id}`}>{m.titulo}</Link>
                        <p className="celula-secundaria" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          {m.recomendado && <span className="etiqueta" data-status="aprovado">★ Recomendado</span>}
                          {m.arquivado && <span className="etiqueta" data-status="standby">Arquivado</span>}
                          <span>{extensao(m)}{m.nomeArquivo ? ` · ${m.nomeArquivo}` : ''}</span>
                        </p>
                      </td>
                      <td>{t.singular}</td>
                      <td>{m.formato || '—'}</td>
                      <td>{nomeCampanha(m.campanhaId)}</td>
                      <td>{m.usos}</td>
                      <td>{dataCurta(m.atualizadoEm)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="campo__dica">
          {lista.length} material{lista.length === 1 ? '' : 'is'} listado{lista.length === 1 ? '' : 's'}.
          Arquivar tira da biblioteca sem apagar; excluir apaga o arquivo do storage.
        </p>
      </div>
    </div>
  )
}
