import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'

export default function NaoEncontrado() {
  return (
    <>
      <Topo />
      <main id="conteudo" className="secao">
        <div className="envelope" style={{ maxWidth: 620 }}>
          <span className="olho">Erro 404</span>
          <h1 style={{ marginTop: 14 }}>Esta página não existe</h1>
          <p className="subtitulo" style={{ marginTop: 16 }}>
            O endereço pode ter mudado ou o link estar incompleto. Os caminhos abaixo continuam
            valendo.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
            <Link className="botao botao--avanco" href="/inscricao">
              Quero participar
            </Link>
            <Link className="botao botao--secundario" href="/programa">
              Ver como funciona
            </Link>
          </div>
        </div>
      </main>
      <Rodape />
    </>
  )
}
