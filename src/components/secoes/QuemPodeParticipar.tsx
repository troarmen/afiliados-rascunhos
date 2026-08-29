import { naoServe, perfis } from '@/lib/programa'
import { Revelar } from '../Revelar'

export function QuemPodeParticipar() {
  return (
    <section className="secao" id="quem-pode">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">Quem pode participar</span>
          <h2>
            Feito para canais pequenos e médios com audiência{' '}
            <span className="realce">de verdade</span>
          </h2>
          <p className="subtitulo">
            Não olhamos primeiro o número de seguidores. Olhamos quem te ouve e o quanto essa
            pessoa leva a sério o que você diz.
          </p>
        </div>

        <div className="grade grade--2 grade--pares">
          {perfis.map((perfil, i) => (
            <Revelar className="cartao cartao--interativo" key={perfil.titulo} atraso={i * 60}>
              <h3>{perfil.titulo}</h3>
              <p>{perfil.descricao}</p>
            </Revelar>
          ))}
        </div>

        <div
          className="cartao"
          style={{ marginTop: 'clamp(24px, 3vw, 40px)', background: 'var(--superficie-2)' }}
        >
          <h3>O que não tem encaixe aqui</h3>
          <ul className="lista-marcada lista-marcada--negativa" style={{ marginTop: 6 }}>
            {naoServe.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
