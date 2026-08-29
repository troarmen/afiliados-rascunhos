'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Brasao } from '@/components/Marca'

function Entrada() {
  const router = useRouter()
  const parametros = useSearchParams()
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const entrar = async (evento: React.FormEvent) => {
    evento.preventDefault()
    setEnviando(true)
    setErro('')

    const resposta = await fetch('/api/admin/sessao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha }),
    }).catch(() => null)

    if (!resposta?.ok) {
      const corpo = await resposta?.json().catch(() => ({}))
      setErro(corpo?.mensagem ?? 'Não foi possível entrar.')
      setEnviando(false)
      return
    }

    router.replace(parametros.get('voltar') || '/admin')
    router.refresh()
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'var(--papel)',
      }}
    >
      <form
        onSubmit={entrar}
        className="formulario"
        style={{ maxWidth: 400, width: '100%', padding: 0 }}
      >
        <div className="formulario__corpo" style={{ gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Brasao tamanho={38} />
            <div>
              <p style={{ fontFamily: 'var(--fonte-titulo)', fontSize: '1.15rem', fontWeight: 600 }}>
                Painel de parceiros
              </p>
              <p className="campo__dica">Acesso restrito à equipe</p>
            </div>
          </div>

          <div className="campo">
            <label className="campo__rotulo" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              aria-invalid={Boolean(erro)}
            />
            {erro && <p className="campo__erro">{erro}</p>}
          </div>

          <button className="botao botao--largo" type="submit" disabled={enviando || !senha}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default function Entrar() {
  return (
    <Suspense fallback={null}>
      <Entrada />
    </Suspense>
  )
}
