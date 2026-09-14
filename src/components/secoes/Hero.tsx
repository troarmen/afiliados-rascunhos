import Link from 'next/link'
import { comissao } from '@/lib/programa'
import { Seta } from '../Icones'

export function Hero() {
  return (
    <section className="hero escuro">
      <div className="envelope hero__interno">
        <div className="hero__texto">
          <span className="olho olho--pilula">Programa de afiliados para o YouTube educacional</span>

          <h1>
            Seu canal já ensina. Agora ele também <span className="realce">paga</span>.
          </h1>

          <p className="subtitulo">
            O Duck Affiliate conecta criadores de conteúdo educacional do YouTube a cursos que
            já vendem.
            Você indica com material pronto, o link rastreia a venda por {comissao.cookieDias}{' '}
            dias e a plataforma de venda deposita a sua comissão. Sem criar curso, sem gravar aula, sem
            responder aluno.
          </p>

          <div className="hero__acoes">
            <Link className="botao botao--g botao--avanco" href="/inscricao">
              Quero ser afiliado <Seta />
            </Link>
            <Link className="botao botao--secundario botao--g" href="/como-funciona">
              Ver como funciona
            </Link>
          </div>

          <p className="hero__nota">
            Inscrição gratuita · Resposta em até {comissao.prazoResposta} dias úteis · Sem
            exclusividade
          </p>
          <p className="hero__outra-porta">
            Tem um curso e quer afiliados?{' '}
            <Link href="/para-produtores">Veja a página para produtores</Link>
          </p>

          <div className="hero__provas">
            <span className="selo">
              <span className="selo__ponto" />
              1ª turma com vagas abertas
            </span>
            <span className="selo">Pago pela plataforma de venda</span>
            <span className="selo">Kit de divulgação pronto</span>
          </div>
        </div>

        <aside className="painel" aria-label="Resumo do programa">
          <div className="painel__topo">
            <span className="painel__titulo">A parceria em números</span>
            <span className="selo selo--ambar">1ª turma</span>
          </div>
          <div className="painel__corpo">
            <div className="numero">
              <span className="numero__valor">
                {comissao.minima}%–{comissao.maxima}%
              </span>
              <span className="numero__rotulo">
                de comissão por venda aprovada, definida na análise de cada parceria
              </span>
            </div>

            <dl className="painel__linhas">
              <div className="painel__linha">
                <dt>Rastreio da indicação</dt>
                <dd>{comissao.cookieDias} dias</dd>
              </div>
              <div className="painel__linha">
                <dt>Atribuição</dt>
                <dd>Último clique</dd>
              </div>
              <div className="painel__linha">
                <dt>Recebimento</dt>
                <dd>{comissao.prazoPagamento}</dd>
              </div>
              <div className="painel__linha">
                <dt>Custo para participar</dt>
                <dd>R$ 0</dd>
              </div>
              <div className="painel__linha">
                <dt>Meta mínima</dt>
                <dd>Nenhuma</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  )
}
