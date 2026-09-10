# Comunidade de parceiros e biblioteca de materiais

O documento de visão é claro: o afiliado aprovado "não receberá apenas um link". A
comunidade é o que transforma afiliado em parceiro — e é também o que diferencia este
programa de qualquer link da Hotmart.

## Como o convite chega ao parceiro (no código)

A plataforma escolhida aqui é uma **decisão operacional**; o site só precisa da URL do
convite, em `NEXT_PUBLIC_COMUNIDADE_URL` (e do nome dela em
`NEXT_PUBLIC_COMUNIDADE_PLATAFORMA`, que por padrão é `Discord`).

Com a variável preenchida, o convite aparece em três pontos:

| Onde | Quando o parceiro vê |
|---|---|
| E-mail de aprovação (`boasVindasParceiro`) | No momento exato do fluxo: "entrada na comunidade" |
| Cartão na área do parceiro (`/parceiro#comunidade`) | Toda vez que entra |
| Menu da área do parceiro | Sempre à mão |

**Vazia, os três somem.** É deliberado: o site promete a comunidade em três lugares
públicos — etapa 5 de "como funciona", benefícios e comparativo — e um link morto na
semana da aprovação custa mais credibilidade do que a ausência do convite.

Use um convite **permanente**. O convite padrão do Discord expira em 7 dias, e ninguém
vai perceber que quebrou até um parceiro reclamar.

## Escolha da plataforma

**Recomendação: Discord.**

| Plataforma | A favor | Contra |
|---|---|---|
| **Discord** | Canais por tema, histórico pesquisável, permissões por cargo, arquivos organizados | Curva de entrada para quem não usa |
| WhatsApp | Todo mundo já tem, notificação certa | Vira ruído em uma semana, histórico impossível de buscar, sem organização |
| Telegram | Bom para arquivo, canal + grupo | Menos estrutura de permissão |

O público-alvo — criadores de conteúdo educacional — já usa Discord em peso. E a
característica que mais importa aqui é **histórico pesquisável**: o parceiro que entra no
mês seis precisa achar sozinho a arte da campanha do mês dois.

Use WhatsApp para o contato individual, não para a comunidade.

## Estrutura de canais

```
📢 AVISOS
├── #comunicados          somente leitura — mudanças de comissão, novos produtos
├── #calendario           campanhas, datas de desconto, lançamentos
└── #resultados           números agregados do programa (transparência gera confiança)

📦 MATERIAIS
├── #artes-e-thumbnails
├── #textos-e-roteiros
├── #videos-e-cortes
├── #cupons               cupom de cada parceiro, listado
└── #identidade-visual    logo, cores, o que pode e o que não pode

💬 COMUNIDADE
├── #apresentacoes        entrada obrigatória: quem é, canal, área
├── #geral
├── #o-que-funcionou      ⭐ o canal mais valioso: formatos e números reais
└── #duvidas

🛠 SUPORTE
├── #hotmart-e-pagamento
└── #sugestoes            o que falta de material
```

O canal `#o-que-funcionou` é o motivo pelo qual a comunidade existe. Um parceiro contando
que a menção no minuto 8 converteu melhor que o vídeo dedicado vale mais para os outros do
que qualquer material que a gente produza. Peça esse relato ativamente.

### Cargos

| Cargo | Quem | Acesso |
|---|---|---|
| `@equipe` | Rascunhos Econômicos | Tudo |
| `@parceiro` | Aprovados | Tudo, menos avisos (só leitura) |
| `@parceiro-ativo` | Publicou nos últimos 90 dias | + canal de campanhas exclusivas |

`@parceiro-ativo` é reconhecimento, não punição — e cria um incentivo concreto sem
transformar a comunidade em cobrança.

## Biblioteca de materiais

> **Mudou em setembro/2026.** A biblioteca deixou de morar no Google Drive e passou a ser
> parte do site: o parceiro aprovado entra em `/parceiro`, filtra por tipo, campanha e
> formato, e baixa ou copia — com o link dele já dentro dos textos (ver README, "Link de
> vendas e material individualizado"). O Discord aponta para a área do parceiro, não mais
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
