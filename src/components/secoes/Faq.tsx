import Link from 'next/link'
import { faq, type Pergunta } from '@/lib/programa'

export function ListaFaq({ perguntas = faq }: { perguntas?: Pergunta[] }) {
  return (
    <div className="faq">
      {perguntas.map((item) => (
        <details key={item.pergunta}>
          <summary>{item.pergunta}</summary>
          <div className="faq__resposta">
            <p>{item.resposta}</p>
          </div>
        </details>
      ))}
    </div>
  )
}

export function Faq() {
  return (
    <section className="secao secao--creme" id="faq">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">Perguntas frequentes</span>
          <h2>
            O que costumam perguntar <span className="realce">antes de se inscrever</span>
          </h2>
        </div>

        <ListaFaq />

        <p style={{ marginTop: 28, color: 'var(--tinta-2)', fontSize: '0.93rem' }}>
          Ficou algo de fora?{' '}
          <Link href="/#contato" style={{ color: 'var(--ouro-texto)', fontWeight: 600 }}>
            Fale com a gente
          </Link>{' '}
          antes de se inscrever.
        </p>
      </div>
    </section>
  )
}
