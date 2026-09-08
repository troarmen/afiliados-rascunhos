'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PLATAFORMAS_VENDA } from '@/lib/produtores'

/**
 * Formulário de interesse do produtor. Uma etapa só: quem tem curso já
 * sabe o que quer dizer, e cinco campos bastam para a primeira conversa.
 */
export function FormularioProdutor() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [projeto, setProjeto] = useState('')
  const [url, setUrl] = useState('')
  const [plataforma, setPlataforma] = useState('')
  const [catalogo, setCatalogo] = useState('')
  const [aceite, setAceite] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [mensagem, setMensagem] = useState('')
  const [estado, setEstado] = useState<'parado' | 'enviando' | 'enviado'>('parado')
  const inicio = useRef(0)
  useEffect(() => { inicio.current = Date.now() }, [])

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setEstado('enviando')
    setErros({})
    setMensagem('')
    const r = await fetch('/api/produtores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, projeto, url, plataforma, catalogo, aceiteContato: aceite, website: '', tempoPreenchimento: Date.now() - inicio.current }),
    }).catch(() => null)
    const corpo = await r?.json().catch(() => ({}))
    if (!r?.ok) {
      setErros(corpo?.campos ?? {})
      setMensagem(corpo?.mensagem ?? 'Não foi possível enviar. Tente de novo.')
      setEstado('parado')
      return
    }
    setEstado('enviado')
  }

  if (estado === 'enviado') {
    return (
      <div className="formulario" id="interesse">
        <div className="formulario__corpo" style={{ gap: 14 }}>
          <span className="olho">Recebido</span>
          <h3 style={{ fontSize: '1.4rem' }}>Obrigado, {nome.split(' ')[0]}. Agora é com a gente.</h3>
          <p style={{ color: 'var(--tinta-2)' }}>
            Lemos o que você contou sobre <strong>{projeto}</strong> e voltamos a falar em dias úteis
            para conversar sobre encaixe e condições. Você também recebe um e-mail de confirmação.
          </p>
          <p className="campo__dica">
            Quer adiantar? Responda o e-mail com o link da página de vendas do curso que mais vende hoje.
          </p>
        </div>
      </div>
    )
  }

  const campo = (id: string, rotulo: string, el: React.ReactNode, dica?: string) => (
    <div className="campo">
      <label className="campo__rotulo" htmlFor={id}>{rotulo}</label>
      {el}
      {erros[id] ? <p className="campo__erro">{erros[id]}</p> : dica ? <p className="campo__dica">{dica}</p> : null}
    </div>
  )

  return (
    <form className="formulario" id="interesse" onSubmit={enviar} noValidate>
      <div className="formulario__topo">
        <h3>Conte sobre o seu catálogo</h3>
        <p className="campo__dica">Cinco campos, sem compromisso. A conversa vem depois.</p>
      </div>
      <div className="formulario__corpo">
        <div className="grade grade--2" style={{ gap: 16 }}>
          {campo('nome', 'Seu nome', <input id="nome" type="text" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} aria-invalid={Boolean(erros.nome)} />)}
          {campo('email', 'E-mail', <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(erros.email)} />)}
          {campo('projeto', 'Canal, escola ou curso', <input id="projeto" type="text" value={projeto} onChange={(e) => setProjeto(e.target.value)} placeholder="Como o público conhece" aria-invalid={Boolean(erros.projeto)} />)}
          {campo('url', 'Link principal', <input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Site, canal ou página de vendas" aria-invalid={Boolean(erros.url)} />, 'Opcional, mas ajuda muito.')}
          {campo('plataforma', 'Onde você vende', (
            <select id="plataforma" value={plataforma} onChange={(e) => setPlataforma(e.target.value)} aria-invalid={Boolean(erros.plataforma)}>
              <option value="">Escolha…</option>
              {PLATAFORMAS_VENDA.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          ))}
          {campo('telefone', 'WhatsApp', <input id="telefone" type="tel" autoComplete="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Opcional" aria-invalid={Boolean(erros.telefone)} />)}
        </div>
        {campo('catalogo', 'Cursos e público', (
          <textarea id="catalogo" rows={5} value={catalogo} onChange={(e) => setCatalogo(e.target.value)} placeholder="Quais cursos você tem, para quem são, faixa de preço e o que espera de um afiliado." aria-invalid={Boolean(erros.catalogo)} />
        ), `${catalogo.length} caracteres — mínimo 30.`)}
        <label className="consentimento">
          <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} />
          <span>
            Autorizo o contato por e-mail ou WhatsApp sobre este interesse. Seus dados seguem a{' '}
            <Link href="/privacidade">política de privacidade</Link>.
          </span>
        </label>
        {erros.aceiteContato && <p className="campo__erro">{erros.aceiteContato}</p>}
        {mensagem && <div className="aviso aviso--erro"><p>{mensagem}</p></div>}
        <div className="formulario__acoes" style={{ justifyContent: 'flex-start' }}>
          <button className="botao botao--g" type="submit" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? 'Enviando…' : 'Quero afiliados para o meu curso'}
          </button>
        </div>
      </div>
    </form>
  )
}
