import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CabecalhoParceiro } from '@/components/parceiro/CabecalhoParceiro'
import { CartaoMaterial } from '@/components/parceiro/CartaoMaterial'
import { visitanteDaArea } from '@/lib/auth-parceiro'
import { personalizarMateriais } from '@/lib/materiais'
import { plataforma as plataformaDe } from '@/lib/plataformas'
import { site } from '@/lib/site'
import { listarAfiliacoes } from '@/lib/store-afiliacoes'
import { listarCampanhas, listarMateriais, listarProgramas, resumoMateriais } from '@/lib/store-materiais'

export const dynamic = 'force-dynamic'

/**
 * Dashboard: "Meus programas". Hoje todo parceiro aprovado pertence a todos
 * os programas ativos — um só. O vínculo que já existe por programa é o
 * link de vendas (`afiliacoes`): é ele que diz se o parceiro está pronto
 * para vender ali.
 */
export default async function PainelParceiro() {
  const parceiro = await visitanteDaArea()
  if (!parceiro) redirect('/parceiro/entrar?voltar=/parceiro')

  const previa = parceiro.tipo === 'equipe'
  const [programas, afiliacoes] = await Promise.all([
    listarProgramas(),
    previa ? [] : listarAfiliacoes({ candidaturaId: parceiro.candidatura.id }),
  ])
  const linkDe = (programaId: string) => afiliacoes.find((a) => a.programaId === programaId)?.url ?? null

  const cartoes = await Promise.all(
    programas.map(async (p) => {
      const [resumo, campanhas, brutos] = await Promise.all([resumoMateriais(p.id), listarCampanhas(p.id), listarMateriais(p.id)])
      const materiais = personalizarMateriais(brutos, linkDe(p.id), p.plataforma)
      return { programa: p, resumo, campanhas, materiais, campanhasAtivas: campanhas.filter((c) => c.ativa).length, pronto: Boolean(linkDe(p.id)) }
    }),
  )
  const pendentes = previa ? [] : cartoes.filter((c) => !c.pronto)
  // Novidades: os últimos publicados em qualquer programa. Quem volta à área
  // vê o que mudou desde a última vez sem abrir biblioteca por biblioteca.
  const novidades = cartoes
    .flatMap((c) => c.materiais.map((m) => ({ m, programa: c.programa, campanha: c.campanhas.find((x) => x.id === m.campanhaId)?.nome })))
    .sort((a, b) => b.m.criadoEm.localeCompare(a.m.criadoEm))
    .slice(0, 4)

  return (
    <div className="par">
      <CabecalhoParceiro nome={parceiro.nome} previa={previa} />
      <main className="par__conteudo">
        <div className="par__cabeca">
          <span className="olho">Meus programas</span>
          <h1>Olá, {parceiro.nome.split(' ')[0]}.</h1>
          <p className="subtitulo">
            Cada programa tem a própria biblioteca de materiais de divulgação. Entre no programa
            para encontrar tudo o que precisa para promovê-lo.
          </p>
        </div>

        {pendentes.length > 0 && (
          <div className="aviso aviso--info pendencia" role="status">
            <p>
              <strong>Falta um passo para vender:</strong> cadastre o seu link da{' '}
              {plataformaDe(pendentes[0].programa.plataforma).nome} em{' '}
              {pendentes.map((c, i) => (
                <span key={c.programa.id}>
                  {i > 0 && ', '}
                  <Link href={`/parceiro/${c.programa.slug}#link`}>{c.programa.nome}</Link>
                </span>
              ))}
              . Leva um minuto e é o que atribui as vendas a você.
            </p>
          </div>
        )}

        <div className="grade grade--2">
          {cartoes.map(({ programa, resumo, campanhasAtivas, pronto }) => (
            <Link key={programa.id} className="cartao cartao--interativo programa-cartao" href={`/parceiro/${programa.slug}`}>
              <span className="olho">{programa.produtor}</span>
              <h2 style={{ fontSize: '1.45rem' }}>{programa.nome}</h2>
              <p>{programa.descricao}</p>
              {!previa && (
                <span className="programa-cartao__status" data-pronto={pronto}>
                  {pronto ? '✓ Pronto para vender' : 'Falta seu link de vendas'}
                </span>
              )}
              <dl className="programa-cartao__numeros">
                <div><dt>Materiais</dt><dd>{resumo.total}</dd></div>
                <div><dt>Recomendados</dt><dd>{resumo.recomendados}</dd></div>
                <div><dt>Campanhas ativas</dt><dd>{campanhasAtivas}</dd></div>
              </dl>
              <span className="link-ambar">Materiais de divulgação →</span>
            </Link>
          ))}
        </div>

        {novidades.length > 0 && (
          <section className="par__secao">
            <div className="par__secao-topo">
              <div>
                <h2>Novidades</h2>
                <p className="subtitulo">Os últimos materiais publicados. Vale conferir a cada visita.</p>
              </div>
            </div>
            <div className="bib__grade">
              {novidades.map(({ m, programa, campanha }) => (
                <CartaoMaterial key={m.id} material={m} campanha={campanha} base={`/parceiro/${programa.slug}/materiais`} />
              ))}
            </div>
          </section>
        )}

        <section className="par__secao" id="ajuda">
          <div className="par__secao-topo">
            <div>
              <h2>Como usar a área do parceiro</h2>
              <p className="subtitulo">Quatro passos, sem segredo.</p>
            </div>
          </div>
          <div className="como-usar">
            <div className="como-usar__passo">
              <span>1</span>
              <h3>Cole seu link de vendas</h3>
              <p>Na página do programa, cadastre o link que a plataforma (Hotmart) gerou para você. É ele que atribui cada venda a você.</p>
            </div>
            <div className="como-usar__passo">
              <span>2</span>
              <h3>Pegue o seu QR code</h3>
              <p>Gerado na hora a partir do seu link. Serve para vídeo, tela final, slide ou impresso: quem lê cai na sua página de venda.</p>
            </div>
            <div className="como-usar__passo">
              <span>3</span>
              <h3>Encontre o material</h3>
              <p>Filtre por tipo (thumbnail, vídeo, copy…), campanha ou formato, ou busque por palavra. Os recomendados vêm primeiro.</p>
            </div>
            <div className="como-usar__passo">
              <span>4</span>
              <h3>Baixe, copie ou abra</h3>
              <p>Arquivo se baixa, texto se copia já com o seu link dentro, link se abre. A descrição de cada material diz onde encaixa.</p>
            </div>
          </div>
          <div className="cartao" style={{ background: 'var(--superficie-2)', maxWidth: 720 }}>
            <h3>Precisa de algo que não está aqui?</h3>
            <p>
              Um formato específico, uma dúvida sobre a oferta, um cupom para uma ação sua: escreva para{' '}
              <a href={`mailto:${site.email}`} style={{ color: 'var(--ambar-texto)', fontWeight: 600 }}>{site.email}</a>.
              Respondemos em dias úteis.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
