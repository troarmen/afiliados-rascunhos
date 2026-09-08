import Link from 'next/link'
import { rodape, site } from '@/lib/site'
import { Emblema, Wordmark } from './Marca'

/**
 * Rodapé como mapa do site: uma coluna por público (afiliado, produtor),
 * uma para acesso e uma legal. Quem chega ao fim da página sem achar o que
 * queria encontra aqui, sem precisar voltar ao topo.
 */
export function Rodape() {
  const ano = new Date().getFullYear()
  const coluna = (titulo: string, itens: readonly { href: string; rotulo: string }[]) => (
    <div>
      <p className="rodape__titulo">{titulo}</p>
      <ul className="rodape__lista">
        {itens.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.rotulo}</Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <footer className="rodape">
      <div className="envelope">
        <div className="rodape__grade rodape__grade--5">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
              <Emblema tamanho={38} />
              <Wordmark />
            </div>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,.55)', maxWidth: '30ch', lineHeight: 1.65 }}>
              {site.tagline}. Criadores educacionais do YouTube distribuindo cursos em que
              acreditam.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.45)', marginTop: 14 }}>
              <a href={`mailto:${site.email}`} style={{ color: 'inherit' }}>{site.email}</a>
            </p>
          </div>

          {coluna('Para afiliados', rodape.afiliados)}
          {coluna('Para produtores', rodape.produtores)}
          {coluna('Acesso', rodape.acesso)}

          <div>
            <p className="rodape__titulo">Catálogo e legal</p>
            <ul className="rodape__lista">
              <li>
                <a href={site.canal.site} target="_blank" rel="noopener noreferrer">{site.produtor}</a>
              </li>
              <li>
                <a href={site.canal.youtube} target="_blank" rel="noopener noreferrer">Canal no YouTube</a>
              </li>
              {rodape.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.rotulo}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rodape__fim">
          <p>© {ano} {site.nome} · {site.selo}</p>
          <p>Vendas e comissões processadas pela Hotmart. Este site não vende produtos nem processa pagamentos.</p>
        </div>
      </div>
    </footer>
  )
}
