import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CabecalhoParceiro } from '@/components/parceiro/CabecalhoParceiro'
import { CartaoMaterial } from '@/components/parceiro/CartaoMaterial'
import { LinkDeVendas } from '@/components/parceiro/LinkDeVendas'
import { visitanteDaArea } from '@/lib/auth-parceiro'
import { TIPOS, filtrarMateriais, personalizarMateriais } from '@/lib/materiais'
import { ORIGEM_QR, linkComOrigem, plataforma as plataformaDe } from '@/lib/plataformas'
import { qrSvg } from '@/lib/qr'
import { obterAfiliacao } from '@/lib/store-afiliacoes'
import { listarCampanhas, listarMateriais, obterProgramaPorSlug } from '@/lib/store-materiais'
import { dataCurta } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PaginaPrograma({ params }: { params: Promise<{ programa: string }> }) {
  const { programa: slug } = await params
  const parceiro = await visitanteDaArea()
  if (!parceiro) redirect(`/parceiro/entrar?voltar=/parceiro/${slug}`)

  const programa = await obterProgramaPorSlug(slug)
  if (!programa || !programa.ativo) notFound()

  const previa = parceiro.tipo === 'equipe'
  const [brutos, campanhas, afiliacao] = await Promise.all([
    listarMateriais(programa.id),
    listarCampanhas(programa.id),
    previa ? null : obterAfiliacao(parceiro.candidatura.id, programa.id),
  ])
  // Na prévia a equipe vê o estado "pronto" com um link de exemplo — é a
  // única forma de conferir o cartão inteiro sem uma conta de parceiro.
  const url = afiliacao?.url ?? (previa ? plataformaDe(programa.plataforma).exemplo : null)
  const linkQr = url ? linkComOrigem(url, programa.plataforma, ORIGEM_QR) : null
  const svg = linkQr ? await qrSvg(linkQr, 220) : null

  const materiais = personalizarMateriais(brutos, afiliacao?.url ?? null, programa.plataforma)
  const destaque = filtrarMateriais(materiais, { ordem: 'recomendados' }).slice(0, 6)
  const ativas = campanhas.filter((c) => c.ativa)
  const base = `/parceiro/${programa.slug}/materiais`
  const porTipo = TIPOS.map((t) => ({ ...t, n: materiais.filter((m) => m.tipo === t.slug).length })).filter((t) => t.n > 0)

  return (
    <div className="par">
      <CabecalhoParceiro nome={parceiro.nome} previa={previa} />
      <main className="par__conteudo">
        <nav className="migalhas" aria-label="Você está aqui">
          <Link href="/parceiro">Meus programas</Link> <span aria-hidden="true">/</span> <span>{programa.nome}</span>
        </nav>

        <div className="par__cabeca">
          <span className="olho">{programa.produtor}</span>
          <h1>{programa.nome}</h1>
          <p className="subtitulo">{programa.descricao}</p>
        </div>

        <LinkDeVendas
          programaSlug={programa.slug}
          plataforma={programa.plataforma}
          urlAfiliacao={programa.urlAfiliacao}
          url={url}
          linkQr={linkQr}
          qrSvg={svg}
          previa={previa}
        />

        <section className="par__secao" id="materiais">
          <div className="par__secao-topo">
            <div>
              <h2>Materiais de Divulgação</h2>
              <p className="subtitulo">Encontre tudo o que você precisa para promover este canal.</p>
            </div>
            <Link className="botao" href={base}>
              Abrir a biblioteca ({materiais.length})
            </Link>
          </div>

          {porTipo.length > 0 && (
            <div className="chips" aria-label="Materiais por tipo">
              {porTipo.map((t) => (
                <Link key={t.slug} className="chip" href={`${base}?tipo=${t.slug}`} style={{ ['--cor-tipo' as string]: t.cor }}>
                  <span className="chip__ponto" />{t.rotulo} <b>{t.n}</b>
                </Link>
              ))}
            </div>
          )}

          {destaque.length === 0 ? (
            <div className="aviso aviso--info">
              <p><strong>A biblioteca deste programa ainda está sendo montada.</strong> Assim que o primeiro material for publicado, ele aparece aqui.</p>
            </div>
          ) : (
            <div className="bib__grade">
              {destaque.map((m) => (
                <CartaoMaterial key={m.id} material={m} campanha={campanhas.find((c) => c.id === m.campanhaId)?.nome} base={base} />
              ))}
            </div>
          )}
        </section>

        {ativas.length > 0 && (
          <section className="par__secao">
            <div className="par__secao-topo">
              <div>
                <h2>Campanhas em andamento</h2>
                <p className="subtitulo">Materiais com prazo. Encaixe no seu calendário de pauta.</p>
              </div>
            </div>
            <div className="grade grade--2">
              {ativas.map((c) => (
                <Link key={c.id} className="cartao cartao--interativo" href={`${base}?campanha=${c.id}`}>
                  <h3>{c.nome}</h3>
                  {c.descricao && <p>{c.descricao}</p>}
                  <p className="campo__dica">
                    {c.inicio ? `De ${dataCurta(c.inicio)}` : 'Sem data de início'}{c.fim ? ` até ${dataCurta(c.fim)}` : ''} ·{' '}
                    {materiais.filter((m) => m.campanhaId === c.id).length} materiais
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
