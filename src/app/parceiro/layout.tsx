import type { Metadata } from 'next'
import './parceiro.css'

export const metadata: Metadata = {
  title: { default: 'Área do parceiro', template: '%s · Área do parceiro' },
  robots: { index: false, follow: false, nocache: true },
}

/** Só carrega o CSS; a sessão é conferida em cada página, para /entrar seguir livre. */
export default function LayoutParceiro({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
