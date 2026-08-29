import Link from 'next/link'
import { rodape, site } from '@/lib/site'
import { Brasao } from './Marca'

export function Rodape() {
  const ano = new Date().getFullYear()

  return (
    <footer className="rodape">
      <div className="envelope">
        <div className="rodape__grade">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
              <Brasao tamanho={36} />
              <span
                style={{
                  fontFamily: 'var(--fonte-titulo)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                }}
              >
                Projeto Afiliado
              </span>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'rgba(255,255,255,.55)',
                maxWidth: '32ch',
                lineHeight: 1.65,
              }}
            >
              Uma rede de criadores de conteúdo educacional distribuindo cursos em que
              acreditam. Primeiro caso: {site.produtor}.
            </p>
          </div>

          <div>
            <p className="rodape__titulo">Programa</p>
            <ul className="rodape__lista">
              {rodape.institucional.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.rotulo}</Link>
                </li>
              ))}
              <li>
                <Link href="/#inscricao">Quero me inscrever</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="rodape__titulo">{site.produtor}</p>
            <ul className="rodape__lista">
              <li>
                <a href={site.canal.site} target="_blank" rel="noopener noreferrer">
                  Site oficial
                </a>
              </li>
              <li>
                <a href={site.canal.youtube} target="_blank" rel="noopener noreferrer">
                  Canal no YouTube
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="rodape__titulo">Legal</p>
            <ul className="rodape__lista">
              {rodape.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.rotulo}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rodape__fim">
          <p>
            © {ano} {site.produtor} · {site.rede}
          </p>
          <p>
            Vendas e comissões processadas pela Hotmart. Este site não vende produtos nem
            processa pagamentos.
          </p>
        </div>
      </div>
    </footer>
  )
}
