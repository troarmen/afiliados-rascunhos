import 'server-only'
import type { Candidatura, InteresseProdutor } from './schema'
import { linkComunidade, site } from './site'
import { faixaDoScore } from './score'

/**
 * Envio de e-mail via API HTTP da Brevo — sem SDK, só `fetch`.
 * Se `BREVO_API_KEY` não estiver definida, as funções viram no-op e apenas
 * registram no log. O formulário nunca falha por causa de e-mail.
 */

type Email = { para: string; assunto: string; html: string; responderPara?: string }

/**
 * A Brevo quer remetente como objeto, não como cabeçalho `Nome <e-mail>`.
 * `MAIL_FROM` continua no formato legível de sempre; a separação é aqui.
 */
function remetente(valor: string) {
  const casa = valor.match(/^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/)
  if (!casa) return { email: valor.trim() }
  const nome = casa[1].replace(/^"|"$/g, '').trim()
  return nome ? { name: nome, email: casa[2].trim() } : { email: casa[2].trim() }
}

async function enviar({ para, assunto, html, responderPara }: Email): Promise<boolean> {
  const chave = process.env.BREVO_API_KEY
  const de = process.env.MAIL_FROM
  if (!chave || !de) {
    console.info(`[mail] desativado — e-mail "${assunto}" para ${para} não foi enviado.`)
    return false
  }

  try {
    const resposta = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': chave,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: remetente(de),
        to: [{ email: para }],
        subject: assunto,
        htmlContent: html,
        ...(responderPara ? { replyTo: { email: responderPara } } : {}),
      }),
    })
    if (!resposta.ok) {
      console.error('[mail] falha no envio:', resposta.status, await resposta.text())
      return false
    }
    return true
  } catch (erro) {
    console.error('[mail] erro de rede:', erro)
    return false
  }
}

/**
 * Molde dos e-mails transacionais, na identidade do Duck.
 *
 * Tudo em estilo inline e tabela: cliente de e-mail não lê CSS externo nem
 * variável de tema. As cores são as mesmas do site, escritas à mão porque
 * `var(--ambar)` não existe do lado do Gmail.
 */
function layout(titulo: string, corpo: string) {
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f4f6fb;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#000e29">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:16px;border:1px solid #dde3f0;overflow:hidden">
      <tr><td style="background:#000e29;padding:20px 28px">
        <span style="font-size:19px;font-weight:800;letter-spacing:-.5px;color:#ffc20e">Duck</span><span style="font-size:19px;font-weight:800;letter-spacing:-.5px;color:#fff">Affiliate</span>
        <p style="margin:5px 0 0;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5)">${site.selo}</p>
      </td></tr>
      <tr><td style="padding:26px 28px 8px">
        <h1 style="margin:0;font-size:22px;line-height:1.3;color:#000e29">${titulo}</h1>
      </td></tr>
      <tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.65;color:#47526b">${corpo}</td></tr>
      <tr><td style="padding:0 28px 28px">
        <p style="margin:0;font-size:12px;color:#6b7690;border-top:1px solid #eef1f7;padding-top:16px">
          ${site.nome} · <a href="${site.url}" style="color:#8a5a00">${site.url.replace(/^https?:\/\//, '')}</a>
        </p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`
}

/** Confirmação automática para o candidato. */
export function confirmacaoCandidato(c: Candidatura) {
  return enviar({
    para: c.email,
    assunto: `Recebemos a sua inscrição no ${site.nome}`,
    html: layout(
      `Inscrição recebida, ${c.nome.split(' ')[0]}!`,
      `<p>Sua candidatura para o <strong>${site.nome}</strong> chegou até nós e já está na fila de análise.</p>
       <p><strong>O que acontece agora:</strong></p>
       <ol style="padding-left:18px">
         <li>Analisamos seu canal e o encaixe com os cursos — leva até <strong>7 dias úteis</strong>.</li>
         <li>Damos retorno por e-mail, aprovado ou não. Todo mundo recebe resposta.</li>
         <li>Havendo encaixe, marcamos uma conversa rápida para alinhar a parceria.</li>
       </ol>
       <p>Enquanto isso, não precisa fazer nada. Se quiser adiantar, responda este e-mail contando qual conteúdo seu costuma performar melhor — ajuda bastante na análise.</p>
       <p style="margin-top:24px">Até breve,<br><strong>Equipe ${site.produtor}</strong></p>`,
    ),
    responderPara: process.env.MAIL_TEAM,
  })
}

/** Alerta interno para a equipe. */
export function alertaEquipe(c: Candidatura) {
  const destino = process.env.MAIL_TEAM
  if (!destino) return Promise.resolve(false)
  const faixa = faixaDoScore(c.score)
  return enviar({
    para: destino,
    assunto: `[${faixa.rotulo}] Nova candidatura: ${c.canalNome} (${c.audiencia})`,
    html: layout(
      'Nova candidatura no funil',
      `<table style="width:100%;font-size:14px;border-collapse:collapse">
        ${[
          ['Nome', c.nome],
          ['E-mail', c.email],
          ['WhatsApp', c.telefone],
          ['Canal', `<a href="${c.canalUrl}">${c.canalNome}</a>`],
          ['Plataforma', c.plataformaPrincipal],
          ['Área', c.area],
          ['Audiência', c.audiencia],
          ['Divulgação', c.formasDivulgacao.join(', ')],
          ['Já é afiliado Hotmart', c.jaEhAfiliadoHotmart ? 'Sim' : 'Não'],
          ['Score de triagem', `${c.score}/100 — ${faixa.rotulo}`],
          ['Origem', c.origem || '—'],
        ]
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#8a9099;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0">${v}</td></tr>`,
          )
          .join('')}
      </table>
      <p style="margin-top:20px"><strong>Motivação:</strong><br>${c.motivacao.replace(/</g, '&lt;').replace(/\n/g, '<br>')}</p>
      ${c.experiencia ? `<p><strong>Experiência:</strong><br>${c.experiencia.replace(/</g, '&lt;').replace(/\n/g, '<br>')}</p>` : ''}
      <p style="margin-top:24px"><a href="${site.url}/admin/${c.id}" style="background:#ffc20e;color:#000e29;font-weight:700;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Abrir no painel</a></p>`,
    ),
    responderPara: c.email,
  })
}

// ===========================================================================
// Área do parceiro
// ===========================================================================

/** O link de acesso pedido pelo parceiro. Vale 20 minutos. */
export function linkDeAcesso(c: Candidatura, url: string) {
  return enviar({
    para: c.email,
    assunto: `Seu link de acesso ao ${site.nome}`,
    html: layout(
      `Entre na área do parceiro, ${c.nome.split(' ')[0]}`,
      `<p>Você pediu um link para entrar na área do parceiro do <strong>${site.nome}</strong>. É só clicar:</p>
       <p style="margin:22px 0"><a href="${url}" style="background:#ffc20e;color:#000e29;font-weight:700;padding:13px 22px;border-radius:10px;text-decoration:none;display:inline-block">Entrar na área do parceiro</a></p>
       <p style="font-size:13px;color:#6b7690">O link vale por <strong>20 minutos</strong> e abre só uma sessão neste navegador. Se você não pediu este acesso, pode ignorar este e-mail — nada acontece sem o clique.</p>
       <p style="font-size:12px;color:#6b7690;word-break:break-all">Se o botão não funcionar, copie e cole: ${url}</p>`,
    ),
    responderPara: process.env.MAIL_TEAM,
  })
}

/**
 * Boas-vindas ao virar "aprovado": é assim que o parceiro fica sabendo que
 * a área existe. Sem este e-mail, o login seria uma porta sem placa.
 */
export function boasVindasParceiro(c: Candidatura) {
  return enviar({
    para: c.email,
    assunto: `Você foi aprovado no ${site.nome} — seus materiais já estão prontos`,
    html: layout(
      `Bem-vindo ao ${site.nome}, ${c.nome.split(' ')[0]}!`,
      `<p>Sua candidatura foi aprovada. A partir de agora você tem acesso à <strong>área do parceiro</strong>, onde ficam todos os materiais de divulgação: thumbnails, cortes, roteiros, textos, cupons e o calendário de campanhas.</p>
       <p><strong>Como entrar:</strong> acesse a área do parceiro, informe este e-mail (<em>${c.email}</em>) e você recebe um link de acesso. Sem senha para guardar.</p>
       <p style="margin:22px 0"><a href="${site.url}/parceiro/entrar" style="background:#ffc20e;color:#000e29;font-weight:700;padding:13px 22px;border-radius:10px;text-decoration:none;display:inline-block">Acessar a área do parceiro</a></p>
       ${
         linkComunidade()
           ? `<p style="margin:22px 0;padding:16px 18px;border:1px solid #e6e8ee;border-radius:12px;background:#faf9f6">
                <strong>Entre também na comunidade de parceiros.</strong><br>
                É onde ficam o calendário de campanhas, os avisos de mudança de oferta e a
                troca com outros criadores educacionais sobre o que está funcionando.<br>
                <a href="${linkComunidade()}" style="color:#8a5a00;font-weight:700">Entrar no ${site.comunidade.plataforma} do ${site.nome} →</a>
              </p>`
           : ''
       }
       <p>Nos próximos dias entramos em contato para alinhar a sua conta na Hotmart e as condições da parceria. Enquanto isso, já dá para conhecer o material.</p>
       <p style="margin-top:24px">Até já,<br><strong>Equipe ${site.produtor}</strong></p>`,
    ),
    responderPara: process.env.MAIL_TEAM,
  })
}

// ===========================================================================
// Produtores
// ===========================================================================

export function confirmacaoProdutor(p: InteresseProdutor) {
  return enviar({
    para: p.email,
    assunto: `Recebemos o seu interesse no ${site.nome}`,
    html: layout(
      `Obrigado, ${p.nome.split(' ')[0]}!`,
      `<p>Recebemos as informações sobre <strong>${p.projeto}</strong>. A gente lê tudo com calma e volta a falar com você em dias úteis para conversar sobre encaixe e condições.</p>
       <p>Enquanto isso, se quiser adiantar, responda este e-mail com o link da página de vendas do curso que mais vende hoje — ajuda bastante na conversa.</p>
       <p style="margin-top:24px">Até breve,<br><strong>Equipe ${site.nome}</strong></p>`,
    ),
    responderPara: process.env.MAIL_TEAM,
  })
}

export function alertaProdutor(p: InteresseProdutor) {
  const destino = process.env.MAIL_TEAM
  if (!destino) return Promise.resolve(false)
  const esc = (v: string) => v.replace(/</g, '&lt;').replace(/\n/g, '<br>')
  return enviar({
    para: destino,
    assunto: `[Produtor] Novo interesse: ${p.projeto} (${p.plataforma})`,
    html: layout(
      'Novo produtor interessado',
      `<table style="width:100%;font-size:14px;border-collapse:collapse">
        ${[['Nome', p.nome], ['E-mail', p.email], ['WhatsApp', p.telefone || '—'], ['Projeto', p.projeto], ['Link', p.url || '—'], ['Plataforma', p.plataforma]]
          .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#8a9099;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0">${v}</td></tr>`)
          .join('')}
      </table>
      <p style="margin-top:20px"><strong>Catálogo e público:</strong><br>${esc(p.catalogo)}</p>
      <p style="margin-top:24px"><a href="${site.url}/admin/produtores" style="background:#ffc20e;color:#000e29;font-weight:700;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Abrir no painel</a></p>`,
    ),
    responderPara: p.email,
  })
}
