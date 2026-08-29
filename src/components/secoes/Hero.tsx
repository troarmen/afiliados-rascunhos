import Link from 'next/link'
import { comissao } from '@/lib/programa'
import { Seta } from '../Icones'

export function Hero() {
  return (
    <section className="hero escuro">
      <div className="envelope hero__interno">
        <div className="hero__texto">
          <span className="olho olho--pilula">Programa de parceria para criadores</span>

          <h1>
            Sua audiência já <span className="realce">confia</span> em você. Falta o produto
            certo.
          </h1>

          <p className="subtitulo">
            Um programa de parceria para quem produz conteúdo educacional sério e quer
            monetizar sem criar curso, gravar aula ou dar suporte a aluno. Você indica, a gente
            entrega — e a comissão é sua.
          </p>

          <div className="hero__acoes">
            <Link className="botao botao--g" href="/#inscricao">
              Quero participar <Seta />
            </Link>
            <Link className="botao botao--secundario botao--g" href="/#como-funciona">
              Ver como funciona
            </Link>
          </div>

          <p className="hero__nota">
            Inscrição gratuita · Resposta em até 7 dias úteis · Sem exclusividade
          </p>

          <div className="hero__provas">
            <span className="selo">
              <span className="selo__ponto" />
              Vagas abertas
            </span>
            <span className="selo">Pagamento pela Hotmart</span>
            <span className="selo">Material de divulgação pronto</span>
          </div>
        </div>

        <aside className="painel" aria-label="Resumo do programa">
          <div className="painel__topo">
            <span className="painel__titulo">A parceria em números</span>
            <span className="selo selo--ouro">1ª turma</span>
          </div>
          <div className="painel__corpo">
            <div className="numero">
              <span className="numero__valor">
                {comissao.base}%–{comissao.teto}%
              </span>
              <span className="numero__rotulo">
                de comissão por venda aprovada, conforme a parceria
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
