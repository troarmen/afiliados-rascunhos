import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { FormularioProdutor } from '@/components/FormularioProdutor'
import { ListaFaq } from '@/components/secoes/Faq'
import { Revelar } from '@/components/Revelar'
import { comoFuncionaProdutor, oQueOferece, paraQuemProdutor, perguntasProdutor } from '@/lib/produtores'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Encontre afiliados para o seu curso ou canal educacional',
  description:
    'Recrutamento com triagem humana, biblioteca de materiais integrada, campanhas com calendário e pagamento pela Hotmart. Conte sobre o seu catálogo.',
  alternates: { canonical: '/para-produtores' },
  openGraph: {
    title: 'Para produtores: afiliados de conteúdo para o seu curso',
    description: 'Criadores educacionais do YouTube divulgando o seu curso, com estrutura pronta.',
    url: '/para-produtores',
  },
}

export default function PaginaParaProdutores() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: perguntasProdutor.map((item) => ({ '@type': 'Question', name: item.pergunta, acceptedAnswer: { '@type': 'Answer', text: item.resposta } })),
          }),
        }}
      />
      <Topo />
      <main id="conteudo">
        <section className="hero escuro">
          <div className="envelope hero__interno">
            <div className="hero__texto">
              <span className="olho olho--pilula">Para produtores</span>
              <h1>Seu curso, divulgado por quem <span className="realce">já ensina</span> a sua audiência</h1>
              <p className="subtitulo">
                O {site.nome} conecta cursos educacionais a criadores do YouTube que falam sério com
                o público que você quer alcançar. Recrutamento, triagem, biblioteca de materiais e
                campanhas prontos — a venda e a comissão continuam na Hotmart.
              </p>
              <div className="hero__acoes">
                <Link className="botao botao--g" href="#interesse">Quero afiliados para o meu curso</Link>
                <Link className="botao botao--secundario botao--g" href="#como-funciona-produtor">Como funciona</Link>
              </div>
              <p className="hero__nota">Sem infraestrutura nova de pagamento · Triagem humana · Foco em conteúdo educacional</p>
            </div>
            <aside className="painel" aria-label="O que a estrutura entrega">
              <div className="painel__topo">
                <span className="painel__titulo">O que já está pronto</span>
                <span className="selo selo--ambar">Estrutura</span>
              </div>
              <div className="painel__corpo">
                <dl className="painel__linhas">
                  <div className="painel__linha"><dt>Recrutamento</dt><dd>Página + formulário próprios</dd></div>
                  <div className="painel__linha"><dt>Triagem</dt><dd>Humana, com pontuação</dd></div>
                  <div className="painel__linha"><dt>Materiais</dt><dd>Biblioteca por tipo e campanha</dd></div>
                  <div className="painel__linha"><dt>Pagamento</dt><dd>Hotmart</dd></div>
                  <div className="painel__linha"><dt>Primeiro catálogo</dt><dd>{site.produtor}</dd></div>
                </dl>
              </div>
            </aside>
          </div>
        </section>

        <section className="secao" id="oferece">
          <div className="envelope">
            <div className="cabecalho-secao">
              <span className="olho">O que você ganha</span>
              <h2>Afiliados que entendem <span className="realce">do assunto</span></h2>
              <p className="subtitulo">
                A diferença entre um programa de afiliados comum e este não é o link: é quem está do
                outro lado e o que ele recebe de você.
              </p>
            </div>
            <div className="grade grade--3">
              {oQueOferece.map((item, i) => (
                <Revelar className="cartao" key={item.titulo} atraso={i * 55}>
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        <section className="secao secao--gelo" id="como-funciona-produtor">
          <div className="envelope">
            <div className="cabecalho-secao">
              <span className="olho">Como funciona para o produtor</span>
              <h2>Quatro passos até o <span className="realce">primeiro afiliado</span></h2>
            </div>
            <div className="passos">
              {comoFuncionaProdutor.map((etapa, i) => (
                <Revelar className="passo" key={etapa.numero} atraso={i * 60}>
                  <div className="passo__marca">
                    <span className="ordinal">— {String(etapa.numero).padStart(2, '0')}</span>
                  </div>
                  <div className="passo__conteudo">
                    <h3>{etapa.titulo}</h3>
                    <p>{etapa.descricao}</p>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        <section className="secao">
          <div className="envelope">
            <div className="cabecalho-secao">
              <span className="olho">Para quem é</span>
              <h2>Encaixa quando o curso <span className="realce">já vende</span></h2>
            </div>
            <div className="grade grade--2 grade--pares">
              <div className="cartao">
                <h3>Faz sentido para</h3>
                <ul className="lista-marcada" style={{ marginTop: 6 }}>
                  {paraQuemProdutor.serve.map((item) => <li key={item}><span>{item}</span></li>)}
                </ul>
              </div>
              <div className="cartao" style={{ background: 'var(--superficie-2)' }}>
                <h3>Não tem encaixe</h3>
                <ul className="lista-marcada lista-marcada--negativa" style={{ marginTop: 6 }}>
                  {paraQuemProdutor.naoServe.map((item) => <li key={item}><span>{item}</span></li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="secao secao--superficie">
          <div className="envelope">
            <div className="cabecalho-secao">
              <span className="olho">Cadastro de interesse</span>
              <h2>Conte sobre o seu <span className="realce">catálogo</span></h2>
              <p className="subtitulo">
                Estamos abrindo a rede para os primeiros produtores além do {site.produtor}. Sem
                tabela pública ainda: a condição é conversada caso a caso, e a conversa começa aqui.
              </p>
            </div>
            <FormularioProdutor />
          </div>
        </section>

        <section className="secao secao--gelo">
          <div className="envelope">
            <div className="cabecalho-secao">
              <span className="olho">Perguntas de produtor</span>
              <h2>O que costumam perguntar <span className="realce">antes de cadastrar</span></h2>
            </div>
            <ListaFaq perguntas={[...perguntasProdutor]} />
          </div>
        </section>
      </main>
      <Rodape />
    </>
  )
}
