import { criteriosSelecao } from '@/lib/programa'
import { Revelar } from '../Revelar'

export function Selecao() {
  return (
    <section className="secao" id="selecao">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">A seleção</span>
          <h2>
            Análise humana, <span className="realce">critério aberto</span>
          </h2>
          <p className="subtitulo">
            Toda candidatura é lida por quem toca o projeto. Estes são os quatro pontos que
            pesam na decisão — e nenhum deles é &ldquo;número de inscritos&rdquo; sozinho.
          </p>
        </div>

        <div className="grade grade--2 grade--pares">
          {criteriosSelecao.map((criterio, i) => (
            <Revelar className="cartao" key={criterio.titulo} atraso={i * 60}>
              <h3>{criterio.titulo}</h3>
              <p>{criterio.descricao}</p>
            </Revelar>
          ))}
        </div>

        <div className="aviso aviso--info" style={{ marginTop: 28, maxWidth: '72ch' }}>
          <p>
            <strong>Todo mundo recebe resposta.</strong> Se o encaixe não for agora, seu
            cadastro fica no banco de parceiros e voltamos a falar quando abrirmos uma campanha
            que combine com o seu público.
          </p>
        </div>
      </div>
    </section>
  )
}
