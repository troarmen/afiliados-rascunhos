import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CabecalhoAdmin } from '@/components/admin/CabecalhoAdmin'
import { FormularioMaterial } from '@/components/admin/FormularioMaterial'
import { estaAutenticado } from '@/lib/auth'
import { modoPersistencia } from '@/lib/store'
import { listarCampanhas, listarProgramas } from '@/lib/store-materiais'

export const dynamic = 'force-dynamic'

export default async function NovoMaterial() {
  if (!(await estaAutenticado())) redirect('/admin/entrar?voltar=/admin/materiais/novo')
  const programas = await listarProgramas(false)
  const campanhas = programas[0] ? await listarCampanhas(programas[0].id) : []

  return (
    <div className="adm">
      <CabecalhoAdmin modo={modoPersistencia()} />
      <div className="adm__conteudo" style={{ maxWidth: 900 }}>
        <nav className="migalhas">
          <Link href="/admin/materiais">← Materiais</Link>
        </nav>
        <h1 style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)' }}>Novo material</h1>
        <FormularioMaterial programas={programas} campanhas={campanhas} modo={modoPersistencia()} />
      </div>
    </div>
  )
}
