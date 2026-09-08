import type { TipoMaterial } from '@/lib/materiais'

const comuns = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const desenhos: Record<TipoMaterial, React.ReactNode> = {
  imagem: (<><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="9" cy="9.5" r="1.6" /><path d="M21 16l-5-4.5-6 5.5-2-1.8L3 18" /></>),
  video: (<><rect x="3" y="5" width="14" height="14" rx="2.5" /><path d="M17 10l4-2.5v9L17 14" /></>),
  banner: (<><rect x="2.5" y="6" width="19" height="12" rx="2" /><path d="M6.5 12h6M6.5 15h3" /><circle cx="17" cy="12" r="1.8" /></>),
  social: (<><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r=".9" fill="currentColor" /></>),
  email: (<><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></>),
  copy: (<><path d="M6 3.5h9l4 4V17a2 2 0 01-2 2H6a2 2 0 01-2-2V5.5a2 2 0 012-2z" /><path d="M8 10h8M8 13.5h8M8 17h5" /></>),
  cupom: (<><path d="M3 9.2V7a2 2 0 012-2h14a2 2 0 012 2v2.2a2.8 2.8 0 000 5.6V17a2 2 0 01-2 2H5a2 2 0 01-2-2v-2.2a2.8 2.8 0 000-5.6z" /><path d="M14.5 9.5l-5 5" /></>),
  logo: (<><circle cx="12" cy="12" r="8.5" /><path d="M8.5 14.5l2-5 1.5 3.5 1.5-2 2 3.5" /></>),
  pdf: (<><path d="M6 3.5h8l5 5V19a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 19V5a1.5 1.5 0 011-1.5z" /><path d="M14 3.5V9h5" /><path d="M8 17v-5h1.8a1.5 1.5 0 010 3H8M12.5 17v-5h1.2a2.5 2.5 0 010 5h-1.2" /></>),
  link: (<><path d="M10 14a4 4 0 005.7 0l2.8-2.8a4 4 0 00-5.7-5.7L11.5 6.8" /><path d="M14 10a4 4 0 00-5.7 0l-2.8 2.8a4 4 0 005.7 5.7l1.3-1.3" /></>),
  outro: (<><path d="M4 7.5A2.5 2.5 0 016.5 5H10l2 2h5.5A2.5 2.5 0 0120 9.5v7a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 16.5z" /></>),
}

export function IconeTipo({ tipo, tamanho = 28 }: { tipo: TipoMaterial; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} {...comuns}>
      {desenhos[tipo]}
    </svg>
  )
}
