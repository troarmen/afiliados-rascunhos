import Link from 'next/link'
import { comissao } from '@/lib/programa'
import { site } from '@/lib/site'
import { Seta } from '../Icones'

/** Fechamento da página: um último pedido, sem promessa nova. */
export function Chamada() {
  return (
    <section className="secao escuro">
      <div className="envelope">
        <div className="chamada">
          <span className="olho">Última chamada</span>
          <h2>
            A sua audiência vai comprar curso <span className="realce">de alguém</span>
          </h2>
          <p className="subtitulo">
            Pode ser de um anúncio que ela não pediu ou da pessoa em quem ela já confia. Se for a
            segunda opção, {site.nome} existe para que isso valha a pena para você também.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
            <Link className="botao botao--g botao--avanco" href="/inscricao">
              Candidatar meu canal <Seta />
            </Link>
            <Link className="botao botao--secundario botao--g" href="/para-produtores">
              Tenho um curso
            </Link>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--tinta-3)' }}>
            Leva cinco minutos · resposta em até {comissao.prazoResposta} dias úteis · sem custo
          </p>
        </div>
      </div>
    </section>
  )
}
