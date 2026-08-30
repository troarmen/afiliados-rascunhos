import { beneficios } from '@/lib/programa'
import { IconeBeneficio } from '../Icones'
import { Revelar } from '../Revelar'

export function Beneficios() {
  return (
    <section className="secao secao--gelo" id="beneficios">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">Benefícios</span>
          <h2>
            Você não recebe <span className="realce">só um link</span>
          </h2>
          <p className="subtitulo">
            Link de afiliado qualquer programa dá. O que trava a maioria dos criadores é o
            trabalho em volta: fazer thumbnail, escrever o texto da descrição, entender a oferta,
            saber quando divulgar. Isso a gente entrega pronto.
          </p>
        </div>

        <div className="grade grade--3">
          {beneficios.map((beneficio, i) => (
            <Revelar
              className="cartao cartao--interativo"
              key={beneficio.titulo}
              atraso={i * 55}
            >
              <span className="cartao__icone">
                <IconeBeneficio nome={beneficio.icone} />
              </span>
              <h3>{beneficio.titulo}</h3>
              <p>{beneficio.descricao}</p>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  )
}
