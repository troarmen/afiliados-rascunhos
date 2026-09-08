import { redirect } from 'next/navigation'
import { CabecalhoAdmin } from '@/components/admin/CabecalhoAdmin'
import { StatusProdutor } from '@/components/admin/StatusProdutor'
import { estaAutenticado } from '@/lib/auth'
import { modoPersistencia } from '@/lib/store'
import { listarInteressesProdutor } from '@/lib/store-produtores'
import { STATUS_PRODUTOR_ROTULO } from '@/lib/schema'
import { dataCurta, normalizarUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ProdutoresAdmin() {
  if (!(await estaAutenticado())) redirect('/admin/entrar?voltar=/admin/produtores')
  const lista = await listarInteressesProdutor()
  const novos = lista.filter((p) => p.status === 'novo').length

  return (
    <div className="adm">
      <CabecalhoAdmin modo={modoPersistencia()} />
      <div className="adm__conteudo">
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)' }}>Produtores interessados</h1>
          <p className="campo__dica" style={{ maxWidth: '64ch' }}>
            Quem preencheu o formulário de <code>/para-produtores</code>: canais, escolas e criadores com
            curso que querem afiliados. {novos > 0 ? `${novos} ainda sem contato.` : 'Nenhum pendente.'}
          </p>
        </div>

        <div className="aviso aviso--info" style={{ maxWidth: '72ch' }}>
          <p>
            <strong>O que fazer aqui:</strong> ler o catálogo descrito, responder por e-mail em dias úteis e
            marcar o status. “Integrado” é quando o programa dele entra na estrutura — hoje isso ainda é
            manual (criar o programa no banco e publicar os materiais).
          </p>
        </div>

        <div className="tabela-caixa">
          {lista.length === 0 ? (
            <p className="adm__vazio">Nenhum produtor se cadastrou ainda.</p>
          ) : (
            <table className="adm-tabela">
              <thead>
                <tr>
                  <th>Produtor</th>
                  <th>Projeto</th>
                  <th>Plataforma</th>
                  <th>Catálogo e público</th>
                  <th>Status</th>
                  <th>Recebido</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <a href={`mailto:${p.email}`}>{p.nome}</a>
                      <p className="celula-secundaria">{p.email}{p.telefone ? ` · ${p.telefone}` : ''}</p>
                    </td>
                    <td>
                      {p.url ? <a href={normalizarUrl(p.url)} target="_blank" rel="noopener noreferrer">{p.projeto}</a> : p.projeto}
                    </td>
                    <td>{p.plataforma}</td>
                    <td style={{ maxWidth: 360 }}>
                      <p className="celula-secundaria" style={{ marginTop: 0, whiteSpace: 'pre-wrap' }}>{p.catalogo}</p>
                    </td>
                    <td>
                      <StatusProdutor id={p.id} status={p.status} />
                      <p className="celula-secundaria">{STATUS_PRODUTOR_ROTULO[p.status]}</p>
                    </td>
                    <td>{dataCurta(p.criadoEm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
