'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STATUS, STATUS_ROTULO, type Status } from '@/lib/schema'
import { dataLonga } from '@/lib/utils'

export function EditorCandidatura({
  id,
  status: statusInicial,
  notas: notasIniciais,
  responsavel: responsavelInicial,
  atualizadoEm,
}: {
  id: string
  status: Status
  notas: string
  responsavel: string
  atualizadoEm: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>(statusInicial)
  const [notas, setNotas] = useState(notasIniciais)
  const [responsavel, setResponsavel] = useState(responsavelInicial)
  const [estado, setEstado] = useState<'parado' | 'salvando' | 'salvo' | 'erro'>('parado')

  const salvar = async (campos: { status?: Status; notas?: string; responsavel?: string }) => {
    setEstado('salvando')
    const resposta = await fetch(`/api/admin/candidaturas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campos),
    }).catch(() => null)

    if (!resposta?.ok) {
      setEstado('erro')
      return
    }
    setEstado('salvo')
    router.refresh()
    setTimeout(() => setEstado('parado'), 2500)
  }

  const trocarStatus = (novo: Status) => {
    setStatus(novo)
    void salvar({ status: novo })
  }

  return (
    <section className="ficha-bloco">
      <h2>Triagem</h2>

      <div>
        <p className="campo__dica" style={{ marginBottom: 8 }}>
          Status da candidatura
        </p>
        <div className="adm__acoes-status">
          {STATUS.map((s) => (
            <button
              key={s}
              type="button"
              className="botao-status"
              data-ativo={s === status}
              onClick={() => trocarStatus(s)}
              disabled={estado === 'salvando'}
            >
              {STATUS_ROTULO[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="campo">
        <label className="campo__rotulo" htmlFor="responsavel">
          Responsável pela análise
        </label>
        <input
          id="responsavel"
          type="text"
          placeholder="Quem está tocando este contato"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          onBlur={() => salvar({ responsavel })}
        />
      </div>

      <div className="campo">
        <label className="campo__rotulo" htmlFor="notas">
          Notas internas
        </label>
        <textarea
          id="notas"
          placeholder="Impressões da análise, o que foi combinado na conversa, próximos passos…"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />
        <p className="campo__dica">
          Visível apenas para a equipe. Nunca compartilhado com o candidato.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button
          className="botao"
          type="button"
          onClick={() => salvar({ status, notas, responsavel })}
          disabled={estado === 'salvando'}
        >
          {estado === 'salvando' ? 'Salvando…' : 'Salvar'}
        </button>
        {estado === 'salvo' && (
          <span style={{ color: 'var(--ok)', fontSize: '0.88rem' }}>Alterações salvas</span>
        )}
        {estado === 'erro' && (
          <span style={{ color: 'var(--erro)', fontSize: '0.88rem' }}>
            Não foi possível salvar. Tente de novo.
          </span>
        )}
      </div>

      <p className="campo__dica">Última atualização: {dataLonga(atualizadoEm)}</p>
    </section>
  )
}
