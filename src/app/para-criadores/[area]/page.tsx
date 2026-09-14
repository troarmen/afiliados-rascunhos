import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { ListaFaq } from '@/components/secoes/Faq'
import { areasComPagina, comissao, faq } from '@/lib/programa'
import { site, urlAbsoluta } from '@/lib/site'

/**
 * Páginas programáticas de SEO — uma por área de conteúdo.
 * Alvo: buscas do tipo "como monetizar canal de história",
 * "programa de afiliados para professor de economia".
 *
 * Cada página precisa de texto próprio, e não de um template com a palavra
 * trocada: página fina não ranqueia e ainda queima a autoridade do domínio.
 */

type Conteudo = {
  titulo: string
  /**
   * Usado só no <title>, quando o `titulo` mais o sufixo da marca passa de
   * ~70 caracteres e o Google corta. Hoje só "concursos e vestibulares"
   * precisa: o H1 continua com o nome inteiro da área.
   */
  tituloSeo?: string
  /**
   * Linha curta só para a meta description.
   *
   * Antes a description era `intro` + o fecho comercial, e as dez páginas
   * passavam de 185 caracteres — o Google cortava exatamente no fecho
   * ("10% a 40%, material pronto, sem custo"), que é o que faz clicar.
   * O resumo cabe no corte e não repete o title.
   */
  resumo: string
  intro: string
  contexto: string
  encaixe: string[]
  formatos: string[]
}

const CONTEUDO: Record<string, Conteudo> = {
  economia: {
    resumo:
      'Seu canal explica inflação, juros e câmbio para quem acompanha de verdade.',
    titulo: 'Programa de afiliados para canais de economia',
    intro:
      'Se você explica inflação, juros, câmbio ou política monetária para uma audiência que realmente acompanha, este programa foi desenhado literalmente para o seu caso.',
    contexto:
      'Economia é a área-núcleo do catálogo do Rascunhos Econômicos. É onde o encaixe entre o que você já publica e o que o curso entrega é mais direto: quem assiste seu vídeo sobre política monetária é exatamente quem termina o curso.',
    encaixe: [
      'Canais que traduzem indicadores e notícias econômicas para o público geral',
      'Professores de economia, macro e microeconomia com presença digital',
      'Newsletters de análise econômica e de conjuntura',
      'Podcasts de economia política e história econômica',
    ],
    formatos: [
      'Menção no meio do vídeo, quando o assunto pede aprofundamento',
      'Vídeo dedicado explicando o que o curso cobre e para quem serve',
      'Seção fixa da newsletter com o cupom da sua audiência',
    ],
  },
  historia: {
    resumo:
      'Canais de história têm audiência que assiste até o fim — e economia é o passo seguinte.',
    titulo: 'Programa de afiliados para canais de história',
    intro:
      'História e economia se explicam uma pela outra. Se o seu público gosta de entender por que as coisas aconteceram, ele já está a um passo de querer entender como a economia funciona.',
    contexto:
      'Canais de história têm uma das audiências mais fiéis da internet brasileira — gente que assiste vídeo de 40 minutos até o fim. Esse tipo de atenção converte muito melhor do que alcance de viral.',
    encaixe: [
      'Canais de história do Brasil, história geral e história econômica',
      'Criadores de conteúdo sobre guerras, revoluções e formação de Estados',
      'Professores de história com comunidade de alunos e ex-alunos',
      'Podcasts narrativos com público recorrente',
    ],
    formatos: [
      'Gancho no episódio sobre crise, moeda, comércio ou industrialização',
      'Indicação de leitura complementar ao fim do vídeo',
      'Publicação na comunidade fechada do canal',
    ],
  },
  filosofia: {
    resumo:
      'Sua audiência topa exercício difícil, e é ela que termina um curso.',
    titulo: 'Programa de afiliados para canais de filosofia',
    intro:
      'Sua audiência já topa exercício intelectual difícil. Essa é exatamente a audiência que termina um curso — e que decide comprar por argumento, não por gatilho de escassez.',
    contexto:
      'Filosofia política e economia dividem quase todo o repertório: propriedade, liberdade, Estado, justiça distributiva. A ponte entre o seu conteúdo e o curso é curta e honesta.',
    encaixe: [
      'Canais de filosofia política, ética e teoria do conhecimento',
      'Professores e mestrandos com produção de conteúdo regular',
      'Clubes de leitura e comunidades de estudo',
      'Newsletters de ensaios e resenhas',
    ],
    formatos: [
      'Episódio sobre um autor que discute economia e sociedade',
      'Indicação em texto longo, com argumento próprio',
      'Recomendação na comunidade de estudo',
    ],
  },
  matematica: {
    resumo:
      'Quem ensina matemática tem a credibilidade de quem prova o que diz.',
    titulo: 'Programa de afiliados para canais de matemática',
    intro:
      'Quem ensina matemática tem a credibilidade mais difícil de comprar: a de quem prova o que diz. Vale usar isso para indicar formação de verdade.',
    contexto:
      'Boa parte do público de matemática aplicada quer usar o raciocínio em algo concreto — e economia é a aplicação mais natural. Estatística, otimização e modelos aparecem dos dois lados.',
    encaixe: [
      'Canais de matemática aplicada, estatística e raciocínio lógico',
      'Professores de exatas com público de vestibular e graduação',
      'Criadores de conteúdo sobre dados e modelagem',
      'Comunidades de estudo e monitoria',
    ],
    formatos: [
      'Vídeo mostrando a matemática por trás de um conceito econômico',
      'Indicação para quem quer aplicar o que aprendeu',
      'Menção nas aulas e mentorias',
    ],
  },
  sociologia: {
    resumo:
      'Desigualdade, trabalho, mercado, classe: metade do vocabulário já é economia.',
    titulo: 'Programa de afiliados para canais de sociologia',
    intro:
      'Desigualdade, trabalho, mercado, classe: metade do vocabulário da sociologia é economia. Seu público já está fazendo a pergunta que o curso responde.',
    contexto:
      'Canais de sociologia costumam ter audiência crítica, que rejeita publicidade rasa — e responde muito bem a indicação argumentada, feita com o mesmo rigor do restante do conteúdo.',
    encaixe: [
      'Canais de sociologia, antropologia e ciência política',
      'Professores do ensino médio e superior com presença digital',
      'Coletivos e comunidades de estudo',
      'Newsletters de análise social',
    ],
    formatos: [
      'Episódio sobre trabalho, renda ou desigualdade',
      'Indicação de aprofundamento para os alunos',
      'Publicação em grupo de estudo',
    ],
  },
  direito: {
    resumo:
      'Direito tributário, regulatório e concorrencial não se entendem sem economia.',
    titulo: 'Programa de afiliados para canais de direito',
    intro:
      'Direito tributário, regulatório e concorrencial não se entendem sem economia. Seu público profissional sabe disso — e paga por formação que resolva a lacuna.',
    contexto:
      'A audiência de direito tem alto poder aquisitivo e hábito consolidado de comprar curso. É um dos públicos com melhor conversão para produtos educacionais.',
    encaixe: [
      'Canais de direito tributário, econômico e regulatório',
      'Professores de cursinho jurídico e pós-graduação',
      'Advogados com produção de conteúdo técnico',
      'Comunidades de concurseiros da área jurídica',
    ],
    formatos: [
      'Vídeo sobre a lógica econômica por trás de uma norma',
      'Indicação em newsletter técnica',
      'Menção em aula ou mentoria',
    ],
  },
  geopolitica: {
    resumo:
      'Toda análise geopolítica esbarra em comércio, energia, moeda e sanção.',
    titulo: 'Programa de afiliados para canais de geopolítica',
    intro:
      'Toda análise geopolítica esbarra em comércio, energia, moeda e sanção. Seu público já sente essa lacuna — e quer fechá-la.',
    contexto:
      'Geopolítica é uma das áreas de maior crescimento em conteúdo educacional no Brasil, com audiência que consome análise longa e recorrente. Encaixe direto com o catálogo.',
    encaixe: [
      'Canais de geopolítica, relações internacionais e defesa',
      'Analistas com newsletter ou podcast próprio',
      'Professores de RI e comércio exterior',
      'Comunidades de análise internacional',
    ],
    formatos: [
      'Episódio sobre sanções, commodities ou guerra comercial',
      'Indicação de base teórica para acompanhar a análise',
      'Publicação na comunidade de assinantes',
    ],
  },
  financas: {
    resumo:
      'Indique algo que explica o sistema, não mais uma promessa de renda extra.',
    titulo: 'Programa de afiliados para canais de finanças pessoais',
    intro:
      'Seu público já compra educação financeira. A diferença aqui é indicar algo que explica o sistema, e não mais uma promessa de renda extra.',
    contexto:
      'Finanças pessoais tem o público mais acostumado a comprar curso — e também o mais saturado de promessa vazia. Justamente por isso, indicar formação séria diferencia o seu canal.',
    encaixe: [
      'Canais de educação financeira e investimentos',
      'Planejadores financeiros com audiência própria',
      'Newsletters de mercado e carteira',
      'Comunidades de investidores',
    ],
    formatos: [
      'Vídeo conectando decisão de investimento a cenário macro',
      'Seção fixa da newsletter',
      'Indicação na comunidade paga ou gratuita',
    ],
  },
  ciencias: {
    resumo:
      'Público treinado em método reconhece rigor — e desconfia de curso raso.',
    titulo: 'Programa de afiliados para canais de ciências',
    intro:
      'Física, química e biologia formam público treinado em método e evidência — gente que reconhece rigor quando vê, e que desconfia de curso raso.',
    contexto:
      'Canais de divulgação científica costumam ter dificuldade de monetizar sem quebrar o contrato de confiança com a audiência. Indicar formação séria de outra área resolve isso sem contaminar o seu conteúdo.',
    encaixe: [
      'Canais de divulgação científica',
      'Professores de ciências da natureza',
      'Comunidades de olimpíadas e iniciação científica',
      'Podcasts de ciência e método',
    ],
    formatos: [
      'Menção no bloco de recomendações do episódio',
      'Indicação para o público interessado em política de ciência',
      'Publicação na comunidade do canal',
    ],
  },
  concursos: {
    tituloSeo: 'Programa de afiliados para canais de concursos',
    resumo:
      'Economia cai em prova e seu público compra material o ano inteiro.',
    titulo: 'Programa de afiliados para canais de concursos e vestibulares',
    intro:
      'Economia cai em prova — e seu público compra material o ano inteiro. É o encaixe mais direto entre conteúdo gratuito e curso pago.',
    contexto:
      'A audiência de concursos e vestibulares tem intenção de compra explícita e ciclo de decisão curto. Costuma ser o público de maior conversão em programas de afiliação educacional.',
    encaixe: [
      'Canais de preparação para concursos e ENEM',
      'Professores de atualidades, economia e geografia',
      'Comunidades de estudo e cronogramas',
      'Perfis de dicas e resumos',
    ],
    formatos: [
      'Aula gratuita seguida de indicação do aprofundamento',
      'Cupom exclusivo em época de edital',
      'Menção no cronograma de estudos',
    ],
  },
}

export function generateStaticParams() {
  return areasComPagina.map((area) => ({ area: area.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>
}): Promise<Metadata> {
  const { area } = await params
  const conteudo = CONTEUDO[area]
  const dados = areasComPagina.find((a) => a.slug === area)
  if (!conteudo || !dados) return {}

  return {
    title: conteudo.tituloSeo ?? conteudo.titulo,
    description: `${conteudo.resumo} Comissão de ${comissao.minima}% a ${comissao.maxima}%, material pronto e sem custo para entrar.`,
    alternates: { canonical: `/para-criadores/${area}` },
    openGraph: {
      title: conteudo.titulo,
      description: conteudo.intro,
      url: `/para-criadores/${area}`,
    },
  }
}

export default async function PaginaArea({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params
  const conteudo = CONTEUDO[area]
  const dados = areasComPagina.find((a) => a.slug === area)
  if (!conteudo || !dados) notFound()

  const outras = areasComPagina.filter((a) => a.slug !== area).slice(0, 6)

  // Espelha a trilha visível logo abaixo — o schema e a migalha precisam
  // dizer a mesma coisa, senão o Google descarta os dois.
  const migalhaEstruturada = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: urlAbsoluta('/') },
      { '@type': 'ListItem', position: 2, name: 'Para afiliados', item: urlAbsoluta('/para-afiliados') },
      {
        '@type': 'ListItem',
        position: 3,
        name: dados.nome,
        item: urlAbsoluta(`/para-criadores/${area}`),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migalhaEstruturada) }}
      />
      <Topo />
      <main id="conteudo">
        <section className="secao">
          <div className="envelope">
            <nav className="migalhas" aria-label="Você está aqui">
              <Link href="/">Início</Link> <span aria-hidden="true">/</span>{' '}
              <Link href="/para-afiliados">Para afiliados</Link> <span aria-hidden="true">/</span>{' '}
              <span>{dados.nome}</span>
            </nav>

            <div className="prosa">
              <span className="olho">Para criadores de {dados.plural}</span>
              <h1>{conteudo.titulo}</h1>
              <p className="subtitulo">{conteudo.intro}</p>

              <Link className="botao botao--g botao--avanco" href="/inscricao" style={{ alignSelf: 'flex-start' }}>
                Quero me candidatar
              </Link>

              <h2>Por que faz sentido para o seu público</h2>
              <p>{conteudo.contexto}</p>
              <p>
                O programa paga de <strong>{comissao.minima}% a {comissao.maxima}%</strong> por venda
                aprovada, conforme a parceria, com {comissao.cookieDias} dias de rastreio e pagamento
                pela plataforma de venda. Você
                recebe material pronto de divulgação e não precisa criar, gravar ou dar suporte a
                nenhum curso.
              </p>

              <h2>Perfis de {dados.plural} que buscamos</h2>
              <ul>
                {conteudo.encaixe.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h2>Formatos de divulgação que funcionam nessa área</h2>
              <ul>
                {conteudo.formatos.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Nada disso é obrigatório. São só os formatos que costumam render mais em canais de{' '}
                {dados.plural} — você decide o que combina com a sua linha editorial.
              </p>

              <h2>Dúvidas comuns</h2>
            </div>

            <div style={{ marginTop: 20 }}>
              <ListaFaq perguntas={faq.slice(0, 5)} />
            </div>

            <div className="cartao" style={{ marginTop: 36, maxWidth: 680 }}>
              <h3>Candidate-se</h3>
              <p>
                Cinco minutos de formulário, resposta em até sete dias úteis. Sem custo e sem
                exclusividade.
              </p>
              <Link className="botao botao--avanco" href="/inscricao" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                Quero participar
              </Link>
            </div>

            <div style={{ marginTop: 40 }}>
              <p className="rodape__titulo" style={{ color: 'var(--tinta-3)' }}>
                Outras áreas
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {outras.map((outra) => (
                  <Link className="selo" key={outra.slug} href={`/para-criadores/${outra.slug}`}>
                    {outra.nome}
                  </Link>
                ))}
              </div>
            </div>

            <p className="campo__dica" style={{ marginTop: 32 }}>
              Programa do {site.nome}, com catálogo produzido pelo {site.produtor}. Vendas e
              comissões processadas pela plataforma de venda de cada curso.
            </p>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  )
}
