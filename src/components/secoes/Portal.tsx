import Link from 'next/link'
import { portal } from '@/lib/programa'
import { Revelar } from '../Revelar'

/**
 * O que existe do outro lado da aprovação.
 *
 * É o bloco que separa este programa de "receba seu link": quem está
 * decidindo se vale o esforço precisa ver o inventário do que vai receber.
 */
export function Portal() {
  return (
    <section className="secao secao--superficie" id="portal">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">Portal do parceiro</span>
          <h2>
            O que você recebe <span className="realce">no dia da aprovação</span>
          </h2>
          <p className="subtitulo">
            Nada de “vou te mandar depois”. No momento em que a parceria é fechada, você entra
            no portal e tudo abaixo já está lá dentro, pronto para publicar.
          </p>
        </div>

        <div className="portal">
          {portal.map((grupo, i) => (
            <Revelar className="portal__grupo" key={grupo.titulo} atraso={i * 60}>
              <h3>{grupo.titulo}</h3>
              <ul className="portal__itens">
                {grupo.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Revelar>
          ))}
        </div>

        <p style={{ marginTop: 28, color: 'var(--tinta-3)', fontSize: '0.9rem' }}>
          O material é feito pensando em vídeo longo e corte para o YouTube.{' '}
          <Link href="/programa" style={{ color: 'var(--ambar-texto)', fontWeight: 600 }}>
            Ver as regras completas do programa
          </Link>
        </p>
      </div>
    </section>
  )
}
