import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { comissao, etapas, criteriosSelecao, plataformaVenda } from '@/lib/programa'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Como funciona o programa de afiliados: regras e comissão',
  description:
    'Comissão de 10% a 40% conforme a parceria, 30 dias de rastreio, pagamento pela plataforma de venda e critérios de seleção: as regras completas, por extenso.',
  alternates: { canonical: '/programa' },
  openGraph: {
    title: 'Como funciona o programa de afiliados do Duck Affiliate',
    description:
      'Comissão, rastreio, pagamento e critérios de seleção — a versão longa e sem marketing das regras.',
    url: '/programa',
  },
}

export default function Programa() {
  return (
    <>
      <Topo />
      <main id="conteudo" className="secao">
        <div className="envelope">
          <nav className="migalhas" aria-label="Você está aqui">
            <Link href="/">Início</Link> <span aria-hidden="true">/</span>{' '}
            <span>Sobre o programa</span>
          </nav>

          <div className="prosa">
            <span className="olho">Documento aberto</span>
            <h1>Como funciona o programa de afiliados do {site.nome}</h1>
            <p className="subtitulo">
              A versão longa e sem marketing do que estamos propondo. Se você vai colocar seu
              nome em uma indicação, merece ler as regras inteiras antes.
            </p>

            <h2>O que é</h2>
            <p>
              Um programa de afiliados para criadores de conteúdo educacional, com foco em canais
              do YouTube. Você indica os cursos para a sua audiência; a venda, o rastreio e o
              pagamento acontecem na plataforma de venda do curso (como {plataformaVenda.exemplos});
              você recebe a comissão por venda aprovada.
            </p>
            <p>
              A tese é simples: existem milhares de criadores produzindo conteúdo sério sobre
              economia, história, filosofia, matemática e outras áreas, com comunidades
              qualificadas e sem produto próprio para monetizar. Do outro lado existe um catálogo
              de cursos que já funciona comercialmente. O programa conecta as duas pontas.
            </p>
            <p>
              O {site.nome} é a estrutura da parceria — recrutamento, seleção, material e
              acompanhamento. O primeiro catálogo de cursos disponível dentro dela é produzido
              pelo {site.produtor}; daí a assinatura <em>{site.selo}</em>. A arquitetura foi
              desenhada para receber outros produtores de conteúdo educacional depois.
            </p>

            <h2>O que você recebe</h2>
            <ul>
              <li>
                Comissão de <strong>{comissao.minima}% a {comissao.maxima}%</strong> por venda
                aprovada, definida por análise interna de cada parceria.
              </li>
              <li>Link de afiliado e cupom de desconto exclusivo com o seu nome.</li>
              <li>
                Kit de divulgação pensado para o YouTube: thumbnails, cortes editados, roteiro de
                menção, texto de descrição e comentário fixado.
              </li>
              <li>Calendário de campanhas e cronograma de descontos com antecedência.</li>
              <li>Acesso à comunidade de parceiros e contato direto com a equipe do produto.</li>
            </ul>

            <h2>O que esperamos de você</h2>
            <ul>
              <li>
                <strong>Honestidade com a audiência.</strong> Só indique se você realmente acha
                que o curso serve para quem te acompanha.
              </li>
              <li>
                <strong>Identificação da parceria.</strong> Deixe claro que a indicação é
                remunerada — exigência do CDC e do bom senso.
              </li>
              <li>
                <strong>Sem spam.</strong> Nada de disparo em massa, comentário automatizado ou
                tráfego incentivado.
              </li>
              <li>
                <strong>Alinhamento prévio</strong> quando for criar material próprio sobre os
                produtos, para não conflitar com campanha em andamento.
              </li>
            </ul>

            <h2>Comissão, rastreio e pagamento</h2>
            <p>
              O percentual de cada parceria fica entre {comissao.minima}% e {comissao.maxima}% e é
              definido na aprovação, por análise interna: o encaixe do conteúdo com o curso, o
              perfil da audiência, o formato de divulgação e o contexto da campanha ou do produto.
              O número é combinado com você antes de a divulgação começar.
            </p>
            <p>
              Toda a operação financeira é da plataforma de venda. Ela identifica a origem da venda, calcula
              a comissão e paga direto na sua conta — não há repasse manual da nossa parte, e
              você audita cada venda no painel da plataforma.
            </p>
            <ul>
              <li>
                <strong>Rastreio:</strong> {comissao.cookieDias} dias de cookie, atribuição por{' '}
                {comissao.atribuicao}.
              </li>
              <li>
                <strong>Pagamento:</strong> {comissao.prazoPagamento}, seguindo o calendário da
                plataforma.
              </li>
              <li>
                <strong>Reembolso:</strong> venda cancelada dentro do prazo de garantia estorna a
                comissão correspondente. É a regra padrão de qualquer programa sério.
              </li>
            </ul>

            <h2>O processo, passo a passo</h2>
            <ol>
              {etapas.map((etapa) => (
                <li key={etapa.numero}>
                  <strong>{etapa.titulo}</strong> ({etapa.prazo}) — {etapa.descricao}
                </li>
              ))}
            </ol>

            <h2>Critérios de seleção</h2>
            <p>
              A análise é humana e considera quatro pontos, nesta ordem de importância:
            </p>
            <ul>
              {criteriosSelecao.map((criterio) => (
                <li key={criterio.titulo}>
                  <strong>{criterio.titulo}</strong> — {criterio.descricao}
                </li>
              ))}
            </ul>
            <p>
              Não usamos número mínimo de inscritos como corte. Um canal pequeno com comunidade
              forte e alinhada pesa mais na análise do que um perfil grande e disperso.
            </p>

            <h2>Encerramento da parceria</h2>
            <p>
              Qualquer um dos lados pode encerrar quando quiser, sem multa. Comissões de vendas já
              aprovadas continuam sendo pagas normalmente pela plataforma de venda. Descredenciamos parceiros
              que descumpram as regras de divulgação — sobretudo spam e promessa de resultado
              financeiro em nome do produto.
            </p>

            <div className="cartao" style={{ marginTop: 20 }}>
              <h3>Pronto para se candidatar?</h3>
              <p>
                Leva cinco minutos e a resposta sai em até {comissao.prazoResposta} dias úteis.
              </p>
              <Link className="botao botao--avanco" href="/inscricao" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                Quero ser afiliado
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Rodape />
    </>
  )
}
