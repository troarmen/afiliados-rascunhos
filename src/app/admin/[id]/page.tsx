import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CabecalhoAdmin } from '@/components/admin/CabecalhoAdmin'
import { EditorCandidatura } from '@/components/admin/EditorCandidatura'
import { estaAutenticado } from '@/lib/auth'
import { obterCandidatura, modoPersistencia } from '@/lib/store'
import { listarAfiliacoes } from '@/lib/store-afiliacoes'
import { listarProgramas } from '@/lib/store-materiais'
import { plataforma as plataformaDe } from '@/lib/plataformas'
import { faixaDoScore } from '@/lib/score'
import { dataLonga, nomeDaArea, normalizarUrl } from '@/lib/utils'
import { linkWhatsApp, site } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function FichaCandidato({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await estaAutenticado())) redirect(`/admin/entrar?voltar=/admin/${id}`)

  const c = await obterCandidatura(id)
  if (!c) notFound()

  const faixa = faixaDoScore(c.score)
  const redes = Object.entries(c.redes ?? {}).filter(([, valor]) => Boolean(valor))
  const [afiliacoes, programas] = await Promise.all([listarAfiliacoes({ candidaturaId: c.id }), listarProgramas(false)])
  const whatsapp = linkWhatsApp(
    `Olá, ${c.nome.split(' ')[0]}! Aqui é da equipe do ${site.nome}, sobre a sua inscrição no programa de afiliados.`,
  )

  return (
    <div className="adm">
      <CabecalhoAdmin modo={modoPersistencia()} />

      <div className="adm__conteudo">
        <nav className="migalhas">
          <Link href="/admin">← Voltar para a fila</Link>
        </nav>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 1.2rem + 1.4vw, 2.1rem)' }}>{c.nome}</h1>
          <span className="pontuacao" data-tom={faixa.tom}>
            {c.score}
            <span className="pontuacao__barra">
              <span className="pontuacao__preenchimento" style={{ width: `${c.score}%` }} />
            </span>
          </span>
          <span className="selo">{faixa.rotulo}</span>
        </div>

        <div className="adm__ficha">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <section className="ficha-bloco">
              <h2>Candidatura</h2>
              <dl className="ficha-lista">
                <div>
                  <dt>Canal / projeto</dt>
                  <dd>
                    <a
                      href={normalizarUrl(c.canalUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--ambar-texto)', fontWeight: 600 }}
                    >
                      {c.canalNome}
                    </a>
                    <div className="celula-secundaria">{c.canalUrl}</div>
                  </dd>
                </div>
                <div>
                  <dt>Plataforma principal</dt>
                  <dd>{c.plataformaPrincipal}</dd>
                </div>
                <div>
                  <dt>Área</dt>
                  <dd>{nomeDaArea(c.area)}</dd>
                </div>
                <div>
                  <dt>Audiência</dt>
                  <dd>{c.audiencia}</dd>
                </div>
                <div>
                  <dt>Formas de divulgação</dt>
                  <dd>{c.formasDivulgacao.join(', ')}</dd>
                </div>
                <div>
                  <dt>Conta na Hotmart</dt>
                  <dd>{c.jaEhAfiliadoHotmart ? 'Já possui' : 'Ainda não tem'}</dd>
                </div>
                {redes.length > 0 && (
                  <div>
                    <dt>Outras redes</dt>
                    <dd>
                      {redes.map(([rede, valor]) => (
                        <div key={rede}>
                          <strong style={{ textTransform: 'capitalize' }}>{rede}:</strong> {valor}
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Como conheceu</dt>
                  <dd>{c.comoConheceu || '—'}</dd>
                </div>
                <div>
                  <dt>Origem</dt>
                  <dd>{c.origem || '—'}</dd>
                </div>
                <div>
                  <dt>Recebida em</dt>
                  <dd>{dataLonga(c.criadoEm)}</dd>
                </div>
              </dl>
            </section>

            <section className="ficha-bloco">
              <h2>Link de vendas</h2>
              {afiliacoes.length === 0 ? (
                <p className="ficha-texto">
                  {c.status === 'aprovado'
                    ? 'Ainda não cadastrou. O parceiro cola o link da plataforma na página do programa, dentro da área dele — até lá, os textos saem sem link e não há QR.'
                    : 'Só depois de aprovado: o parceiro cadastra o link da plataforma na área dele.'}
                </p>
              ) : (
                <dl className="ficha-lista">
                  {afiliacoes.map((a) => {
                    const programa = programas.find((p) => p.id === a.programaId)
                    return (
                      <div key={a.id}>
                        <dt>{programa?.nome ?? 'Programa'}</dt>
                        <dd>
                          <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ambar-texto)', fontWeight: 600, overflowWrap: 'anywhere' }}>
                            {a.url}
                          </a>
                          <div className="celula-secundaria">
                            {plataformaDe(programa?.plataforma).nome} · atualizado em {dataLonga(a.atualizadoEm)}
                          </div>
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              )}
            </section>

            <section className="ficha-bloco">
              <h2>Por que quer participar</h2>
              <p className="ficha-texto">{c.motivacao}</p>
            </section>

            {c.experiencia && (
              <section className="ficha-bloco">
                <h2>Experiência anterior</h2>
                <p className="ficha-texto">{c.experiencia}</p>
              </section>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <section className="ficha-bloco">
              <h2>Contato</h2>
              <dl className="ficha-lista">
                <div>
                  <dt>E-mail</dt>
                  <dd>
                    <a href={`mailto:${c.email}`} style={{ color: 'var(--ambar-texto)' }}>
                      {c.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>WhatsApp</dt>
                  <dd>{c.telefone}</dd>
                </div>
              </dl>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a className="botao botao--secundario" href={`mailto:${c.email}`}>
                  Escrever e-mail
                </a>
                {whatsapp && (
                  <a
                    className="botao botao--secundario"
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir WhatsApp
                  </a>
                )}
              </div>
            </section>

            <EditorCandidatura
              id={c.id}
              status={c.status}
              notas={c.notas}
              responsavel={c.responsavel}
              atualizadoEm={c.atualizadoEm}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
