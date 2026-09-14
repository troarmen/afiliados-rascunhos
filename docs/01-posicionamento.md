# Posicionamento e identidade

## O problema que o posicionamento precisa resolver

"Programa de afiliados" é uma expressão queimada no Brasil. Para o público que queremos —
professores, pesquisadores, criadores de conteúdo sério — ela evoca curso de renda extra,
promessa de ganho fácil e gente vendendo o que não usa.

Esse público não recusa dinheiro. Recusa **constrangimento**. O risco que ele calcula não é
financeiro, é reputacional: "o que meus inscritos vão pensar de mim se eu indicar isso?"

Todo o posicionamento decorre daí.

## O nicho: YouTube educacional

O programa fala com **quem tem canal no YouTube e ensina alguma coisa**. Não é um recorte
cosmético — ele muda o produto:

- o kit de divulgação é feito para **vídeo longo e corte**: thumbnail, corte editado,
  roteiro de menção de 40 segundos, texto de descrição e comentário fixado;
- a análise de candidatura olha **comentário e retenção**, não número de inscritos;
- a copy fala em "canal", "inscritos" e "vídeo", não em "seguidores" e "perfil".

Criadores de Instagram, TikTok, podcast, newsletter e comunidade fechada **continuam sendo
aceitos**. O foco é uma escolha de comunicação e de material, não uma cerca. O aviso em
`#quem-pode` diz isso explicitamente, e o formulário pergunta qual é o canal principal.

Um programa que fala com todo mundo não fala com ninguém; um programa que fecha a porta
perde bom candidato. O meio-termo é: mirar no YouTube, aceitar quem chegar de outro lugar.

## Frase-âncora

> Seu canal já ensina. Agora ele também *paga*.

Ela funciona porque parte de algo que o criador já sabe ser verdade (o canal ensina) e
acrescenta a única parte que falta (pagar), sem prometer valor, prazo nem transformação.
Não há verbo no imperativo, não há "ganhe", não há cifra.

O realce em "paga" não é enfeite: é a assinatura tipográfica da marca (ver abaixo).

## Os quatro compromissos do tom de voz

1. **Números antes de adjetivos.** "10% a 40% por venda, 30 dias de rastreio, D+30" comunica mais
   e mente menos que "as melhores comissões do mercado".
2. **Dizer o que não fazemos.** A seção "o que não tem encaixe aqui" na landing e o item de
   spam nos termos existem para filtrar. Um programa que aceita todo mundo não vale nada
   para quem é bom.
3. **Nada de escassez fabricada.** Sem contador regressivo, sem "últimas vagas", sem
   depoimento inventado. O público-alvo identifica esses recursos em dois segundos e o custo
   de ser pego é a credibilidade inteira.
4. **Prazo é promessa.** "Resposta em até 7 dias úteis" aparece em vários lugares no site.
   Se a operação não cumprir, o dano é maior do que se nunca tivéssemos prometido — ver o
   playbook de operação.

## A regra que governa toda a copy: nada de dado inventado

O programa **não tem histórico**. Não houve turma anterior, não há parceiro ativo, não há
volume de vendas. Por isso o site não traz — e não pode passar a trazer sem que o número
exista de verdade:

- depoimento de parceiro;
- contagem de afiliados, de vendas ou de faturamento;
- "já recusamos X" ou "já aprovamos Y";
- métrica de mercado sem fonte.

No lugar disso, a faixa de prova sob o hero (`Numeros`) carrega a **regra** do programa —
comissão, rastreio, custo, prazo de resposta. É verificável, e para quem está decidindo se
se inscreve é mais útil que prova social genérica.

O comparativo (`#comparativo`) descreve o **padrão de mercado** na coluna da direita, nunca
um concorrente nomeado: não temos como auditar o programa alheio. Cada linha da coluna
esquerda é regra nossa e está escrita nos termos.

---

## Identidade visual

O Duck Affiliate é **marca própria**. A identidade sai do logo oficial — pato de óculos
escuros sobre navy, wordmark bicolor, seta ascendente — e **não** da paleta do Rascunhos
Econômicos.

Isso é uma inversão deliberada em relação à primeira versão do projeto, que herdava creme e
dourado do canal. O motivo: o documento de visão pede que o site seja "um ativo digital
independente", capaz de receber outros produtores depois. Uma marca que veste a roupa de um
produtor específico não sobrevive à chegada do segundo.

O que preserva a confiança de quem chega vindo de um vídeo do canal não é a paleta, é a
**assinatura**: *Powered by Rascunhos Econômicos* aparece no rodapé, no cartão social e
numa seção própria da home (`#catalogo`) que explica a relação em duas frases. Saiu do
cabeçalho em setembro/2026, por decisão do cliente: no topo, a marca é o Duck Affiliate.

### Paleta

Amostrada pixel a pixel do PNG do logo, com um script que contou as famílias de cor da
imagem. Não é aproximação de olho.

| Papel | Token | Valor | Origem |
|---|---|---|---|
| Fundo escuro (hero, faixas, cabeçalho) | `--navy` | `#000E29` | Fundo do logo |
| Fundo mais fundo | `--abissal` | `#00081C` | Derivado |
| Fundo claro | `--papel` | `#F4F6FB` | Neutro azulado |
| Faixa alternada | `--gelo` | `#E9EEF8` | Derivado |
| Âmbar (marca) | `--ambar` | `#FFC20E` | Pato, aro e seta |
| Âmbar claro | `--ambar-claro` | `#FFD84D` | Luz do pato |
| Âmbar para texto | `--ambar-texto` | `#8A5A00` | Derivado acessível |
| Azul de apoio | `--royal` | `#1B4CB8` | Jaqueta e óculos |
| Texto secundário | `--tinta-2` | `#47526B` | Derivado |

**A correção acessível:** `#FFC20E` sobre branco dá **1,62:1** — muito abaixo do mínimo da
WCAG para texto. No sistema, o âmbar puro fica reservado a fundo escuro, botão, números
grandes e ornamento; para texto e link sobre fundo claro existe `--ambar-texto`, com
**5,48:1** sobre `--papel`. Visualmente lê como o mesmo âmbar; na prática, é legível.

Pares conferidos e aprovados: âmbar/navy 11,85:1 · branco/navy 19,18:1 · navy/papel 17,74:1
· navy sobre botão âmbar 11,85:1 · royal/branco 7,57:1.

### Tipografia

- **Figtree** — títulos, números e nomes de cartão. Peso **800**, entrelinha 1.04,
  espacejamento −0.035em. É a geométrica pesada de licença aberta mais próxima do wordmark
  do logo. Não use peso 500 em título: perde o gesto da marca.
- **Inter** — texto corrido, interface, botões (14px / 700 no primário).

A serifa Fraunces saiu do projeto. Ela é a voz do Rascunhos Econômicos e, mantida aqui,
apagaria justamente a distinção que o rebrand existe para criar.

### A assinatura: a expressão riscada em âmbar

O gesto mais reconhecível do logo é a **seta amarela que passa por baixo do pato**.
Replicamos isso na classe `.realce`: a expressão de destaque fica em âmbar com um traço
arredondado sob a linha de base.

> Seu canal já ensina. Agora ele também *paga*.
> Você não recebe *só um link*.

A regra de uso é: **uma expressão por título, nunca duas**. É o que a mantém eficaz.

O traço é um `::after` posicionado, não um `text-decoration`, porque precisa de folga em
relação à linha de base e não pode cortar letra descendente na quebra de linha.

### Outros elementos

| Elemento | Tratamento |
|---|---|
| Emblema | `public/duck-emblema-192.webp`, sobre placa navy de 40px com raio 13px e aro âmbar a 35% |
| Wordmark | Texto, não imagem: `<b>Duck</b>Affiliate`, âmbar + branco, Figtree 800 |
| Olho de seção | 12px, 700, versalete, `letter-spacing: .18em`, âmbar-texto |
| Botão primário | Fundo âmbar, texto navy, peso 700, raio 100px, sombra âmbar no hover |
| Cartões | Raio 16–22px, borda de 1px, sombra leve |
| Hero | Navy + brilho âmbar radial deslocado à direita + malha quadriculada de 60px a 2% |
| Pilares | Numeral gigante em âmbar a 16% de opacidade, fora do fluxo e do leitor de tela |

**Por que o emblema não tem fundo transparente:** o aro amarelo do círculo é interrompido
pela cabeça do pato e pela seta, então o preenchimento a partir das bordas vaza para dentro
do desenho e come a jaqueta. Ele é exportado sobre o navy do próprio logo, e a placa em CSS
usa exatamente essa cor — a emenda desaparece sobre qualquer fundo de página.

### Blocos acrescentados no reposicionamento

Quatro seções não existiam na primeira versão e nasceram das referências de plataforma de
afiliação (Eduzz, Guru):

| Seção | Pergunta que responde |
|---|---|
| `Numeros` | "isso é sério?" — a regra do programa em quatro números |
| `Pilares` | "quem faz o quê?" — você divulga, o link rastreia, a Hotmart paga |
| `Portal` | "o que eu ganho além do link?" — o inventário do que chega na aprovação |
| `Comparativo` | "por que aqui e não em outro?" — nós contra o padrão de mercado |

### Modo escuro

O site é claro com faixas navy por padrão e responde a `prefers-color-scheme: dark`, quando
a página inteira assume o navy e as faixas escuras descem para `--abissal` — a alternância
entre seções continua legível nos dois temas.

A troca é feita só por tokens (`.escuro` e os blocos de tema em `globals.css`), então nenhum
componente sabe em que tema está.

---

## Nome

**Duck Affiliate**, com a tagline *"Afiliados que transformam conteúdo em renda"*.

O nome não contém o produtor, e é isso que o faz sobreviver à expansão para outros
produtores de conteúdo educacional — a visão de longo prazo do documento original. A sigla
PARE foi aposentada: como imperativo, tem carga negativa em português.

No lockup, "Duck" vai em âmbar e "Affiliate" em branco, como no logo. Em telas abaixo de
1220px a pílula *Powered by Rascunhos Econômicos* sai do cabeçalho por falta de espaço —
ela é assinatura, não navegação, e continua presente no rodapé e na seção `#catalogo`.
