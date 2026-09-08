import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CabecalhoAdmin } from '@/components/admin/CabecalhoAdmin'
import { EditorCampanhas } from '@/components/admin/EditorCampanhas'
import { estaAutenticado } from '@/lib/auth'
import { modoPersistencia } from '@/lib/store'
import { listarCampanhas, listarMateriais, listarProgramas } from '@/lib/store-materiais'

export const dynamic = 'force-dynamic'

export default async function CampanhasAdmin() {
  if (!(await estaAutenticado())) redirect('/admin/entrar?voltar=/admin/campanhas')
  const programas = await listarProgramas(false)
  const programa = programas[0]
  const [campanhas, materiais] = programa
    ? await Promise.all([listarCampanhas(programa.id), listarMateriais(programa.id, { incluirArquivados: true })])
    : [[], []]
  const contagem = materiais.reduce<Record<string, number>>((acc, m) => {
    if (m.campanhaId) acc[m.campanhaId] = (acc[m.campanhaId] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="adm">
      <CabecalhoAdmin modo={modoPersistencia()} />
      <div className="adm__conteudo" style={{ maxWidth: 900 }}>
        <nav className="migalhas">
          <Link href="/admin/materiais">← Materiais</Link>
        </nav>
        <h1 style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)' }}>Campanhas</h1>
        <p className="campo__dica" style={{ maxWidth: '60ch' }}>
          Lançamento, Black Friday, volta às aulas: a campanha agrupa materiais e aparece como filtro
          na biblioteca do parceiro. Apagar uma campanha não apaga material nenhum — eles só perdem o
          vínculo.
        </p>
        {programa ? (
          <EditorCampanhas programaId={programa.id} campanhas={campanhas} contagem={contagem} />
        ) : (
          <p className="adm__vazio">Nenhum programa cadastrado.</p>
        )}
      </div>
    </div>
  )
}
