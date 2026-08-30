import { comparativo } from '@/lib/programa'
import { site } from '@/lib/site'

function Marcador() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: 'var(--ambar-texto)' }}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

/**
 * Comparativo de posicionamento.
 *
 * A coluna da direita descreve o PADRÃO de mercado, não um concorrente
 * nomeado — não temos como auditar o programa alheio, e afirmar coisa
 * específica sobre ele seria inventar. Cada linha da esquerda, por outro
 * lado, é regra nossa e está escrita nos termos.
 */
export function Comparativo() {
  return (
    <section className="secao" id="comparativo">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">A diferença</span>
          <h2>
            Programa de afiliados <span className="realce">todo mundo tem</span>
          </h2>
          <p className="subtitulo">
            O que muda não é a existência do link — é o que vem junto com ele. Comparado ao que
            se costuma oferecer a um criador:
          </p>
        </div>

        <div className="comparativo">
          <div className="comparativo__rolagem">
            <table>
              <caption className="oculto-visual">
                Comparação entre o {site.nome} e o padrão de programas de afiliados
              </caption>
              <thead>
                <tr>
                  <th scope="col">Critério</th>
                  <th scope="col" className="comparativo__nos">
                    {site.nome}
                  </th>
                  <th scope="col">Programa de afiliados comum</th>
                </tr>
              </thead>
              <tbody>
                {comparativo.map((linha) => (
                  <tr key={linha.criterio}>
                    <th scope="row">{linha.criterio}</th>
                    <td className="comparativo__nos">
                      <span className="comparativo__marca">
                        <Marcador />
                        {linha.duck}
                      </span>
                    </td>
                    <td className="comparativo__comum">{linha.comum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
