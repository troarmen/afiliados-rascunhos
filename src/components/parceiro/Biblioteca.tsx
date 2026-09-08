'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  ORDENACOES,
  TIPOS,
  filtrarMateriais,
  formatosPresentes,
  type Campanha,
  type Material,
  type Ordenacao,
  type TipoMaterial,
} from '@/lib/materiais'
import { CartaoMaterial } from './CartaoMaterial'

type Props = { materiais: Material[]; campanhas: Campanha[]; base: string }

/**
 * A biblioteca: busca, filtros, ordenação e grade/lista, tudo no navegador.
 *
 * O estado mora na URL (`?tipo=video&ordem=usados`): dá para mandar um
 * link "olha os banners da Black Friday" para outro parceiro, e o botão
 * voltar do navegador funciona como se espera. Só a vista (grade/lista) é
 * preferência pessoal e fica no localStorage.
 */
export function Biblioteca({ materiais, campanhas, base }: Props) {
  const router = useRouter()
  const caminho = usePathname()
  const params = useSearchParams()

  const busca = params.get('busca') ?? ''
  const tipo = (params.get('tipo') ?? 'todos') as TipoMaterial | 'todos'
  const campanhaId = params.get('campanha') ?? 'todas'
  const formato = params.get('formato') ?? 'todos'
  const ordem = (params.get('ordem') ?? 'recentes') as Ordenacao

  const [vista, setVista] = useState<'grade' | 'lista'>('grade')
  const [textoBusca, setTextoBusca] = useState(busca)

  useEffect(() => {
    try {
      const v = localStorage.getItem('duck.biblioteca.vista')
      if (v === 'lista' || v === 'grade') setVista(v)
    } catch {}
  }, [])

  const trocarVista = (v: 'grade' | 'lista') => {
    setVista(v)
    try { localStorage.setItem('duck.biblioteca.vista', v) } catch {}
  }

  const definir = useCallback(
    (mudancas: Record<string, string | null>) => {
      const proximo = new URLSearchParams(params.toString())
      for (const [k, v] of Object.entries(mudancas)) {
        if (!v || v === 'todos' || v === 'todas' || v === 'recentes') proximo.delete(k)
        else proximo.set(k, v)
      }
      const q = proximo.toString()
      router.replace(q ? `${caminho}?${q}` : caminho, { scroll: false })
    },
    [params, router, caminho],
  )

  // Busca com pequeno atraso para não reescrever a URL a cada tecla.
  useEffect(() => {
    if (textoBusca === busca) return
    const t = setTimeout(() => definir({ busca: textoBusca.trim() || null }), 250)
    return () => clearTimeout(t)
  }, [textoBusca, busca, definir])

  const lista = useMemo(
    () => filtrarMateriais(materiais, { busca, tipo, campanhaId, formato, ordem }),
    [materiais, busca, tipo, campanhaId, formato, ordem],
  )
  const formatos = useMemo(() => formatosPresentes(materiais), [materiais])
  const contagemTipo = useMemo(
    () => materiais.reduce<Record<string, number>>((acc, m) => { acc[m.tipo] = (acc[m.tipo] ?? 0) + 1; return acc }, {}),
    [materiais],
  )
  const filtrado = busca || tipo !== 'todos' || campanhaId !== 'todas' || formato !== 'todos'
  const nomeCampanha = (id: string | null) => campanhas.find((c) => c.id === id)?.nome

  return (
    <div className="bib">
      <div className="bib__barra" role="search">
        <div className="bib__busca">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input type="search" value={textoBusca} onChange={(e) => setTextoBusca(e.target.value)} placeholder="Buscar por título, descrição, formato ou tag" aria-label="Buscar materiais" />
        </div>

        <label className="bib__controle">
          <span>Ordenar</span>
          <select value={ordem} onChange={(e) => definir({ ordem: e.target.value })}>
            {ORDENACOES.map((o) => <option key={o.slug} value={o.slug}>{o.rotulo}</option>)}
          </select>
        </label>

        {campanhas.length > 0 && (
          <label className="bib__controle">
            <span>Campanha</span>
            <select value={campanhaId} onChange={(e) => definir({ campanha: e.target.value })}>
              <option value="todas">Todas</option>
              {campanhas.map((c) => <option key={c.id} value={c.id}>{c.nome}{c.ativa ? '' : ' (encerrada)'}</option>)}
            </select>
          </label>
        )}

        {formatos.length > 1 && (
          <label className="bib__controle">
            <span>Formato</span>
            <select value={formato} onChange={(e) => definir({ formato: e.target.value })}>
              <option value="todos">Todos</option>
              {formatos.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
        )}

        <div className="bib__vista" role="group" aria-label="Visualização">
          <button type="button" aria-pressed={vista === 'grade'} onClick={() => trocarVista('grade')} title="Grade">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></svg>
          </button>
          <button type="button" aria-pressed={vista === 'lista'} onClick={() => trocarVista('lista')} title="Lista">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      <div className="chips" role="tablist" aria-label="Tipo de material">
        <button type="button" className="chip" role="tab" aria-selected={tipo === 'todos'} onClick={() => definir({ tipo: null })}>
          Todos <b>{materiais.length}</b>
        </button>
        {TIPOS.filter((t) => contagemTipo[t.slug]).map((t) => (
          <button key={t.slug} type="button" className="chip" role="tab" aria-selected={tipo === t.slug} style={{ ['--cor-tipo' as string]: t.cor }} onClick={() => definir({ tipo: t.slug })}>
            <span className="chip__ponto" />{t.rotulo} <b>{contagemTipo[t.slug]}</b>
          </button>
        ))}
      </div>

      <h2 className="bib__resumo" aria-live="polite">
        {lista.length === materiais.length
          ? `${lista.length} materia${lista.length === 1 ? 'l' : 'is'}`
          : `${lista.length} de ${materiais.length} materiais`}
        {filtrado && (
          <button type="button" className="bib__limpar" onClick={() => { setTextoBusca(''); router.replace(caminho, { scroll: false }) }}>
            Limpar filtros
          </button>
        )}
      </h2>

      {lista.length === 0 ? (
        <div className="bib__vazio">
          <p><strong>Nada por aqui{filtrado ? ' com esses filtros' : ' ainda'}.</strong></p>
          <p className="campo__dica">{filtrado ? 'Tente outro tipo, outra campanha ou limpe a busca.' : 'Os materiais deste programa estão sendo preparados.'}</p>
        </div>
      ) : (
        <div className={vista === 'lista' ? 'bib__lista' : 'bib__grade'}>
          {lista.map((m) => (
            <CartaoMaterial key={m.id} material={m} campanha={nomeCampanha(m.campanhaId)} base={base} vista={vista} />
          ))}
        </div>
      )}
    </div>
  )
}
