import type { Beneficio } from '@/lib/programa'

const comuns = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const desenhos: Record<Beneficio['icone'], React.ReactNode> = {
  comissao: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.3c-.6-.8-1.6-1.3-2.8-1.3-1.8 0-2.9.9-2.9 2.1 0 3 5.9 1.5 5.9 4.5 0 1.3-1.2 2.2-3 2.2-1.3 0-2.4-.5-3-1.4" />
      <path d="M12 6v12" />
    </>
  ),
  material: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 15l4.5-4.2a1.6 1.6 0 012.2 0L14 15" />
      <path d="M14.5 13.2l1.8-1.7a1.6 1.6 0 012.2 0L21 14" />
      <circle cx="9" cy="8.6" r="1.3" />
      <path d="M8 21h8" />
    </>
  ),
  cupom: (
    <>
      <path d="M3 9.2V7a2 2 0 012-2h14a2 2 0 012 2v2.2a2.8 2.8 0 000 5.6V17a2 2 0 01-2 2H5a2 2 0 01-2-2v-2.2a2.8 2.8 0 000-5.6z" />
      <path d="M14.5 9.5l-5 5" />
      <circle cx="10" cy="9.8" r=".8" fill="currentColor" />
      <circle cx="14" cy="14.2" r=".8" fill="currentColor" />
    </>
  ),
  campanha: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v3M16 3v3" />
      <path d="M7.5 13.5h3M13.5 13.5h3M7.5 17h3" />
    </>
  ),
  comunidade: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17" cy="10" r="2.3" />
      <path d="M15.2 15.4c2.4-.5 5.3 1 5.3 4.1" />
    </>
  ),
  suporte: (
    <>
      <path d="M21 15a2 2 0 01-2 2H8l-4 3.5V6a2 2 0 012-2h13a2 2 0 012 2z" />
      <path d="M8.5 9.5h8M8.5 13h5" />
    </>
  ),
}

export function IconeBeneficio({ nome }: { nome: Beneficio['icone'] }) {
  return <svg {...comuns}>{desenhos[nome]}</svg>
}

export function Seta() {
  return (
    <svg width="17" height="17" {...comuns}>
      <path d="M5 12h13M12.5 5.5L19 12l-6.5 6.5" />
    </svg>
  )
}
