import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { AcaoMaterial } from '@/components/parceiro/AcaoMaterial'
import { CabecalhoParceiro } from '@/components/parceiro/CabecalhoParceiro'
import { CartaoMaterial } from '@/components/parceiro/CartaoMaterial'
import { IconeTipo } from '@/components/parceiro/IconeTipo'
import { LinkDoMaterial } from '@/components/parceiro/LinkDoMaterial'
import { visitanteDaArea } from '@/lib/auth-parceiro'
import { ehImagem, ehVideo, extensao, personalizarMaterial, personalizarMateriais, precisaDoLink, tamanhoLegivel, tipo as tipoDe } from '@/lib/materiais'
import { linkComOrigem, origemDoMaterial, plataforma as plataformaDe } from '@/lib/plataformas'
import { obterAfiliacao } from '@/lib/store-afiliacoes'
import { listarCampanhas, listarMateriais, obterMaterial, obterProgramaPorSlug } from '@/lib/store-materiais'
import { dataLonga } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PaginaMaterial({ params }: { params: Promise<{ programa: string; id: string }> }) {
  const { programa: slug, id } = await params
  const parceiro = await visitanteDaArea()
  if (!parceiro) redirect(`/parceiro/entrar?voltar=/parceiro/${slug}/materiais/${id}`)

  const programa = await obterProgramaPorSlug(slug)
  const bruto = await obterMaterial(id)
  if (!programa || !bruto || bruto.programaId !== programa.id || bruto.arquivado) notFound()

  const previa = parceiro.tipo === 'equipe'
  const [brutos, campanhas, afiliacao] = await Promise.all([
    listarMateriais(programa.id),
    listarCampanhas(programa.id),
    previa ? null : obterAfiliacao(parceiro.candidatura.id, programa.id),
  ])
  // O link do parceiro etiquetado com este material: vai no texto (no lugar
  // de {{link}}), no bloco "seu link para este material" e no QR.
  const origem = origemDoMaterial(bruto)
  const urlBase = afiliacao?.url ?? (previa ? plataformaDe(programa.plataforma).exemplo : null)
  const linkDoMaterial = urlBase ? linkComOrigem(urlBase, programa.plataforma, origem) : null
  const material = personalizarMaterial(bruto, afiliacao?.url ?? null, programa.plataforma)
  const todos = personalizarMateriais(brutos, afiliacao?.url ?? null, programa.plataforma)
  const campanha = campanhas.find((c) => c.id === material.campanhaId)
  const relacionados = todos.filter((m) => m.id !== material.id && m.tipo === material.tipo).slice(0, 3)
  const t = tipoDe(material.tipo)
  const base = `/parceiro/${programa.slug}/materiais`
  const arquivo = `/api/materiais/${material.id}/arquivo`

  return (
    <div className="par">
      <CabecalhoParceiro nome={parceiro.nome} previa={previa} />
      <main className="par__conteudo">
        <nav className="migalhas" aria-label="Você está aqui">
          <Link href="/parceiro">Meus programas</Link> <span aria-hidden="true">/</span>{' '}
          <Link href={`/parceiro/${programa.slug}`}>{programa.nome}</Link> <span aria-hidden="true">/</span>{' '}
          <Link href={base}>Materiais</Link> <span aria-hidden="true">/</span> <span>{material.titulo}</span>
        </nav>

        <div className="detalhe">
          <div className="detalhe__previa" style={{ ['--cor-tipo' as string]: t.cor }}>
            {material.origem === 'arquivo' && ehImagem(material) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={arquivo} alt={material.titulo} />
            ) : material.origem === 'arquivo' && ehVideo(material) ? (
              <video src={arquivo} controls preload="metadata" />
            ) : material.origem === 'texto' ? (
              <pre className="detalhe__texto">{material.conteudo}</pre>
            ) : material.origem === 'link' ? (
              <div className="detalhe__icone">
                <IconeTipo tipo={material.tipo} />
                <a href={material.url ?? '#'} target="_blank" rel="noopener noreferrer" className="link-ambar" style={{ wordBreak: 'break-all' }}>{material.url}</a>
              </div>
            ) : (
              <div className="detalhe__icone">
                <IconeTipo tipo={material.tipo} />
                <span>{extensao(material)}{material.tamanho ? ` · ${tamanhoLegivel(material.tamanho)}` : ''}</span>
              </div>
            )}
          </div>

          <div className="detalhe__lado">
            <div className="detalhe__etiquetas">
              <span className="etq-tipo" style={{ ['--cor-tipo' as string]: t.cor }}>{t.singular}</span>
              {material.recomendado && <span className="selo selo--ambar">★ Recomendado</span>}
              {material.formato && <span className="selo">{material.formato}</span>}
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)' }}>{material.titulo}</h1>
            {material.descricao && <p className="subtitulo" style={{ whiteSpace: 'pre-wrap' }}>{material.descricao}</p>}

            {precisaDoLink(material) && !previa && (
              <div className="aviso aviso--info" role="status">
                <p>
                  <strong>Este texto sai com o seu link dentro</strong> — assim que você cadastrar o seu link de vendas.{' '}
                  <Link href={`/parceiro/${programa.slug}#link`} style={{ fontWeight: 700, color: 'inherit' }}>Cadastrar agora →</Link>
                </p>
              </div>
            )}

            <AcaoMaterial material={material} tamanho="g" />

            <LinkDoMaterial programaSlug={programa.slug} plataforma={programa.plataforma} link={linkDoMaterial} origem={origem} previa={previa} />

            <dl className="detalhe__dados">
              {campanha && <div><dt>Campanha</dt><dd><Link href={`${base}?campanha=${campanha.id}`}>{campanha.nome}</Link></dd></div>}
              {material.nomeArquivo && <div><dt>Arquivo</dt><dd>{material.nomeArquivo}</dd></div>}
              {material.tamanho ? <div><dt>Tamanho</dt><dd>{tamanhoLegivel(material.tamanho)}</dd></div> : null}
              {material.largura && material.altura ? <div><dt>Dimensões</dt><dd>{material.largura} × {material.altura} px</dd></div> : null}
              <div><dt>Usos</dt><dd>{material.usos}</dd></div>
              <div><dt>Atualizado</dt><dd>{dataLonga(material.atualizadoEm)}</dd></div>
              {material.tags.length > 0 && (
                <div><dt>Tags</dt><dd>{material.tags.map((tag) => <Link key={tag} className="selo" href={`${base}?busca=${encodeURIComponent(tag)}`} style={{ marginRight: 6 }}>{tag}</Link>)}</dd></div>
              )}
            </dl>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="par__secao">
            <div className="par__secao-topo">
              <h2>Mais {t.rotulo.toLowerCase()} deste programa</h2>
              <Link className="link-ambar" href={`${base}?tipo=${material.tipo}`}>Ver todos →</Link>
            </div>
            <div className="bib__grade">
              {relacionados.map((m) => (
                <CartaoMaterial key={m.id} material={m} campanha={campanhas.find((c) => c.id === m.campanhaId)?.nome} base={base} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
