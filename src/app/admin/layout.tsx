import type { Metadata } from 'next'
import './admin.css'
import '../parceiro/parceiro.css'

export const metadata: Metadata = {
  title: 'Painel de parceiros',
  robots: { index: false, follow: false, nocache: true },
}

/**
 * O layout do /admin só carrega o CSS do painel — a verificação de sessão
 * acontece em cada página, para que /admin/entrar continue acessível.
 */
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
