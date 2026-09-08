'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STATUS_PRODUTOR, STATUS_PRODUTOR_ROTULO, type StatusProdutor } from '@/lib/schema'

export function StatusProdutor({ id, status: inicial }: { id: string; status: StatusProdutor }) {
  const router = useRouter()
  const [status, setStatus] = useState<StatusProdutor>(inicial)
  const [ocupado, setOcupado] = useState(false)

  const trocar = async (novo: StatusProdutor) => {
    setStatus(novo)
    setOcupado(true)
    await fetch(`/api/admin/produtores/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novo }),
    }).catch(() => null)
    setOcupado(false)
    router.refresh()
  }

  return (
    <select value={status} onChange={(e) => trocar(e.target.value as StatusProdutor)} disabled={ocupado} aria-label="Status do produtor" style={{ padding: '6px 28px 6px 10px', fontSize: '0.85rem', borderRadius: 8 }}>
      {STATUS_PRODUTOR.map((s) => (
        <option key={s} value={s}>{STATUS_PRODUTOR_ROTULO[s]}</option>
      ))}
    </select>
  )
}
