'use client'

import { useMemo, useState } from 'react'
import { comissao, plataformaVenda } from '@/lib/programa'

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export function Comissao() {
  const [vendas, setVendas] = useState(8)
  const [percentual, setPercentual] = useState<number>(comissao.referenciaSimulacao)

  const ganho = useMemo(
    () => (comissao.precoReferencia * percentual * vendas) / 100,
    [vendas, percentual],
  )

  return (
    <section className="secao escuro" id="comissao">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">Comissão e pagamento</span>
          <h2>
            Você é pago por venda, <span className="realce">direto pela plataforma</span>
          </h2>
          <p className="subtitulo">
            Não existe repasse manual, planilha nossa ou &ldquo;confia em mim&rdquo;. A plataforma
            de venda do curso (como {plataformaVenda.exemplos}) identifica a origem de cada venda,
            calcula e paga a sua comissão. Você audita tudo no painel dela.
          </p>
        </div>

        <div className="comissao">
          <ul className="lista-marcada">
            <li>
              <span>
                <strong>De {comissao.minima}% a {comissao.maxima}% por venda aprovada</strong>. O
                percentual de cada parceria é definido por análise interna: encaixe com o curso,
                perfil da audiência, formato de divulgação e contexto da campanha.
              </span>
            </li>
            <li>
              <span>
                <strong>{comissao.cookieDias} dias de rastreio</strong> por {comissao.atribuicao}:
                quem clica hoje e compra depois ainda conta para você.
              </span>
            </li>
            <li>
              <span>
                <strong>Cupom com o seu nome</strong>, que rastreia a venda mesmo quando a pessoa
                não passa pelo link.
              </span>
            </li>
            <li>
              <span>
                <strong>Pagamento {comissao.prazoPagamento}</strong>, no prazo padrão da
                plataforma, sem carência extra da nossa parte.
              </span>
            </li>
            <li>
              <span>
                <strong>Sem meta e sem exclusividade.</strong> Você divulga no seu ritmo e
                continua livre para trabalhar com outros produtos.
              </span>
            </li>
          </ul>

          <div className="calculadora">
            <div>
              <span className="olho">Simulação</span>
              <p className="campo__dica" style={{ marginTop: 10 }}>
                Ticket de referência de {moeda.format(comissao.precoReferencia)} por curso.
                Ajuste os controles para ver o cenário.
              </p>
            </div>

            <div className="calculadora__saida">
              <span className="calculadora__valor">{moeda.format(ganho)}</span>
              <span style={{ fontSize: '0.92rem' }}>por mês</span>
            </div>

            <div className="controle">
              <div className="controle__cabeca">
                <label htmlFor="sim-vendas">Vendas no mês</label>
                <span className="controle__valor">{vendas}</span>
              </div>
              <input
                id="sim-vendas"
                type="range"
                min={1}
                max={60}
                step={1}
                value={vendas}
                onChange={(e) => setVendas(Number(e.target.value))}
              />
            </div>

            <div className="controle">
              <div className="controle__cabeca">
                <label htmlFor="sim-percentual">Comissão da parceria</label>
                <span className="controle__valor">{percentual}%</span>
              </div>
              <input
                id="sim-percentual"
                type="range"
                min={comissao.minima}
                max={comissao.maxima}
                step={5}
                value={percentual}
                onChange={(e) => setPercentual(Number(e.target.value))}
              />
            </div>

            <p className="campo__dica">
              Simulação para você dimensionar a oportunidade — não é promessa de ganho. O
              resultado real depende do seu público, do formato e da frequência da divulgação. O
              percentual da sua parceria é definido na aprovação.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
