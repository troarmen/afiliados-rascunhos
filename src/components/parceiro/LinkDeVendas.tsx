'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition, type FormEvent } from 'react'
import { plataforma as plataformaDe, validarLinkDeVendas, type PlataformaSlug } from '@/lib/plataformas'
import { BotaoCopiar } from './BotaoCopiar'

type Props = {
  programaSlug: string
  plataforma: PlataformaSlug
  urlAfiliacao: string | null
  /** O link gravado — ou, na prévia da equipe, um exemplo. */
  url: string | null
  /** O que o QR codifica: o link com a etiqueta de origem. */
  linkQr: string | null
  /** SVG do QR, gerado no servidor. */
  qrSvg: string | null
  previa: boolean
}

/**
 * O cartão "Seu link de vendas" da página do programa.
 *
 * Dois estados. Sem link: o passo a passo para conseguir o link na
 * plataforma e o campo para colar. Com link: "pronto para vender", o link
 * para copiar, o QR para baixar. É o primeiro bloco da página porque é o
 * pré-requisito de todo o resto — sem ele, material é genérico.
 */
export function LinkDeVendas({ programaSlug, plataforma, urlAfiliacao, url, linkQr, qrSvg, previa }: Props) {
  const router = useRouter()
  const p = plataformaDe(plataforma)
  const [editando, setEditando] = useState(!url)
  const [valor, setValor] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  // A troca de estado entra na mesma transição que o refresh: o cartão
  // "pronto" só aparece quando o servidor já devolveu o link novo e o QR
  // novo — nunca o QR velho com o link novo.
  const [atualizando, startTransition] = useTransition()
  const api = `/api/parceiro/programas/${programaSlug}/link`
  const qr = `/api/parceiro/programas/${programaSlug}/qr`

  const salvar = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    const v = validarLinkDeVendas(valor, plataforma)
    if (!v.ok) return setErro(v.mensagem)
    if (previa) return setErro('Na prévia da equipe o link não é gravado. Entre como parceiro para testar de ponta a ponta.')
    setEnviando(true)
    try {
      const r = await fetch(api, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: v.url }) })
      const dados = await r.json().catch(() => ({}))
      if (!r.ok) return setErro(dados.mensagem ?? 'Não foi possível salvar. Tente de novo.')
      setValor('')
      startTransition(() => {
        router.refresh()
        setEditando(false)
      })
    } catch {
      setErro('Sem conexão. Tente de novo.')
    } finally {
      setEnviando(false)
    }
  }

  const remover = async () => {
    if (previa) return
    if (!window.confirm('Remover o link? Os textos da biblioteca voltam a sair sem ele.')) return
    await fetch(api, { method: 'DELETE' })
    startTransition(() => {
      router.refresh()
      setEditando(true)
    })
  }

  const pronto = Boolean(url) && !editando

  if (pronto) {
    return (
      <section className="link-vendas link-vendas--pronto" id="link" aria-labelledby="link-titulo">
        <div className="link-vendas__texto">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="selo selo--ok">✓ Pronto para vender</span>
            {previa && <span className="selo">Exemplo · prévia da equipe</span>}
          </div>
          <h2 id="link-titulo">Seu link de vendas</h2>
          <p>
            Tudo o que você usar daqui leva este link: o QR, os textos copiados com o link já dentro. A venda é
            atribuída a você pela {p.nome}
            {p.parametroOrigem ? (
              <>
                , e o relatório dela mostra de qual material veio (etiqueta <code>{p.parametroOrigem}</code>).
              </>
            ) : (
              '.'
            )}
          </p>
          <div className="caixa-link">
            <code>{url}</code>
            <BotaoCopiar texto={url ?? ''} />
          </div>
          <div className="link-vendas__secundarias">
            <button type="button" className="botao-texto" onClick={() => setEditando(true)}>
              {previa ? 'Ver o passo a passo que o parceiro vê' : 'Alterar link'}
            </button>
            {!previa && (
              <button type="button" className="botao-texto botao-texto--discreto" onClick={remover}>
                Remover
              </button>
            )}
          </div>
        </div>

        <figure className="qr">
          {qrSvg ? <div className="qr__figura" dangerouslySetInnerHTML={{ __html: qrSvg }} /> : <div className="qr__figura" />}
          <figcaption className="campo__dica" style={{ textAlign: 'center', maxWidth: 220 }}>
            Quem lê o QR cai no seu link{p.parametroOrigem ? ' (etiqueta duck-qr)' : ''}. Serve para vídeo, slide, impresso.
          </figcaption>
          <div className="qr__acoes">
            {previa ? (
              <>
                <span className="botao botao--secundario" aria-disabled="true">Baixar PNG</span>
                <span className="botao botao--fantasma" aria-disabled="true">SVG</span>
              </>
            ) : (
              <>
                <a className="botao botao--secundario" href={`${qr}?baixar=1`} download>Baixar PNG</a>
                <a className="botao botao--fantasma" href={`${qr}?baixar=1&formato=svg`} download>SVG</a>
              </>
            )}
          </div>
          {linkQr && <span className="visualmente-oculto">O QR contém {linkQr}</span>}
        </figure>
      </section>
    )
  }

  const trocando = Boolean(url) && !previa

  return (
    <section className="link-vendas" id="link" aria-labelledby="link-titulo">
      <div className="link-vendas__texto">
        <span className="selo selo--ambar">{trocando ? 'Alterar link' : 'Falta um passo para vender'}</span>
        <h2 id="link-titulo">{trocando ? 'Trocar o seu link de vendas' : 'Cadastre seu link de vendas'}</h2>
        {!trocando && (
          <p>
            É o link que a {p.nome} gera para você: sem ele, a venda não é atribuída a ninguém. Com ele, cada material
            daqui sai já com o seu link — e o QR code é gerado na hora.
          </p>
        )}
      </div>

      {!trocando && (
        <ol className="checklist">
          {p.passos.map((passo, i) => (
            <li key={passo.titulo}>
              <div>
                <strong>{passo.titulo}</strong>
                <p>
                  {passo.descricao}
                  {i === 0 && p.urlConta && (
                    <>
                      {' '}
                      <a href={p.urlConta} target="_blank" rel="noopener noreferrer">Abrir {p.nome} ↗</a>
                    </>
                  )}
                  {i === 1 && urlAfiliacao && (
                    <>
                      {' '}
                      <a href={urlAfiliacao} target="_blank" rel="noopener noreferrer">Solicitar afiliação ↗</a>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <form className="link-vendas__form" onSubmit={salvar} noValidate>
        <div className="campo">
          <label className="campo__rotulo" htmlFor="link-vendas">Seu {p.nomeDoLink}</label>
          <div className="campo__linha">
            <input
              id="link-vendas"
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder={p.exemplo}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              aria-invalid={Boolean(erro)}
              aria-describedby={erro ? 'link-vendas-erro' : 'link-vendas-dica'}
            />
            <button className="botao" type="submit" disabled={enviando || atualizando}>
              {enviando || atualizando ? 'Salvando…' : 'Salvar link'}
            </button>
            {(trocando || previa) && (
              <button type="button" className="botao botao--fantasma" onClick={() => { setEditando(false); setErro(null) }}>
                Cancelar
              </button>
            )}
          </div>
          {erro ? (
            <p className="campo__erro" id="link-vendas-erro" role="alert">{erro}</p>
          ) : (
            <p className="campo__dica" id="link-vendas-dica">
              Cole o link inteiro, como a {p.nome} mostra. Dá para trocar depois.
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
