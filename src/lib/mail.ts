import 'server-only'
import type { Candidatura } from './schema'
import { site } from './site'
import { faixaDoScore } from './score'

/**
 * Envio de e-mail via API HTTP da Resend — sem SDK, só `fetch`.
 * Se `RESEND_API_KEY` não estiver definida, as funções viram no-op e apenas
 * registram no log. O formulário nunca falha por causa de e-mail.
 */

type Email = { para: string; assunto: string; html: string; responderPara?: string }

async function enviar({ para, assunto, html, responderPara }: Email): Promise<boolean> {
  const chave = process.env.RESEND_API_KEY
  const de = process.env.MAIL_FROM
  if (!chave || !de) {
    console.info(`[mail] desativado — e-mail "${assunto}" para ${para} não foi enviado.`)
    return false
  }

  try {
    const resposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${chave}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: de,
        to: [para],
        subject: assunto,
        html,
        ...(responderPara ? { reply_to: responderPara } : {}),
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

function layout(titulo: string, corpo: string) {
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f6f4ef;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#12161a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:14px;border:1px solid #e6e1d8">
      <tr><td style="padding:28px 28px 8px">
        <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#0b5f45;font-weight:700">${site.produtor}</p>
        <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3">${titulo}</h1>
      </td></tr>
      <tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.65;color:#3a424a">${corpo}</td></tr>
      <tr><td style="padding:0 28px 28px">
        <p style="margin:0;font-size:12px;color:#8a9099;border-top:1px solid #eee;padding-top:16px">
          ${site.nomeCompleto} · <a href="${site.url}" style="color:#0b5f45">${site.url.replace(/^https?:\/\//, '')}</a>
        </p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`
}

/** Confirmação automática para o candidato. */
export function confirmacaoCandidato(c: Candidatura) {
  return enviar({
    para: c.email,
    assunto: `Recebemos sua inscrição no ${site.nome} — ${site.produtor}`,
    html: layout(
      `Inscrição recebida, ${c.nome.split(' ')[0]}!`,
      `<p>Sua candidatura para o <strong>${site.nomeCompleto}</strong> chegou até nós e já está na fila de análise.</p>
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
      <p style="margin-top:24px"><a href="${site.url}/admin/${c.id}" style="background:#0b5f45;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Abrir no painel</a></p>`,
    ),
    responderPara: c.email,
  })
}
