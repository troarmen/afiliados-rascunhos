import { etapas } from '@/lib/programa'
import { Revelar } from '../Revelar'

export function ComoFunciona() {
  return (
    <section className="secao secao--superficie" id="como-funciona">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">Como funciona</span>
          <h2>
            Da inscrição à primeira venda, em <span className="realce">seis passos</span>
          </h2>
          <p className="subtitulo">
            Sem burocracia, sem contrato de gaveta e sem promessa vaga. Este é exatamente o
            caminho que você vai percorrer.
          </p>
        </div>

        <div className="passos">
          {etapas.map((etapa, i) => (
            <Revelar className="passo" key={etapa.numero} atraso={i * 60}>
              <div className="passo__marca">
                <span className="ordinal">
                  — {String(etapa.numero).padStart(2, '0')}
                </span>
                <span className="passo__prazo">{etapa.prazo}</span>
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
  )
}
