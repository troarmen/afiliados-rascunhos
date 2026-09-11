# Comunidade de parceiros e biblioteca de materiais

O documento de visão é claro: o afiliado aprovado "não receberá apenas um link". A
comunidade é o que transforma afiliado em parceiro — e é também o que diferencia este
programa de qualquer link da Hotmart.

## Como o convite chega ao parceiro (no código)

A plataforma escolhida aqui é uma **decisão operacional**; o site só precisa da URL do
convite, em `NEXT_PUBLIC_COMUNIDADE_URL` (e do nome dela em
`NEXT_PUBLIC_COMUNIDADE_PLATAFORMA`, que por padrão é `Telegram`).

Com a variável preenchida, o convite aparece em três pontos:

| Onde | Quando o parceiro vê |
|---|---|
| E-mail de aprovação (`boasVindasParceiro`) | No momento exato do fluxo: "entrada na comunidade" |
| Cartão na área do parceiro (`/parceiro#comunidade`) | Toda vez que entra |
| Menu da área do parceiro | Sempre à mão |

**Vazia, os três somem.** É deliberado: o site promete a comunidade em três lugares
públicos — etapa 5 de "como funciona", benefícios e comparativo — e um link morto na
semana da aprovação custa mais credibilidade do que a ausência do convite.

Use um link que **não expire**. No Telegram, o link principal do grupo (`t.me/+…`) e o
`@usuario` público de um canal valem para sempre; links criados com limite de tempo ou de
usos, não — e ninguém vai perceber que quebrou até um parceiro reclamar.

## Escolha da plataforma

**Decisão do cliente (setembro/2026): Telegram.** Substitui a recomendação anterior de
Discord, que fica registrada abaixo só para não se rediscutir a mesma coisa em três meses.

| Plataforma | A favor | Contra |
|---|---|---|
| **Telegram** | Todo mundo já tem, entrada sem fricção no celular, canal de avisos separado do grupo de conversa, histórico pesquisável, arquivo grande | Sem permissão por tópico: aviso só fica protegido em canal à parte |
| Discord | Canais por tema, permissões por cargo, arquivos organizados | Curva de entrada para quem não usa |
| WhatsApp | Todo mundo já tem, notificação certa | Vira ruído em uma semana, histórico impossível de buscar, sem organização |

### Canal, grupo e Comunidade

São três objetos diferentes, e a escolha errada custa uma remontagem:

| Objeto | O que é | Vários chats? |
|---|---|---|
| **Canal** | Mão única: a equipe publica, todo mundo lê. Sem conversa | Não |
| **Grupo** | Conversa. Com **Tópicos** ligados, cada tema ganha histórico próprio | Sim, via Tópicos |
| **Comunidade** | Guarda-chuva que reúne vários chats num lugar só (recurso novo, 2026) | É a junção, não o chat |

A Comunidade **não substitui** o canal nem o grupo: ela agrupa o que já existe e, hoje,
não tem link de convite próprio — por isso não serve como porta de entrada. Quem sustenta
a operação são o canal e o grupo.

### O que o Telegram não faz: permissão por tópico

**Todo mundo escreve em todos os tópicos.** Não existe tópico só-leitura, e não existe
permissão por tópico — é pedido antigo da comunidade, ainda não atendido. Os dois únicos
controles são:

- **Fechar tópico** — membro para de escrever ali (a equipe continua publicando). Serve
  para o `Comece aqui`, que precisa ficar limpo.
- **Permissões do grupo** — valem para o grupo **inteiro**, não por tópico.

Daí a arquitetura, e este é o motivo de existirem dois objetos em vez de um: **aviso não
pode ser um tópico**. Comunicado de mudança de comissão dentro de um tópico aberto vira
conversa em dez minutos e o parceiro que entrar amanhã não acha mais. Quem garante
"só a equipe publica" é o *canal* — o grupo não tem como garantir isso tópico a tópico.

### O arranjo — decidido, setembro/2026

**Canal de avisos + grupo com tópicos, vinculados. A Comunidade fica de fora.**

1. **Canal** `Duck Affiliate` — comunicados, calendário e resultados. É o link que vai em
   `NEXT_PUBLIC_COMUNIDADE_URL` e, portanto, no e-mail de aprovação.
2. **Grupo com Tópicos** — a troca.
3. **Vinculados** em *Editar canal → Discussão*: cada post do canal ganha botão de
   comentário que leva ao grupo, e quem comenta entra no grupo.
4. **Post fixado no canal** com o link do grupo e o link de `/parceiro`. É o mapa, e é o que
   torna o resto dispensável.

A **Comunidade não entra**: não tem link de convite próprio, então não serve de porta, e é
recurso novo demais para a operação depender dele. Se um dia ganhar link, ela vira uma
troca de variável — nada além disso.

Use WhatsApp para o contato individual, não para a comunidade.

## Estrutura

**Canal `Duck Affiliate — Avisos`** (somente leitura, a equipe escreve)

```
comunicados     mudanças de comissão, novos produtos
calendário      campanhas, datas de desconto, lançamentos
resultados      números agregados do programa (transparência gera confiança)
```

São três tipos de post no mesmo canal, não três canais: o volume não justifica separar, e
a busca do Telegram acha pelo texto. Fixe o post do calendário do mês.

**Grupo `Duck Affiliate — Parceiros`** (vinculado ao canal, com Tópicos ativados)

```
📌 Comece aqui        regras da casa + link da área do parceiro (tópico FECHADO)
💬 Geral
⭐ O que funcionou     o tópico mais valioso: formatos e números reais
❓ Dúvidas
🎨 Materiais           avisos de material novo — o arquivo mora em /parceiro
💰 Hotmart e pagamento
🛠 Sugestões           o que falta de material
```

O tópico `O que funcionou` é o motivo pelo qual a comunidade existe. Um parceiro contando
que a menção no minuto 8 converteu melhor que o vídeo dedicado vale mais para os outros do
que qualquer material que a gente produza. Peça esse relato ativamente.

`Materiais` é só o aviso: o arquivo em si nunca circula solto no grupo, porque o texto
precisa sair da biblioteca com o `{{link}}` já trocado pelo link daquele parceiro (ver
abaixo). Material colado no grupo é venda atribuída à pessoa errada.

### Quem é o quê

O Telegram só tem dois níveis — administrador e membro —, então o controle fino que o
Discord daria por cargo aqui vira convite:

| Quem | Como |
|---|---|
| Equipe | Administradores do canal e do grupo |
| Parceiro aprovado | Membro, entra pelo link do e-mail de aprovação |
| Parceiro ativo (publicou nos últimos 90 dias) | Grupo à parte, para campanhas exclusivas, com convite da equipe |

O grupo de parceiro ativo é reconhecimento, não punição — e cria um incentivo concreto sem
transformar a comunidade em cobrança. Ele só faz sentido quando houver gente suficiente
para os dois grupos não serem o mesmo; antes disso, deixe só o principal.

## Biblioteca de materiais

> **Mudou em setembro/2026.** A biblioteca deixou de morar no Google Drive e passou a ser
> parte do site: o parceiro aprovado entra em `/parceiro`, filtra por tipo, campanha e
> formato, e baixa ou copia — com o link dele já dentro dos textos (ver README, "Link de
> vendas e material individualizado"). O Telegram aponta para a área do parceiro, não mais
> para uma pasta.
>
> A estrutura de pastas abaixo continua valendo como **lista do que produzir**: cada pasta
> daqui vira um *tipo* (imagem, vídeo, copy, cupom…) ou uma *campanha* na biblioteca.

### Quem escreve copy: use `{{link}}`

Em material de texto (roteiro, descrição de vídeo, e-mail), escreva `{{link}}` onde o link
de venda deve entrar. Cada parceiro copia o texto com o **link dele**, etiquetado com aquele
material — é o que faz o relatório da Hotmart mostrar qual peça vendeu. Nunca cole um link
fixo no texto: ele atribuiria a venda a outra pessoa.

### Estrutura (referência do que produzir)

```
Duck Affiliate/
├── 00 — Comece aqui/
│   ├── Guia do parceiro.pdf
│   ├── Boas práticas de divulgação.pdf
│   └── Perguntas frequentes dos alunos.pdf
├── 01 — Identidade visual/
│   ├── Logos (SVG, PNG fundo claro e escuro)
│   ├── Paleta e tipografia.pdf
│   └── O que pode e o que não pode.pdf
├── 02 — Artes/
│   ├── Stories (1080x1920)
│   ├── Feed (1080x1350)
│   ├── Thumbnails YouTube (1280x720)
│   └── Banner para descrição
├── 03 — Vídeos/
│   ├── Cortes de 15s, 30s e 60s
│   ├── Depoimentos de alunos
│   └── Vídeo institucional do curso
├── 04 — Textos/
│   ├── Roteiro de menção (30s, 60s, 2min)
│   ├── Texto para descrição do vídeo
│   ├── Texto para newsletter
│   └── Respostas para as objeções mais comuns
└── 05 — Campanhas/
    └── {ano}-{mês} — {nome da campanha}/
```

### Mínimo viável para abrir a primeira turma

Não espere a biblioteca completa. Para receber os primeiros dez parceiros, basta:

- [ ] Guia do parceiro (3 páginas: como funciona, o que pode, quem procurar)
- [ ] Logo em SVG e PNG
- [ ] Três thumbnails e três artes de stories
- [ ] Um roteiro de menção de 60 segundos
- [ ] Um texto para descrição de vídeo
- [ ] Um corte de vídeo de 30 segundos

O resto se constrói a partir do que os parceiros pedirem em `#sugestoes` — e assim você
produz o que é usado, em vez de adivinhar.

## Ritual mensal

Uma chamada aberta de 45 minutos, por mês, gravada e postada em `#resultados`:

1. Números do programa (agregados, sem expor parceiro individual)
2. O que vem no próximo mês (campanhas, material novo, produto novo)
3. Um parceiro conta o que funcionou para ele
4. Perguntas abertas

É barato, é o que mais gera pertencimento e resolve de uma vez as dúvidas que voltariam
por WhatsApp durante o mês inteiro.

## Cupons

Um cupom por parceiro, com o nome do canal, e desconto real (sugestão: 10% a 15%).

O cupom é criado **pelo produtor, dentro da Hotmart** — o site não gera cupom. Criado lá,
ele é publicado como material do tipo "cupom" na biblioteca do parceiro, que copia com um
clique. O QR code e a etiqueta de origem cobrem o outro caminho: quem chega pelo link.

O cupom faz três coisas ao mesmo tempo: dá algo concreto para a audiência ganhar por seguir
aquele criador, rastreia venda mesmo quando a pessoa não passa pelo link, e cria uma
métrica limpa por parceiro do lado da Hotmart.
