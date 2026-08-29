import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { comissao } from '@/lib/programa'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Termos de participação',
  description: 'Regras de participação no Projeto Afiliado Rascunhos Econômicos.',
  alternates: { canonical: '/termos' },
}

export default function Termos() {
  return (
    <>
      <Topo />
      <main id="conteudo" className="secao">
        <div className="envelope">
          <nav className="migalhas" aria-label="Você está aqui">
            <Link href="/">Início</Link> <span aria-hidden="true">/</span>{' '}
            <span>Termos de participação</span>
          </nav>

          <div className="prosa">
            <h1>Termos de participação</h1>
            <p className="campo__dica">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}. Documento de
              referência do programa — a relação comercial de afiliação é regida também pelos
              termos da Hotmart.
            </p>

            <h2>1. Objeto</h2>
            <p>
              Estes termos regem a participação de criadores de conteúdo no {site.nomeCompleto},
              programa de parceria mantido pelo {site.produtor} para divulgação de seus produtos
              educacionais.
            </p>

            <h2>2. Candidatura e aprovação</h2>
            <p>
              A inscrição pelo formulário deste site não gera direito de participação. As
              candidaturas passam por análise e podem ser recusadas a qualquer momento, sem
              obrigação de justificativa. A parceria só se inicia após aprovação expressa e
              habilitação do parceiro como afiliado na Hotmart.
            </p>

            <h2>3. Comissionamento</h2>
            <p>
              A comissão vigente é de {comissao.base}% a {comissao.teto}% sobre o valor da venda
              aprovada, conforme condição individualmente acordada e registrada na plataforma. O
              rastreio segue as regras da Hotmart: {comissao.cookieDias} dias de cookie, com
              atribuição por {comissao.atribuicao}.
            </p>
            <p>
              O cálculo, a retenção de impostos e o pagamento das comissões são executados
              integralmente pela Hotmart, nos prazos e condições da plataforma. Vendas canceladas,
              estornadas ou reembolsadas dentro do prazo de garantia geram estorno da comissão
              correspondente.
            </p>

            <h2>4. Regras de divulgação</h2>
            <ul>
              <li>
                O parceiro deve identificar de forma clara que a indicação é remunerada, conforme
                o Código de Defesa do Consumidor e as diretrizes do CONAR.
              </li>
              <li>
                É vedada a promessa de resultado financeiro, ganho garantido ou aprovação em
                qualquer processo seletivo em nome dos produtos.
              </li>
              <li>
                É vedado o uso de spam, disparo em massa não solicitado, automação de comentários,
                tráfego incentivado e compra de anúncio sobre a marca &ldquo;Rascunhos
                Econômicos&rdquo; sem autorização prévia por escrito.
              </li>
              <li>
                É vedada a criação de páginas, perfis ou materiais que se apresentem como oficiais
                do {site.produtor}.
              </li>
              <li>
                O material de divulgação fornecido é licenciado para uso exclusivo na promoção dos
                produtos do programa, enquanto durar a parceria.
              </li>
            </ul>

            <h2>5. Propriedade intelectual</h2>
            <p>
              Marca, identidade visual, artes, textos e vídeos disponibilizados permanecem de
              propriedade do {site.produtor}. O parceiro recebe licença de uso limitada, não
              exclusiva e revogável, restrita à finalidade do programa.
            </p>

            <h2>6. Vigência e encerramento</h2>
            <p>
              A parceria vigora por prazo indeterminado e pode ser encerrada por qualquer das
              partes, a qualquer tempo, sem multa. O descumprimento das regras do item 4 permite o
              descredenciamento imediato. Comissões de vendas já aprovadas e não estornadas
              continuam devidas pela Hotmart.
            </p>

            <h2>7. Alterações</h2>
            <p>
              As condições do programa — inclusive percentuais de comissão — podem ser revistas
              mediante comunicação prévia aos parceiros ativos. Alterações não retroagem sobre
              vendas já realizadas.
            </p>

            <h2>8. Contato</h2>
            <p>
              Dúvidas sobre estes termos: <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>

            <div className="aviso aviso--info" style={{ marginTop: 22 }}>
              <p>
                <strong>Nota para a implantação:</strong> este documento é uma minuta funcional.
                Antes de publicar, submeta à revisão jurídica e inclua a razão social e o CNPJ da
                empresa responsável pelo programa.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Rodape />
    </>
  )
}
