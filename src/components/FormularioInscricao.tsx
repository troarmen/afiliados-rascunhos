'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  areas,
  faixasAudiencia,
  formasDivulgacao,
  plataformas,
} from '@/lib/programa'

type Estado = {
  nome: string
  email: string
  telefone: string
  canalNome: string
  canalUrl: string
  plataformaPrincipal: string
  redes: { youtube: string; instagram: string; tiktok: string; outra: string }
  area: string
  audiencia: string
  formasDivulgacao: string[]
  jaEhAfiliadoHotmart: boolean
  experiencia: string
  motivacao: string
  comoConheceu: string
  aceiteTermos: boolean
  aceiteContato: boolean
  website: string
}

const INICIAL: Estado = {
  nome: '',
  email: '',
  telefone: '',
  canalNome: '',
  canalUrl: '',
  plataformaPrincipal: '',
  redes: { youtube: '', instagram: '', tiktok: '', outra: '' },
  area: '',
  audiencia: '',
  formasDivulgacao: [],
  jaEhAfiliadoHotmart: false,
  experiencia: '',
  motivacao: '',
  comoConheceu: '',
  aceiteTermos: false,
  aceiteContato: false,
  website: '',
}

const ETAPAS = [
  { titulo: 'Seu canal', descricao: 'Como falamos com você e onde assistimos ao seu trabalho.' },
  { titulo: 'Sua audiência', descricao: 'O que você produz e para quem.' },
  { titulo: 'Sua divulgação', descricao: 'Como você imagina apresentar os cursos.' },
  { titulo: 'Confirmação', descricao: 'Uma última conferida antes de enviar.' },
]

type Erros = Partial<Record<string, string>>

const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
const linkValido = (v: string) => /^(https?:\/\/|[\w-]+\.[a-z]{2,})/i.test(v.trim())

function validarEtapa(etapa: number, d: Estado): Erros {
  const e: Erros = {}
  if (etapa === 0) {
    if (d.nome.trim().length < 3) e.nome = 'Informe seu nome completo.'
    if (!emailValido(d.email)) e.email = 'Informe um e-mail válido.'
    if (d.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Informe um WhatsApp com DDD.'
    if (d.canalNome.trim().length < 2) e.canalNome = 'Informe o nome do canal ou projeto.'
    if (!linkValido(d.canalUrl)) e.canalUrl = 'Informe o link principal do seu canal.'
    if (!d.plataformaPrincipal) e.plataformaPrincipal = 'Escolha sua plataforma principal.'
  }
  if (etapa === 1) {
    if (!d.area) e.area = 'Escolha sua área de atuação.'
    if (!d.audiencia) e.audiencia = 'Informe o tamanho aproximado da audiência.'
  }
  if (etapa === 2) {
    if (d.formasDivulgacao.length === 0) {
      e.formasDivulgacao = 'Escolha ao menos uma forma de divulgação.'
    }
    if (d.motivacao.trim().length < 40) {
      e.motivacao = 'Conte um pouco mais — pelo menos 40 caracteres.'
    }
  }
  if (etapa === 3) {
    if (!d.aceiteTermos) e.aceiteTermos = 'É preciso aceitar os termos de participação.'
    if (!d.aceiteContato) e.aceiteContato = 'Precisamos da sua autorização para entrar em contato.'
  }
  return e
}

export function FormularioInscricao() {
  const router = useRouter()
  const [etapa, setEtapa] = useState(0)
  const [dados, setDados] = useState<Estado>(INICIAL)
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [erroGeral, setErroGeral] = useState('')
  const abertoEm = useRef<number>(0)
  const utm = useRef<Record<string, string>>({})
  const topo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    abertoEm.current = Date.now()
    const params = new URLSearchParams(window.location.search)
    const capturado: Record<string, string> = {}
    for (const chave of ['source', 'medium', 'campaign', 'content'] as const) {
      const valor = params.get(`utm_${chave}`)
      if (valor) capturado[chave] = valor.slice(0, 120)
    }
    utm.current = capturado
  }, [])

  const atualizar = <K extends keyof Estado>(campo: K, valor: Estado[K]) => {
    setDados((anterior) => ({ ...anterior, [campo]: valor }))
    setErros((anterior) => ({ ...anterior, [campo]: undefined }))
  }

  const alternarDivulgacao = (forma: string) => {
    setDados((anterior) => ({
      ...anterior,
      formasDivulgacao: anterior.formasDivulgacao.includes(forma)
        ? anterior.formasDivulgacao.filter((f) => f !== forma)
        : [...anterior.formasDivulgacao, forma],
    }))
    setErros((anterior) => ({ ...anterior, formasDivulgacao: undefined }))
  }

  const irPara = (destino: number) => {
    setEtapa(destino)
    requestAnimationFrame(() => {
      topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const avancar = () => {
    const encontrados = validarEtapa(etapa, dados)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return
    irPara(Math.min(etapa + 1, ETAPAS.length - 1))
  }

  const enviar = async () => {
    // Revalida tudo: o usuário pode ter voltado e apagado algo.
    const todos = [0, 1, 2, 3].reduce<Erros>(
      (acc, i) => ({ ...acc, ...validarEtapa(i, dados) }),
      {},
    )
    setErros(todos)
    if (Object.keys(todos).length > 0) {
      setErroGeral('Alguns campos precisam de atenção. Revise as etapas marcadas.')
      const primeiraEtapaComErro = [0, 1, 2, 3].find(
        (i) => Object.keys(validarEtapa(i, dados)).length > 0,
      )
      if (primeiraEtapaComErro !== undefined) irPara(primeiraEtapaComErro)
      return
    }

    setEnviando(true)
    setErroGeral('')

    try {
      const resposta = await fetch('/api/candidaturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dados,
          tempoPreenchimento: Date.now() - abertoEm.current,
          utm: utm.current,
        }),
      })

      const corpo = await resposta.json().catch(() => ({}))

      if (!resposta.ok) {
        if (corpo?.campos) setErros(corpo.campos)
        setErroGeral(corpo?.mensagem ?? 'Não conseguimos enviar sua inscrição. Tente de novo.')
        setEnviando(false)
        return
      }

      router.push('/obrigado')
    } catch {
      setErroGeral(
        'Falha de conexão. Verifique sua internet e tente novamente — seus dados não foram perdidos.',
      )
      setEnviando(false)
    }
  }

  const ultima = etapa === ETAPAS.length - 1
  const resumo = useMemo(
    () => [
      ['Nome', dados.nome],
      ['E-mail', dados.email],
      ['WhatsApp', dados.telefone],
      ['Canal', `${dados.canalNome} — ${dados.canalUrl}`],
      ['Área', areas.find((a) => a.slug === dados.area)?.nome ?? '—'],
      ['Audiência', dados.audiencia],
      ['Divulgação', dados.formasDivulgacao.join(', ') || '—'],
    ],
    [dados],
  )

  return (
    <div className="formulario" ref={topo}>
      <div className="formulario__topo">
        <div className="progresso" aria-hidden="true">
          {ETAPAS.map((_, i) => (
            <span
              key={i}
              className="progresso__etapa"
              data-estado={i < etapa ? 'feita' : i === etapa ? 'atual' : 'pendente'}
            />
          ))}
        </div>
        <div>
          <p className="campo__dica" style={{ marginBottom: 4 }}>
            Etapa {etapa + 1} de {ETAPAS.length}
          </p>
          <h2 style={{ fontFamily: 'var(--fonte-titulo)', fontSize: '1.35rem' }}>
            {ETAPAS[etapa].titulo}
          </h2>
          <p className="campo__dica" style={{ marginTop: 4 }}>
            {ETAPAS[etapa].descricao}
          </p>
        </div>
      </div>

      <form
        className="formulario__corpo"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (ultima) void enviar()
          else avancar()
        }}
      >
        {/* Armadilha para robôs: invisível para pessoas. */}
        <div className="abelha" aria-hidden="true">
          <label htmlFor="website">Não preencha este campo</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={dados.website}
            onChange={(e) => atualizar('website', e.target.value)}
          />
        </div>

        {etapa === 0 && (
          <>
            <Campo rotulo="Nome completo" id="nome" erro={erros.nome}>
              <input
                id="nome"
                type="text"
                autoComplete="name"
                placeholder="Como você assina seu trabalho"
                value={dados.nome}
                aria-invalid={Boolean(erros.nome)}
                onChange={(e) => atualizar('nome', e.target.value)}
              />
            </Campo>

            <div className="grade grade--2">
              <Campo rotulo="E-mail" id="email" erro={erros.email}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  value={dados.email}
                  aria-invalid={Boolean(erros.email)}
                  onChange={(e) => atualizar('email', e.target.value)}
                />
              </Campo>

              <Campo rotulo="WhatsApp" id="telefone" erro={erros.telefone}>
                <input
                  id="telefone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(11) 90000-0000"
                  value={dados.telefone}
                  aria-invalid={Boolean(erros.telefone)}
                  onChange={(e) => atualizar('telefone', e.target.value)}
                />
              </Campo>
            </div>

            <Campo rotulo="Nome do canal ou projeto" id="canalNome" erro={erros.canalNome}>
              <input
                id="canalNome"
                type="text"
                placeholder="Ex.: História Sem Filtro"
                value={dados.canalNome}
                aria-invalid={Boolean(erros.canalNome)}
                onChange={(e) => atualizar('canalNome', e.target.value)}
              />
            </Campo>

            <Campo
              rotulo="Link principal"
              id="canalUrl"
              erro={erros.canalUrl}
              dica="De preferência o seu canal no YouTube. Se o seu principal for outro, use o dele."
            >
              <input
                id="canalUrl"
                type="text"
                inputMode="url"
                placeholder="youtube.com/@seucanal"
                value={dados.canalUrl}
                aria-invalid={Boolean(erros.canalUrl)}
                onChange={(e) => atualizar('canalUrl', e.target.value)}
              />
            </Campo>

            <Campo
              rotulo="Plataforma principal"
              id="plataformaPrincipal"
              erro={erros.plataformaPrincipal}
            >
              <select
                id="plataformaPrincipal"
                value={dados.plataformaPrincipal}
                aria-invalid={Boolean(erros.plataformaPrincipal)}
                onChange={(e) => atualizar('plataformaPrincipal', e.target.value)}
              >
                <option value="">Selecione…</option>
                {plataformas.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Campo>
          </>
        )}

        {etapa === 1 && (
          <>
            <Campo rotulo="Área de atuação" id="area" erro={erros.area}>
              <select
                id="area"
                value={dados.area}
                aria-invalid={Boolean(erros.area)}
                onChange={(e) => atualizar('area', e.target.value)}
              >
                <option value="">Selecione…</option>
                {areas.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.nome}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo
              rotulo="Tamanho aproximado da audiência"
              id="audiencia"
              erro={erros.audiencia}
              dica="Inscritos do canal, ou seguidores/assinantes da sua plataforma principal. Estimativa serve."
            >
              <select
                id="audiencia"
                value={dados.audiencia}
                aria-invalid={Boolean(erros.audiencia)}
                onChange={(e) => atualizar('audiencia', e.target.value)}
              >
                <option value="">Selecione…</option>
                {faixasAudiencia.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Campo>

            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="campo__rotulo" style={{ marginBottom: 4 }}>
                Outras redes <span style={{ fontWeight: 400, color: 'var(--tinta-3)' }}>(opcional)</span>
              </legend>
              <p className="campo__dica" style={{ marginBottom: 12 }}>
                Ajuda a entender seu alcance total. Link ou @usuário.
              </p>
              <div className="grade grade--2">
                {(
                  [
                    ['youtube', 'YouTube'],
                    ['instagram', 'Instagram'],
                    ['tiktok', 'TikTok'],
                    ['outra', 'Outra rede'],
                  ] as const
                ).map(([chave, rotulo]) => (
                  <Campo key={chave} rotulo={rotulo} id={`rede-${chave}`}>
                    <input
                      id={`rede-${chave}`}
                      type="text"
                      placeholder="@seuperfil"
                      value={dados.redes[chave]}
                      onChange={(e) =>
                        atualizar('redes', { ...dados.redes, [chave]: e.target.value })
                      }
                    />
                  </Campo>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {etapa === 2 && (
          <>
            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="campo__rotulo" style={{ marginBottom: 4 }}>
                Como você pretende divulgar?
              </legend>
              <p className="campo__dica" style={{ marginBottom: 12 }}>
                Pode marcar mais de uma. Não é compromisso — é só para entendermos o formato.
              </p>
              <div className="opcoes">
                {formasDivulgacao.map((forma) => (
                  <label className="opcao" key={forma}>
                    <input
                      type="checkbox"
                      checked={dados.formasDivulgacao.includes(forma)}
                      onChange={() => alternarDivulgacao(forma)}
                    />
                    <span>{forma}</span>
                  </label>
                ))}
              </div>
              {erros.formasDivulgacao && (
                <p className="campo__erro" style={{ marginTop: 8 }}>
                  {erros.formasDivulgacao}
                </p>
              )}
            </fieldset>

            <Campo
              rotulo="Por que você quer participar?"
              id="motivacao"
              erro={erros.motivacao}
              dica="Conte o que a sua audiência procura e por que estes cursos fariam sentido para ela. É o campo que mais pesa na análise."
            >
              <textarea
                id="motivacao"
                value={dados.motivacao}
                aria-invalid={Boolean(erros.motivacao)}
                onChange={(e) => atualizar('motivacao', e.target.value)}
                placeholder="Meu público é formado principalmente por…"
              />
              <p className="campo__dica" style={{ textAlign: 'right' }}>
                {dados.motivacao.trim().length} caracteres
              </p>
            </Campo>

            <label className="consentimento">
              <input
                type="checkbox"
                checked={dados.jaEhAfiliadoHotmart}
                onChange={(e) => atualizar('jaEhAfiliadoHotmart', e.target.checked)}
              />
              <span>Já tenho conta na Hotmart</span>
            </label>

            <Campo
              rotulo="Experiência anterior com divulgação ou afiliação"
              id="experiencia"
              dica="Opcional. Se já divulgou algum produto, conte como foi e que resultado teve."
            >
              <textarea
                id="experiencia"
                style={{ minHeight: 100 }}
                value={dados.experiencia}
                onChange={(e) => atualizar('experiencia', e.target.value)}
                placeholder="Divulguei o curso X em 2024 e…"
              />
            </Campo>

            <Campo rotulo="Como você conheceu o programa?" id="comoConheceu">
              <input
                id="comoConheceu"
                type="text"
                placeholder="Vídeo do canal, indicação, Google…"
                value={dados.comoConheceu}
                onChange={(e) => atualizar('comoConheceu', e.target.value)}
              />
            </Campo>
          </>
        )}

        {etapa === 3 && (
          <>
            <div className="cartao" style={{ background: 'var(--superficie-2)', gap: 12 }}>
              <h3>Confira seus dados</h3>
              <dl style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
                {resumo.map(([rotulo, valor]) => (
                  <div className="painel__linha" key={rotulo}>
                    <dt>{rotulo}</dt>
                    <dd style={{ maxWidth: '62%', overflowWrap: 'anywhere' }}>{valor || '—'}</dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                className="botao botao--fantasma"
                style={{ alignSelf: 'flex-start', marginTop: 4 }}
                onClick={() => irPara(0)}
              >
                Corrigir algo
              </button>
            </div>

            <label className="consentimento">
              <input
                type="checkbox"
                checked={dados.aceiteTermos}
                aria-invalid={Boolean(erros.aceiteTermos)}
                onChange={(e) => atualizar('aceiteTermos', e.target.checked)}
              />
              <span>
                Li e aceito os{' '}
                <Link href="/termos" target="_blank" style={{ color: 'var(--ambar-texto)' }}>
                  termos de participação
                </Link>{' '}
                do programa.
              </span>
            </label>
            {erros.aceiteTermos && <p className="campo__erro">{erros.aceiteTermos}</p>}

            <label className="consentimento">
              <input
                type="checkbox"
                checked={dados.aceiteContato}
                aria-invalid={Boolean(erros.aceiteContato)}
                onChange={(e) => atualizar('aceiteContato', e.target.checked)}
              />
              <span>
                Autorizo o contato por e-mail e WhatsApp sobre esta candidatura e concordo com a{' '}
                <Link href="/privacidade" target="_blank" style={{ color: 'var(--ambar-texto)' }}>
                  política de privacidade
                </Link>
                .
              </span>
            </label>
            {erros.aceiteContato && <p className="campo__erro">{erros.aceiteContato}</p>}
          </>
        )}

        {erroGeral && (
          <div className="aviso aviso--erro" role="alert">
            <p>{erroGeral}</p>
          </div>
        )}

        <div className="formulario__acoes">
          {etapa > 0 ? (
            <button
              type="button"
              className="botao botao--secundario"
              onClick={() => irPara(etapa - 1)}
              disabled={enviando}
            >
              Voltar
            </button>
          ) : (
            <span className="campo__dica">Leva cerca de 5 minutos.</span>
          )}

          <button type="submit" className="botao" disabled={enviando}>
            {enviando ? 'Enviando…' : ultima ? 'Enviar inscrição' : 'Continuar'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Campo({
  rotulo,
  id,
  erro,
  dica,
  children,
}: {
  rotulo: string
  id: string
  erro?: string
  dica?: string
  children: React.ReactNode
}) {
  return (
    <div className="campo">
      <label className="campo__rotulo" htmlFor={id}>
        {rotulo}
      </label>
      {dica && <p className="campo__dica">{dica}</p>}
      {children}
      {erro && <p className="campo__erro">{erro}</p>}
    </div>
  )
}
