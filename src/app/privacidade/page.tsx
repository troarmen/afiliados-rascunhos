import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description:
    'Como tratamos os dados enviados no formulário de inscrição do Projeto Afiliado Rascunhos Econômicos.',
  alternates: { canonical: '/privacidade' },
}

export default function Privacidade() {
  return (
    <>
      <Topo />
      <main id="conteudo" className="secao">
        <div className="envelope">
          <nav className="migalhas" aria-label="Você está aqui">
            <Link href="/">Início</Link> <span aria-hidden="true">/</span>{' '}
            <span>Política de privacidade</span>
          </nav>

          <div className="prosa">
            <h1>Política de privacidade</h1>
            <p className="campo__dica">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}. Elaborada conforme a
              Lei nº 13.709/2018 (LGPD).
            </p>

            <h2>Quais dados coletamos</h2>
            <p>
              Apenas o que você preenche no formulário de inscrição: nome, e-mail, telefone, nome
              e link do canal, redes sociais informadas, área de atuação, faixa de audiência,
              formas de divulgação pretendidas, experiência anterior e sua motivação.
            </p>
            <p>
              Registramos também dados técnicos de origem do acesso (parâmetros UTM e página de
              referência) para entender quais canais de divulgação trazem candidatos.
            </p>

            <h2>Para que usamos</h2>
            <ul>
              <li>Avaliar sua candidatura ao programa de parceria.</li>
              <li>Entrar em contato sobre esta candidatura, por e-mail ou WhatsApp.</li>
              <li>
                Manter um banco de parceiros potenciais para campanhas futuras, quando não houver
                encaixe imediato.
              </li>
              <li>Medir a eficiência dos nossos canais de divulgação, de forma agregada.</li>
            </ul>
            <p>
              <strong>Base legal:</strong> consentimento (art. 7º, I) para o contato, e legítimo
              interesse (art. 7º, IX) para a análise e a melhoria do programa.
            </p>

            <h2>O que não fazemos</h2>
            <ul>
              <li>Não vendemos, alugamos ou cedemos seus dados a terceiros.</li>
              <li>Não usamos seus dados para disparo publicitário não relacionado ao programa.</li>
              <li>Não fazemos decisão automatizada de aprovação: a análise é humana.</li>
            </ul>

            <h2>Com quem compartilhamos</h2>
            <p>
              Somente com operadores necessários à execução do programa: provedor de hospedagem do
              site, banco de dados, serviço de envio de e-mail transacional e, no caso de parceiros
              aprovados, a Hotmart — responsável pelo cadastro de afiliado e pelo pagamento das
              comissões.
            </p>

            <h2>Por quanto tempo guardamos</h2>
            <p>
              Candidaturas não aprovadas ficam no banco de parceiros por até 24 meses e depois são
              eliminadas. Candidaturas aprovadas são mantidas enquanto durar a parceria e por até 5
              anos após o encerramento, para cumprimento de obrigações legais e fiscais.
            </p>

            <h2>Seus direitos</h2>
            <p>
              Você pode solicitar a qualquer momento confirmação do tratamento, acesso, correção,
              anonimização, portabilidade ou eliminação dos seus dados, além de revogar o
              consentimento. Basta escrever para{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a> — respondemos em até 15 dias.
            </p>

            <h2>Cookies</h2>
            <p>
              Usamos apenas cookies necessários ao funcionamento do site e, quando habilitado,
              o Google Analytics para medição agregada de audiência. Não usamos cookies de
              publicidade comportamental.
            </p>

            <div className="aviso aviso--info" style={{ marginTop: 22 }}>
              <p>
                <strong>Nota para a implantação:</strong> antes de publicar, inclua a razão social,
                o CNPJ e o encarregado de dados (DPO) da empresa responsável, e confirme os prazos
                de retenção com a área jurídica.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Rodape />
    </>
  )
}
