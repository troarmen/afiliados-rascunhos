import Link from 'next/link'
import { site } from '@/lib/site'

/**
 * Lockup do Duck Affiliate: [emblema em placa navy] + wordmark bicolor.
 * A pílula "Powered by" fica só no rodapé (`comSelo` existe para quem
 * precisar dela em outro lugar, mas o topo não a usa).
 *
 * O emblema é o PNG recortado do logo oficial. Ele vem sobre o navy do
 * próprio logo (a versão com alfa comia a jaqueta do pato), e a placa usa
 * exatamente essa cor — por isso a emenda é invisível em qualquer fundo.
 *
 * O nome é texto, não imagem: escala com a tipografia, é selecionável e
 * indexável, e o bicolor sai do <b> em âmbar, como no logo.
 */
export function Emblema({ tamanho = 40 }: { tamanho?: number }) {
  return (
    <span className="marca__placa" style={{ width: tamanho, height: tamanho }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/duck-emblema-192.webp" alt="" width={tamanho} height={tamanho} />
    </span>
  )
}

export function Wordmark() {
  return (
    <span className="marca__nome">
      <b>Duck</b>Affiliate
    </span>
  )
}

export function Marca({ href = '/', comSelo = false }: { href?: string; comSelo?: boolean }) {
  return (
    <Link className="marca" href={href} aria-label={`${site.nome} — página inicial`}>
      <Emblema />
      <Wordmark />
      {comSelo && <span className="marca__pilula">{site.selo}</span>}
    </Link>
  )
}
