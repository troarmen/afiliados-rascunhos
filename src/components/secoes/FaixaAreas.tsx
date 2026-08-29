import { areas } from '@/lib/programa'

/**
 * Faixa deslizante de áreas do conhecimento, no mesmo gesto da faixa de temas
 * do site do canal ("Inflação ✦ Juros ✦ Câmbio…").
 *
 * Aqui ela carrega informação real: são exatamente as áreas que o programa
 * aceita. A lista é duplicada porque a animação desloca -50% e volta ao início
 * sem emenda visível; a cópia é escondida de leitores de tela.
 */
export function FaixaAreas() {
  const nomes = areas.filter((a) => a.slug !== 'outra').map((a) => a.nome.split(' (')[0])

  const trilho = (duplicada: boolean) =>
    nomes.map((nome) => (
      <span key={`${nome}-${duplicada}`} style={{ display: 'contents' }}>
        <span className="faixa__item">{nome}</span>
        <span className="faixa__estrela" aria-hidden="true">
          ✦
        </span>
      </span>
    ))

  return (
    <div className="faixa">
      <div className="faixa__trilho">
        {trilho(false)}
        <span aria-hidden="true" style={{ display: 'contents' }}>
          {trilho(true)}
        </span>
      </div>
    </div>
  )
}
