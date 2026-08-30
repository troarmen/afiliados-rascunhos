import { pilares } from '@/lib/programa'
import { Revelar } from '../Revelar'

/**
 * O modelo inteiro em três cartões: quem divulga, o que rastreia e quem paga.
 * É a primeira coisa que um criador precisa entender, antes de qualquer
 * detalhe de comissão.
 */
export function Pilares() {
  return (
    <section className="secao secao--gelo" id="modelo">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">O modelo</span>
          <h2>
            Três partes, e <span className="realce">nenhuma delas é você</span> virando empresa
          </h2>
          <p className="subtitulo">
            Você não cria produto, não emite nota, não processa pagamento e não dá suporte a
            aluno. Divide-se assim:
          </p>
        </div>

        <div className="pilares">
          {pilares.map((pilar, i) => (
            <Revelar className="pilar" key={pilar.numero} atraso={i * 70}>
              <span className="pilar__ator">{pilar.ator}</span>
              <h3>{pilar.titulo}</h3>
              <p>{pilar.descricao}</p>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  )
}
