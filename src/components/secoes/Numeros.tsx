import { numeros } from '@/lib/programa'

/**
 * Faixa de prova logo abaixo do hero.
 *
 * Uma landing de plataforma normalmente põe aqui "+118 mil produtores" ou
 * "R$ X em vendas". O Duck Affiliate não tem histórico ainda, e inventar
 * número seria mentir para o candidato. Então a faixa carrega a REGRA do
 * programa — comissão, rastreio, custo e prazo de resposta —, que é
 * verificável e, para quem está decidindo se se inscreve, mais útil.
 */
export function Numeros() {
  return (
    <section className="numeros" aria-label="As regras do programa em números">
      {numeros.map((item) => (
        <div className="numeros__item" key={item.rotulo}>
          <span className="numeros__valor">{item.valor}</span>
          <span className="numeros__rotulo">{item.rotulo}</span>
        </div>
      ))}
    </section>
  )
}
