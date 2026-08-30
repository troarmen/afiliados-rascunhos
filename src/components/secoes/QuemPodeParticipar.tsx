import Link from 'next/link'
import { alemDoYoutube, areasComPagina, naoServe, perfis } from '@/lib/programa'
import { Revelar } from '../Revelar'

export function QuemPodeParticipar() {
  return (
    <section className="secao" id="quem-pode">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">Para quem é</span>
          <h2>
            Feito para canais pequenos e médios com audiência{' '}
            <span className="realce">de verdade</span>
          </h2>
          <p className="subtitulo">
            Não olhamos primeiro o número de inscritos. Olhamos quem te assiste e o quanto essa
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

        {/* Entrada para as páginas por área.
            Elas existiam desde o começo, mas só eram alcançáveis pelo
            sitemap — nenhuma página do site linkava para lá, então o
            conjunto inteiro não recebia autoridade interna nenhuma.
            Aqui o link também é útil: quem está lendo "para quem é" quer
            justamente saber se a área dele entra. */}
        <div style={{ marginTop: 'clamp(26px, 3.4vw, 44px)' }}>
          <h3 style={{ marginBottom: 14 }}>Veja o encaixe da sua área</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {areasComPagina.map((area) => (
              <Link
                className="selo"
                key={area.slug}
                href={`/para-criadores/${area.slug}`}
                title={`Programa de afiliados para canais de ${area.plural}`}
              >
                {area.nome.split(' (')[0]}
              </Link>
            ))}
          </div>
        </div>

        <div className="aviso aviso--info" style={{ marginTop: 'clamp(24px, 3vw, 40px)' }}>
          <p>
            <strong>Não faz vídeo?</strong> {alemDoYoutube}
          </p>
        </div>

        <div
          className="cartao"
          style={{ marginTop: 18, background: 'var(--superficie-2)' }}
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
