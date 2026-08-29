import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Inscrição recebida',
  description: 'Recebemos sua candidatura ao Projeto Afiliado Rascunhos Econômicos.',
  robots: { index: false, follow: false },
}

export default function Obrigado() {
  return (
    <>
      <Topo />
      <main id="conteudo" className="secao">
        <div className="envelope" style={{ maxWidth: 720 }}>
          <span className="olho">Inscrição recebida</span>
          <h1 style={{ marginTop: 14 }}>Deu certo. Agora é com a gente.</h1>
          <p className="subtitulo" style={{ marginTop: 18 }}>
            Sua candidatura entrou na fila de análise e você deve ter recebido um e-mail de
            confirmação. Se não aparecer em alguns minutos, dá uma olhada na caixa de promoções
            ou no spam.
          </p>

          <div className="cartao" style={{ marginTop: 32 }}>
            <h3>O que acontece agora</h3>
            <ol className="lista-marcada" style={{ marginTop: 8 }}>
              <li>
                <span>
                  <strong>Análise em até 7 dias úteis.</strong> Olhamos seu conteúdo, o perfil da
                  audiência e o encaixe com os cursos.
                </span>
              </li>
              <li>
                <span>
                  <strong>Retorno por e-mail.</strong> Aprovado ou não, você recebe resposta.
                </span>
              </li>
              <li>
                <span>
                  <strong>Conversa rápida.</strong> Havendo encaixe, marcamos 30 minutos para
                  alinhar formato e condições.
                </span>
              </li>
            </ol>
          </div>

          <div className="cartao" style={{ marginTop: 18, background: 'var(--superficie-2)' }}>
            <h3>Quer adiantar a análise?</h3>
            <p>
              Responda o e-mail de confirmação contando qual conteúdo seu costuma performar melhor
              e mandando um link desse material. Ajuda bastante — e coloca sua candidatura na
              frente.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
            <a
              className="botao"
              href={site.canal.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conhecer o canal
            </a>
            <Link className="botao botao--secundario" href="/">
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>
      <Rodape />
    </>
  )
}
