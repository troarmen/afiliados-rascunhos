import { site } from '@/lib/site'
import { Seta } from '../Icones'

/**
 * A assinatura do produtor.
 *
 * O Duck Affiliate é marca própria e opera sozinho; o Rascunhos Econômicos é
 * o produtor do primeiro catálogo. Esta seção existe para deixar a relação
 * explícita em vez de deixar o visitante adivinhar de quem é o curso que ele
 * vai divulgar — e é onde o "Powered by" ganha o contexto que a pílula do
 * cabeçalho não tem espaço para dar.
 */
export function Assinatura() {
  return (
    <section className="secao escuro" id="catalogo">
      <div className="envelope assinatura">
        <div>
          <span className="olho">{site.selo}</span>
          <h2 style={{ marginTop: 14 }}>
            O primeiro catálogo vem de <span className="realce">quem já vende</span>
          </h2>
          <p className="subtitulo" style={{ marginTop: 18 }}>
            O {site.nome} é a estrutura da parceria: recruta, seleciona, entrega o material e
            acompanha o parceiro. Os cursos que você vai divulgar são produzidos pelo{' '}
            {site.produtor}, um canal de conteúdo econômico com catálogo, alunos e operação
            comercial rodando há anos — você não está estreando um produto que ninguém comprou.
          </p>
          <p className="subtitulo" style={{ marginTop: 14 }}>
            A arquitetura foi desenhada para receber outros produtores de conteúdo educacional.
            Quem entra na primeira turma tem prioridade de acesso quando o catálogo abrir.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
            <a
              className="botao botao--secundario"
              href={site.canal.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conhecer o canal <Seta />
            </a>
            <a
              className="botao botao--fantasma"
              href={site.canal.site}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver os cursos
            </a>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="assinatura__logo"
          src="/duck-lockup.webp"
          alt={`${site.nome} — ${site.tagline}`}
          width={760}
          height={533}
          loading="lazy"
        />
      </div>
    </section>
  )
}
