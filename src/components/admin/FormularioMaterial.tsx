'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconeTipo } from '../parceiro/IconeTipo'
import {
  FORMATOS_SUGERIDOS,
  TIPOS,
  formatoDasDimensoes,
  tamanhoLegivel,
  tipo as tipoDe,
  type Campanha,
  type Material,
  type OrigemMaterial,
  type Programa,
  type TipoMaterial,
} from '@/lib/materiais'

type Props = {
  programas: Programa[]
  campanhas: Campanha[]
  modo: 'supabase' | 'arquivo'
  material?: Material
}

type Enviado = {
  caminho: string
  nomeArquivo: string
  mime: string
  tamanho: number
  largura: number | null
  altura: number | null
}

/**
 * Um formulário para as três origens. A origem decide qual bloco aparece
 * (arquivo / texto / link) e é travada depois de criado — trocar um banner
 * por um texto é criar outro material, não editar este.
 */
export function FormularioMaterial({ programas, campanhas, modo, material }: Props) {
  const router = useRouter()
  const editando = Boolean(material)

  const [programaId, setProgramaId] = useState(material?.programaId ?? programas[0]?.id ?? '')
  const [tipo, setTipo] = useState<TipoMaterial>(material?.tipo ?? 'imagem')
  const [origem, setOrigem] = useState<OrigemMaterial>(material?.origem ?? 'arquivo')
  const [titulo, setTitulo] = useState(material?.titulo ?? '')
  const [descricao, setDescricao] = useState(material?.descricao ?? '')
  const [campanhaId, setCampanhaId] = useState(material?.campanhaId ?? '')
  const [formato, setFormato] = useState(material?.formato ?? '')
  const [tags, setTags] = useState(material?.tags.join(', ') ?? '')
  const [recomendado, setRecomendado] = useState(material?.recomendado ?? false)
  const [arquivado, setArquivado] = useState(material?.arquivado ?? false)
  const [conteudo, setConteudo] = useState(material?.conteudo ?? '')
  const [url, setUrl] = useState(material?.url ?? '')

  const [enviado, setEnviado] = useState<Enviado | null>(
    material?.caminho
      ? {
          caminho: material.caminho,
          nomeArquivo: material.nomeArquivo ?? '',
          mime: material.mime ?? '',
          tamanho: material.tamanho ?? 0,
          largura: material.largura,
          altura: material.altura,
        }
      : null,
  )
  const [progresso, setProgresso] = useState<'parado' | 'enviando' | 'ok' | 'erro'>('parado')
  const [erroArquivo, setErroArquivo] = useState('')
  const [erros, setErros] = useState<Record<string, string>>({})
  const [estado, setEstado] = useState<'parado' | 'salvando' | 'salvo' | 'erro'>('parado')
  const [mensagem, setMensagem] = useState('')
  const entradaArquivo = useRef<HTMLInputElement>(null)

  const campanhasDoPrograma = useMemo(
    () => campanhas.filter((c) => c.programaId === programaId),
    [campanhas, programaId],
  )

  const escolherTipo = (novo: TipoMaterial) => {
    setTipo(novo)
    // Só sugere a origem enquanto cria — e nunca troca por baixo de um arquivo enviado.
    if (!editando && !enviado) setOrigem(tipoDe(novo).origem)
  }

  // --- Upload ---------------------------------------------------------------

  const dimensoes = (arquivo: File): Promise<{ largura: number | null; altura: number | null }> =>
    new Promise((resolver) => {
      if (!arquivo.type.startsWith('image/') || arquivo.type === 'image/svg+xml') {
        return resolver({ largura: null, altura: null })
      }
      const img = new Image()
      const objeto = URL.createObjectURL(arquivo)
      img.onload = () => {
        resolver({ largura: img.naturalWidth, altura: img.naturalHeight })
        URL.revokeObjectURL(objeto)
      }
      img.onerror = () => resolver({ largura: null, altura: null })
      img.src = objeto
    })

  const enviarArquivo = async (arquivo: File) => {
    setErroArquivo('')
    setProgresso('enviando')

    const preparo = await fetch('/api/admin/materiais/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: arquivo.name, mime: arquivo.type, tamanho: arquivo.size }),
    }).catch(() => null)
    const dados = await preparo?.json().catch(() => ({}))
    if (!preparo?.ok) {
      setErroArquivo(dados?.mensagem ?? 'Não foi possível preparar o envio.')
      setProgresso('erro')
      return
    }

    let ok = false
    if (dados.modo === 'supabase') {
      // PUT direto no bucket: o arquivo não passa pelo servidor Next.
      const r = await fetch(dados.url, {
        method: 'PUT',
        headers: { 'Content-Type': arquivo.type, 'x-upsert': 'false' },
        body: arquivo,
      }).catch(() => null)
      ok = Boolean(r?.ok)
    } else {
      const form = new FormData()
      form.set('caminho', dados.caminho)
      form.set('arquivo', arquivo)
      const r = await fetch('/api/admin/materiais/upload', { method: 'POST', body: form }).catch(() => null)
      ok = Boolean(r?.ok)
    }

    if (!ok) {
      setErroArquivo('O envio falhou. Tente de novo.')
      setProgresso('erro')
      return
    }

    const { largura, altura } = await dimensoes(arquivo)
    setEnviado({ caminho: dados.caminho, nomeArquivo: arquivo.name, mime: arquivo.type, tamanho: arquivo.size, largura, altura })
    if (!formato && largura && altura) setFormato(formatoDasDimensoes(largura, altura))
    if (!titulo) setTitulo(arquivo.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '))
    setProgresso('ok')
  }

  // --- Salvar -------------------------------------------------------------------

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setEstado('salvando')
    setErros({})
    setMensagem('')

    const listaTags = tags.split(',').map((t) => t.trim()).filter(Boolean)
    const comum = { tipo, titulo, descricao, formato, tags: listaTags, recomendado, arquivado, campanhaId: campanhaId || undefined }

    const resposta = editando
      ? await fetch(`/api/admin/materiais/${material!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...comum,
            ...(origem === 'texto' ? { conteudo } : {}),
            ...(origem === 'link' ? { url } : {}),
          }),
        }).catch(() => null)
      : await fetch('/api/admin/materiais', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...comum,
            programaId,
            origem,
            ...(origem === 'arquivo' && enviado ? enviado : {}),
            ...(origem === 'texto' ? { conteudo } : {}),
            ...(origem === 'link' ? { url } : {}),
          }),
        }).catch(() => null)

    const corpo = await resposta?.json().catch(() => ({}))
    if (!resposta?.ok) {
      setErros(corpo?.campos ?? {})
      setMensagem(corpo?.mensagem ?? 'Não foi possível salvar.')
      setEstado('erro')
      return
    }
    setEstado('salvo')
    if (editando) {
      router.refresh()
      setTimeout(() => setEstado('parado'), 2500)
    } else {
      router.push('/admin/materiais')
      router.refresh()
    }
  }

  const excluir = async () => {
    if (!material) return
    if (!window.confirm(`Excluir "${material.titulo}"? O arquivo sai do storage e não volta.`)) return
    const r = await fetch(`/api/admin/materiais/${material.id}`, { method: 'DELETE' }).catch(() => null)
    if (r?.ok) {
      router.push('/admin/materiais')
      router.refresh()
    } else {
      setMensagem('Não foi possível excluir.')
    }
  }

  const podeSalvar =
    titulo.trim().length >= 2 &&
    (origem !== 'arquivo' || Boolean(enviado)) &&
    (origem !== 'texto' || conteudo.trim().length > 0) &&
    (origem !== 'link' || /^https?:\/\//i.test(url))

  return (
    <form className="formulario" onSubmit={salvar} style={{ padding: 0 }}>
      <div className="formulario__corpo" style={{ gap: 22 }}>
        {programas.length > 1 && !editando && (
          <div className="campo">
            <label className="campo__rotulo" htmlFor="m-programa">Programa</label>
            <select id="m-programa" value={programaId} onChange={(e) => { setProgramaId(e.target.value); setCampanhaId('') }}>
              {programas.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
        )}

        <div className="etapa-form">
          <h2 className="etapa-form__titulo"><span>1</span> O que é</h2>
          <p className="campo__dica">O tipo decide o filtro em que o parceiro vai encontrar. Escolha o mais específico.</p>
        </div>

        <div className="campo">
          <span className="campo__rotulo">Tipo</span>
          <div className="tipos-grade" role="radiogroup" aria-label="Tipo do material">
            {TIPOS.map((t) => (
              <label key={t.slug} className="tipo-opcao" data-ativo={tipo === t.slug} style={{ ['--cor-tipo' as string]: t.cor }}>
                <input type="radio" name="tipo" value={t.slug} checked={tipo === t.slug} onChange={() => escolherTipo(t.slug)} />
                <IconeTipo tipo={t.slug} tamanho={18} />
                <span>{t.singular}</span>
              </label>
            ))}
          </div>
          {erros.tipo && <p className="campo__erro">{erros.tipo}</p>}
        </div>

        <div className="campo">
          <span className="campo__rotulo">Como o parceiro usa</span>
          <div className="opcoes opcoes--compactas">
            {(
              [
                ['arquivo', 'Arquivo para baixar'],
                ['texto', 'Texto para copiar'],
                ['link', 'Link para abrir'],
              ] as const
            ).map(([valor, rotulo]) => (
              <label key={valor} className="opcao" aria-disabled={editando}>
                <input type="radio" name="origem" value={valor} checked={origem === valor} disabled={editando} onChange={() => setOrigem(valor)} />
                <span>{rotulo}</span>
              </label>
            ))}
          </div>
          {editando ? (
            <p className="campo__dica">A origem não muda depois de criado. Para trocar, crie outro material.</p>
          ) : (
            <p className="campo__dica">
              <strong>Arquivo</strong> = botão Baixar · <strong>Texto</strong> = botão Copiar (roteiro, e-mail, cupom) ·{' '}
              <strong>Link</strong> = botão Abrir (landing, link de divulgação).
            </p>
          )}
        </div>

        <div className="etapa-form">
          <h2 className="etapa-form__titulo"><span>2</span> Conteúdo</h2>
        </div>

        {origem === 'arquivo' && (
          <div className="campo">
            <span className="campo__rotulo">Arquivo</span>
            <div className="zona-envio" data-estado={progresso} onClick={() => entradaArquivo.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) void enviarArquivo(f) }}>
              <input ref={entradaArquivo} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void enviarArquivo(f) }} />
              {progresso === 'enviando' ? (
                <p>Enviando…</p>
              ) : enviado ? (
                <p>
                  <strong>{enviado.nomeArquivo}</strong>
                  <span className="celula-secundaria">
                    {enviado.mime} · {tamanhoLegivel(enviado.tamanho)}
                    {enviado.largura ? ` · ${enviado.largura}×${enviado.altura}` : ''}
                    {editando ? '' : ' · clique para trocar'}
                  </span>
                </p>
              ) : (
                <p>
                  <strong>Arraste o arquivo aqui</strong> ou clique para escolher
                  <span className="celula-secundaria">
                    Imagem, vídeo, PDF, ZIP, apresentação ou texto · até 250 MB
                    {modo === 'supabase' ? ' · envio direto para o storage' : ''}
                  </span>
                </p>
              )}
            </div>
            {(erroArquivo || erros.caminho) && <p className="campo__erro">{erroArquivo || erros.caminho}</p>}
            {editando && <p className="campo__dica">Para substituir o arquivo, crie um material novo e arquive este — assim quem já baixou continua achando a versão antiga pelo histórico.</p>}
          </div>
        )}

        {origem === 'texto' && (
          <div className="campo">
            <label className="campo__rotulo" htmlFor="m-conteudo">Conteúdo</label>
            <textarea id="m-conteudo" rows={10} value={conteudo} onChange={(e) => setConteudo(e.target.value)} placeholder="O texto exatamente como o parceiro deve copiar — roteiro, e-mail, legenda, código do cupom…" aria-invalid={Boolean(erros.conteudo)} />
            {erros.conteudo && <p className="campo__erro">{erros.conteudo}</p>}
            <p className="campo__dica">
              {conteudo.length} caracteres. O parceiro copia com um clique. Escreva <code>{'{{link}}'}</code> onde o link de
              vendas dele deve entrar: cada parceiro copia o texto já com o próprio link, etiquetado para este material.
            </p>
          </div>
        )}

        {origem === 'link' && (
          <div className="campo">
            <label className="campo__rotulo" htmlFor="m-url">Link</label>
            <input id="m-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" aria-invalid={Boolean(erros.url)} />
            {erros.url && <p className="campo__erro">{erros.url}</p>}
          </div>
        )}

        <div className="etapa-form">
          <h2 className="etapa-form__titulo"><span>3</span> Como o parceiro encontra</h2>
          <p className="campo__dica">Título, descrição, campanha, formato e tags entram na busca da biblioteca.</p>
        </div>

        <div className="campo">
          <label className="campo__rotulo" htmlFor="m-titulo">Título</label>
          <input id="m-titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Thumbnail — Curso de Macroeconomia (variação A)" aria-invalid={Boolean(erros.titulo)} />
          {erros.titulo && <p className="campo__erro">{erros.titulo}</p>}
        </div>

        <div className="campo">
          <label className="campo__rotulo" htmlFor="m-descricao">Descrição e instruções de uso</label>
          <textarea id="m-descricao" rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Quando usar, onde encaixa, o que NÃO fazer com ele." />
        </div>

        <div className="grade grade--2" style={{ gap: 16 }}>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="m-campanha">Campanha</label>
            <select id="m-campanha" value={campanhaId} onChange={(e) => setCampanhaId(e.target.value)}>
              <option value="">Sem campanha (material permanente)</option>
              {campanhasDoPrograma.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}{c.ativa ? '' : ' (encerrada)'}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="m-formato">Formato</label>
            <input id="m-formato" type="text" list="formatos" value={formato} onChange={(e) => setFormato(e.target.value)} placeholder="Ex.: Story 1080×1920" />
            <datalist id="formatos">
              {FORMATOS_SUGERIDOS.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="campo">
          <label className="campo__rotulo" htmlFor="m-tags">Tags</label>
          <input id="m-tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="separadas por vírgula: macro, lançamento, shorts" />
          <p className="campo__dica">Entram na busca da biblioteca.</p>
        </div>

        <div className="etapa-form">
          <h2 className="etapa-form__titulo"><span>4</span> Destaque</h2>
        </div>

        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <label className="consentimento">
            <input type="checkbox" checked={recomendado} onChange={(e) => setRecomendado(e.target.checked)} />
            <span><strong>Recomendado</strong> — sobe para o topo e ganha destaque na página do programa</span>
          </label>
          {editando && (
            <label className="consentimento">
              <input type="checkbox" checked={arquivado} onChange={(e) => setArquivado(e.target.checked)} />
              <span><strong>Arquivado</strong> — some da biblioteca do parceiro sem apagar</span>
            </label>
          )}
        </div>

        {mensagem && (
          <div className="aviso aviso--erro"><p>{mensagem}</p></div>
        )}

        <div className="formulario__acoes" style={{ justifyContent: 'flex-start', gap: 12 }}>
          <button className="botao" type="submit" disabled={!podeSalvar || estado === 'salvando' || progresso === 'enviando'}>
            {estado === 'salvando' ? 'Salvando…' : editando ? 'Salvar alterações' : 'Publicar material'}
          </button>
          {estado === 'salvo' && editando && <span style={{ color: 'var(--ok)', fontSize: '0.9rem' }}>Salvo</span>}
          {editando && (
            <button className="botao botao--fantasma" type="button" onClick={excluir} style={{ marginLeft: 'auto', color: 'var(--erro)' }}>
              Excluir material
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
