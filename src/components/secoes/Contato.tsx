import { linkWhatsApp, site } from '@/lib/site'
import { Seta } from '../Icones'

export function Contato() {
  const whatsapp = linkWhatsApp(`Olá! Tenho uma dúvida sobre o ${site.nome}.`)

  return (
    <section className="secao" id="contato">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">Contato</span>
          <h2>
            Prefere <span className="realce">conversar antes?</span>
          </h2>
          <p className="subtitulo">
            Dúvida sobre encaixe, formato de divulgação ou condição comercial: fale direto com
            quem toca o programa. Respondemos em dias úteis.
          </p>
        </div>

        <div className="grade grade--2" style={{ maxWidth: 760 }}>
          <a className="cartao cartao--interativo" href={`mailto:${site.email}`}>
            <h3>E-mail</h3>
            <p>{site.email}</p>
            <span className="link-ambar">
              Escrever agora <Seta />
            </span>
          </a>

          {whatsapp ? (
            <a
              className="cartao cartao--interativo"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>WhatsApp</h3>
              <p>Atendimento em horário comercial</p>
              <span className="link-ambar">
                Abrir conversa <Seta />
              </span>
            </a>
          ) : (
            <a
              className="cartao cartao--interativo"
              href={site.canal.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>Canal no YouTube</h3>
              <p>Conheça o conteúdo do {site.produtor} antes de decidir</p>
              <span className="link-ambar">
                Assistir <Seta />
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
