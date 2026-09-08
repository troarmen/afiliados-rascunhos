import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CabecalhoAdmin } from '@/components/admin/CabecalhoAdmin'
import { FormularioMaterial } from '@/components/admin/FormularioMaterial'
import { estaAutenticado } from '@/lib/auth'
import { modoPersistencia } from '@/lib/store'
import { listarCampanhas, listarProgramas, obterMaterial } from '@/lib/store-materiais'

export const dynamic = 'force-dynamic'

export default async function EditarMaterial({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await estaAutenticado())) redirect(`/admin/entrar?voltar=/admin/materiais/${id}`)
  const material = await obterMaterial(id)
  if (!material) notFound()
  const [programas, campanhas] = await Promise.all([listarProgramas(false), listarCampanhas(material.programaId)])

  return (
    <div className="adm">
      <CabecalhoAdmin modo={modoPersistencia()} />
      <div className="adm__conteudo" style={{ maxWidth: 900 }}>
        <nav className="migalhas">
          <Link href="/admin/materiais">← Materiais</Link>
        </nav>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)' }}>{material.titulo}</h1>
          <span className="selo">{material.usos} uso{material.usos === 1 ? '' : 's'}</span>
        </div>
        <FormularioMaterial programas={programas} campanhas={campanhas} modo={modoPersistencia()} material={material} />
      </div>
    </div>
  )
}
