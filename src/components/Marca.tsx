import Link from 'next/link'
import { site } from '@/lib/site'

/**
 * Lockup do programa, espelhando o do canal:
 * [brasão em placa clara] + nome em Fraunces + qualificador em pílula.
 *
 * O brasão é o arquivo oficial do cliente (public/logo.svg, baixado de
 * rascunhoseconomicos.com/logo.svg). É um traçado escuro sobre fundo claro —
 * por isso vai sempre sobre a placa `.marca__placa`, e nunca solto no navy.
 */
export function Brasao({ tamanho = 38 }: { tamanho?: number }) {
  return (
    <span className="marca__placa" style={{ width: tamanho, height: tamanho }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" width={tamanho} height={tamanho} />
    </span>
  )
}

export function Marca({ href = '/' }: { href?: string }) {
  return (
    <Link className="marca" href={href} aria-label={`${site.nomeCompleto} — página inicial`}>
      <Brasao />
      <span className="marca__nome">Projeto Afiliado</span>
      <span className="marca__pilula">{site.produtor}</span>
    </Link>
  )
}
