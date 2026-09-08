'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Emblema, Wordmark } from '@/components/Marca'

const ERROS: Record<string, string> = {
  expirado: 'Esse link expirou ou já foi usado. Peça um novo abaixo.',
  'sem-acesso': 'Este e-mail não tem acesso à área do parceiro. Se você foi aprovado recentemente, aguarde o e-mail de boas-vindas.',
}

function Entrada() {
  const parametros = useSearchParams()
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<'parado' | 'enviando' | 'enviado' | 'erro'>('parado')
  const [erro, setErro] = useState(ERROS[parametros.get('erro') ?? ''] ?? '')
  const [linkDev, setLinkDev] = useState('')

  const pedir = async (e: React.FormEvent) => {
    e.preventDefault()
    setEstado('enviando')
    setErro('')
    const r = await fetch('/api/parceiro/acesso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, website: '' }),
    }).catch(() => null)
    const corpo = await r?.json().catch(() => ({}))
    if (!r?.ok) {
      setErro(corpo?.mensagem ?? 'Não foi possível pedir o link.')
      setEstado('erro')
      return
    }
    setLinkDev(corpo?.linkDev ?? '')
    setEstado('enviado')
  }

  return (
    <main className="par-entrar">
      <form className="par-entrar__caixa" onSubmit={pedir}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Emblema tamanho={42} />
          <div>
            <Wordmark />
            <p className="campo__dica">Área do parceiro</p>
          </div>
        </div>

        {estado === 'enviado' ? (
          <>
            <div className="aviso aviso--info">
              <p>
                <strong>Confira seu e-mail.</strong> Se <em>{email}</em> tiver acesso, o link
                chega em instantes e vale por 20 minutos. Não achou? Olhe a caixa de promoções ou
                o spam.
              </p>
            </div>
            {linkDev && (
              <div className="aviso aviso--erro">
                <p>
                  <strong>Modo desenvolvimento:</strong> o e-mail está desligado, então o link
                  está aqui. <a href={linkDev}>Entrar na área do parceiro →</a>
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <h1 style={{ fontSize: '1.45rem' }}>Entrar sem senha</h1>
              <p className="campo__dica" style={{ marginTop: 6, maxWidth: '38ch' }}>
                Informe o e-mail da sua candidatura aprovada. Você recebe um link de acesso — nada
                para decorar.
              </p>
            </div>
            <div className="campo">
              <label className="campo__rotulo" htmlFor="email">E-mail</label>
              <input id="email" type="email" autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(erro)} />
              {erro && <p className="campo__erro">{erro}</p>}
            </div>
            <button className="botao botao--largo" type="submit" disabled={estado === 'enviando' || !email}>
              {estado === 'enviando' ? 'Enviando…' : 'Receber link de acesso'}
            </button>
          </>
        )}

        <p className="campo__dica" style={{ textAlign: 'center' }}>
          Ainda não é parceiro? <Link href="/inscricao">Candidate-se</Link>.
        </p>
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
