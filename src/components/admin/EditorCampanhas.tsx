'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Campanha } from '@/lib/materiais'
import { dataCurta } from '@/lib/utils'

type Props = { programaId: string; campanhas: Campanha[]; contagem: Record<string, number> }

export function EditorCampanhas({ programaId, campanhas, contagem }: Props) {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [erro, setErro] = useState('')
  const [ocupado, setOcupado] = useState(false)

  const criar = async (e: React.FormEvent) => {
    e.preventDefault()
    setOcupado(true)
    setErro('')
    const r = await fetch('/api/admin/campanhas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programaId, nome, descricao, inicio: inicio || undefined, fim: fim || undefined, ativa: true }),
    }).catch(() => null)
    const corpo = await r?.json().catch(() => ({}))
    setOcupado(false)
    if (!r?.ok) return setErro(corpo?.mensagem ?? 'Não foi possível criar.')
    setNome(''); setDescricao(''); setInicio(''); setFim('')
    router.refresh()
  }

  const alternar = async (c: Campanha) => {
    await fetch(`/api/admin/campanhas/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativa: !c.ativa }),
    })
    router.refresh()
  }

  const apagar = async (c: Campanha) => {
    const n = contagem[c.id] ?? 0
    if (!window.confirm(`Apagar "${c.nome}"?${n ? ` ${n} material(is) perdem o vínculo, mas continuam na biblioteca.` : ''}`)) return
    await fetch(`/api/admin/campanhas/${c.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <form className="ficha-bloco" onSubmit={criar}>
        <h2>Nova campanha</h2>
        <div className="grade grade--2" style={{ gap: 14 }}>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="c-nome">Nome</label>
            <input id="c-nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Lançamento — Turma de outubro" />
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="c-desc">Descrição (opcional)</label>
            <input id="c-desc" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="O que o parceiro precisa saber" />
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="c-inicio">Início</label>
            <input id="c-inicio" type="date" min="2020-01-01" max="2099-12-31" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="c-fim">Fim</label>
            <input id="c-fim" type="date" min="2020-01-01" max="2099-12-31" value={fim} onChange={(e) => setFim(e.target.value)} />
          </div>
        </div>
        {erro && <p className="campo__erro">{erro}</p>}
        <div>
          <button className="botao" type="submit" disabled={ocupado || nome.trim().length < 2}>
            {ocupado ? 'Criando…' : 'Criar campanha'}
          </button>
        </div>
      </form>

      <div className="tabela-caixa">
        {campanhas.length === 0 ? (
          <p className="adm__vazio">Nenhuma campanha ainda. Materiais sem campanha são permanentes.</p>
        ) : (
          <table className="adm-tabela" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                <th>Campanha</th>
                <th>Período</th>
                <th>Materiais</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {campanhas.map((c) => (
                <tr key={c.id} style={c.ativa ? undefined : { opacity: 0.6 }}>
                  <td>
                    <strong>{c.nome}</strong>
                    {c.descricao && <p className="celula-secundaria">{c.descricao}</p>}
                  </td>
                  <td>{c.inicio ? dataCurta(c.inicio) : '—'}{c.fim ? ` → ${dataCurta(c.fim)}` : ''}</td>
                  <td>{contagem[c.id] ?? 0}</td>
                  <td><span className="etiqueta" data-status={c.ativa ? 'aprovado' : 'standby'}>{c.ativa ? 'Ativa' : 'Encerrada'}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="botao botao--fantasma" type="button" onClick={() => alternar(c)} style={{ padding: '6px 10px', fontSize: '0.82rem' }}>
                      {c.ativa ? 'Encerrar' : 'Reativar'}
                    </button>{' '}
                    <button className="botao botao--fantasma" type="button" onClick={() => apagar(c)} style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--erro)' }}>
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
