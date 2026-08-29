# Posicionamento e identidade

## O problema que o posicionamento precisa resolver

"Programa de afiliados" é uma expressão queimada no Brasil. Para o público que queremos —
professores, pesquisadores, criadores de conteúdo sério — ela evoca curso de renda extra,
promessa de ganho fácil e gente vendendo o que não usa.

Esse público não recusa dinheiro. Recusa **constrangimento**. O risco que ele calcula não é
financeiro, é reputacional: "o que meus seguidores vão pensar de mim se eu indicar isso?"

Todo o posicionamento decorre daí.

## Frase-âncora

> Sua audiência já *confia* em você. Falta o produto certo.

Ela funciona porque inverte a hierarquia usual. Não é o produtor fazendo um favor ao
criador; é o criador que já tem o ativo escasso — confiança — e a quem falta apenas o
produto. Isso põe os dois lados no mesmo nível, que é exatamente o modelo de parceria
descrito no documento de visão.

O itálico em "confia" não é enfeite: é a assinatura tipográfica da marca (ver abaixo).

## Os quatro compromissos do tom de voz

1. **Números antes de adjetivos.** "40% por venda, 30 dias de rastreio, D+30" comunica mais
   e mente menos que "as melhores comissões do mercado".
2. **Dizer o que não fazemos.** A seção "o que não tem encaixe aqui" na landing e o item de
   spam nos termos existem para filtrar. Um programa que aceita todo mundo não vale nada
   para quem é bom.
3. **Nada de escassez fabricada.** Sem contador regressivo, sem "últimas vagas", sem
   depoimento inventado. O público-alvo identifica esses recursos em dois segundos e o custo
   de ser pego é a credibilidade inteira.
4. **Prazo é promessa.** "Resposta em até 7 dias úteis" aparece em cinco lugares no site.
   Se a operação não cumprir, o dano é maior do que se nunca tivéssemos prometido — ver o
   playbook de operação.

---

## Identidade visual

A identidade **não foi inventada para este projeto**. Ela é herdada do
[rascunhoseconomicos.com](https://rascunhoseconomicos.com): os valores abaixo foram
extraídos das variáveis CSS do próprio site do canal (`/assets/site.css`), e não
aproximados a olho.

Isso importa porque o parceiro chega aqui vindo de um vídeo do canal. Se a página parecer
de outra empresa, ele hesita — e hesitação, num formulário de cinco minutos, é abandono.

### Paleta

| Papel | Token | Valor | Origem no site do canal |
|---|---|---|---|
| Fundo escuro (hero, faixas, rodapé) | `--tinta` | `#0a0e1a` | `--ink` / `--bg-dark` |
| Fundo mais fundo | `--breu` | `#060912` | `--bg-darker` |
| Fundo claro | `--papel` | `#f5f3ee` | `--bg-light` |
| Faixa alternada | `--creme` | `#ebe7dc` | `--bg-cream` |
| Dourado (marca) | `--ouro` | `#c8a45c` | `--accent` |
| Dourado escuro | `--ouro-forte` | `#9c7a3a` | `--accent-dark` |
| Dourado claro | `--ouro-suave` | `#e8d9b8` | `--accent-soft` |
| Texto secundário | `--tinta-2` | `#4a4e5a` | `--ink-muted` |

**Uma correção acessível em relação ao original:** `#c8a45c` sobre branco tem contraste de
cerca de 2,1:1 — abaixo do mínimo da WCAG para texto. No nosso sistema o dourado puro fica
reservado a fundo escuro, números grandes e ornamento; para texto e links sobre fundo claro
existe o token `--ouro-texto`, que resolve para `#9c7a3a` (≈4,6:1). Visualmente é o mesmo
dourado; legalmente e na prática, é legível.

### Tipografia

Mesma dupla do canal, carregada da mesma fonte (Google Fonts):

- **Fraunces** — títulos, números e nomes de cartão. Peso **500**, entrelinha 1.06,
  espacejamento negativo (−0.03em). Não use 600/700 em título: fica pesado demais e sai do
  padrão do canal.
- **Inter** — texto corrido, interface, botões (14px / 600).

### A assinatura: a expressão em itálico dourado

O gesto mais reconhecível do site do canal é uma expressão do título em **Fraunces itálico,
peso 400, na cor dourada**:

> Economia é *ciência*. E dá para entendê-la sem rótulo.
> Um projeto de divulgação científica — não um canal *de opinião*.

Replicamos isso na classe `.realce`, e a regra de uso é: **uma expressão por título, nunca
duas**. É o que a mantém eficaz. Se todo título tiver duas palavras douradas, nenhuma
chama atenção.

### Outros elementos herdados

| Elemento | Tratamento |
|---|---|
| Brasão | Arquivo oficial (`public/logo.svg`), sempre sobre placa clara de 38px com raio 10px — o traçado é escuro e some no navy |
| Olho de seção | 12px, 600, versalete, `letter-spacing: .18em`, dourado |
| Botão primário | Fundo dourado, texto navy, raio 100px |
| Cartões | Raio 14–16px, borda de 1px, sem sombra pesada |
| Hero | Navy + brilho dourado radial deslocado à direita + malha quadriculada de 60px a 2% de opacidade |
| Faixa deslizante | Termos em Fraunces separados por `✦` dourado, sobre o fundo mais escuro |

Duas coisas foram **acrescentadas**, não copiadas, porque o site do canal não tem
equivalente: o painel de números do hero (a oferta precisa ser lida em três segundos) e os
ordinais `— 01` em Fraunces itálico dourado nas etapas. O ordinal só aparece onde a ordem é
informação de verdade; nos benefícios, que não são sequência, não há numeração.

### Modo escuro

O site do canal é claro com faixas navy. Nosso sistema faz o mesmo por padrão e ainda
responde a `prefers-color-scheme: dark`, quando a página inteira assume o navy e as faixas
escuras descem para `--breu` — a alternância entre seções continua legível nos dois temas.

A troca é feita só por tokens (`.escuro` e os blocos de tema em `globals.css`), então nenhum
componente sabe em que tema está.

---

## Nome

O documento de visão usa a sigla **PARE** (Projeto Afiliado Rascunhos Econômicos). No site,
a marca visível é **"Projeto Afiliado"**, com "Rascunhos Econômicos" na pílula ao lado —
espelhando o lockup do canal, onde "Rascunhos" aparece em Fraunces e "ECONÔMICOS" numa
pílula contornada.

Dois motivos: "PARE" como imperativo tem carga negativa em português, e um nome que não
contém o produtor sobrevive melhor à expansão para outros produtores — que é a visão de
longo prazo do documento. A sigla continua no `<meta>` e nos dados estruturados, para quem
buscar por ela.
