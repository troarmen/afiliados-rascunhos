# Duck Affiliate

**Afiliados que transformam conteúdo em renda.**

Programa de afiliados para canais educacionais do **YouTube**. Central de apresentação,
recrutamento e triagem de parceiros criadores de conteúdo.

Não é uma landing page com um Google Forms embutido: é uma aplicação Next.js com
formulário próprio, banco de candidatos, triagem automática de prioridade e painel
administrativo. A operação financeira (venda, rastreio e comissão) continua na Hotmart,
como previsto no documento de visão — o que muda é que o **cadastro e o funil de
seleção passam a ser um ativo nosso**, não de um formulário do Google.

## Marca própria, catálogo do parceiro

O Duck Affiliate é **marca independente**: nome, identidade visual, domínio e posicionamento
são dele. O **Rascunhos Econômicos** é o produtor do primeiro catálogo de cursos oferecido
dentro do programa — daí a assinatura *Powered by Rascunhos Econômicos*, que aparece no
rodapé, no cartão social e numa seção própria da home (`#catalogo`). **No cabeçalho ela não
aparece**: o topo é a marca Duck Affiliate, e só.

A separação é proposital e está no documento de visão: a arquitetura precisa receber outros
produtores de conteúdo educacional depois, sem que o site tenha de ser reescrito.

### Nicho: YouTube-first

Toda a copy fala com quem tem canal no YouTube, e o kit de divulgação é feito para vídeo
longo e corte. Criadores de Instagram, TikTok, podcast, newsletter e comunidade fechada
**continuam sendo aceitos** — o formulário pergunta qual é o canal principal, e o aviso em
`#quem-pode` diz isso com todas as letras.

---

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # opcional para o primeiro run
npm run dev                  # http://localhost:3000
```

Sem nenhuma variável de ambiente o site funciona: as candidaturas vão para
`.data/candidaturas.json`. Para abrir o painel, defina ao menos:

```bash
ADMIN_PASSWORD="uma-senha-boa"
AUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
```

E acesse `/admin`.

---

## Mapa do site

A home é a porta, não o prédio: responde "o que é, é sério, como se divide, o que ganho,
de quem é o curso" e manda cada aprofundamento para uma landing page. Tudo que está no
menu e no rodapé é página própria — buscar uma informação não é rolar a home.

| Rota | Público | Responde |
|---|---|---|
| `/` | ambos | O que é o Duck Affiliate e por onde começar |
| `/como-funciona` | afiliado | Três partes, seis passos, critérios de seleção |
| `/para-afiliados` | afiliado | Quem encaixa, áreas, kit que recebe, comparativo |
| `/comissao` | afiliado | Simulador, rastreio, pagamento, dúvidas de dinheiro |
| `/para-produtores` | produtor | O que a estrutura entrega a quem tem curso + formulário de interesse |
| `/inscricao` | afiliado | Formulário de candidatura |
| `/contato` | ambos | E-mail e WhatsApp |
| `/programa` | afiliado | Regras completas, por extenso |
| `/perguntas-frequentes` | afiliado | FAQ inteira |
| `/para-criadores/<área>` | afiliado | Páginas de SEO por área |
| `/parceiro/entrar` | afiliado aprovado | Login por link ("Entrar" no topo e no rodapé) |

**Vocabulário.** Para o afiliado, "canal" é o canal dele no YouTube. Por isso o outro lado
do modelo — canal, escola ou criador que tem curso — se chama **produtor** no site público.
Internamente a entidade é o *programa* (`programas` no banco).

**Produtores.** O formulário de `/para-produtores` grava em `produtores_interessados`
(ou `.data/produtores_interessados.json`), avisa a equipe por e-mail e aparece em
`/admin/produtores` com status. Integrar um produtor novo ainda é manual: criar o programa
no banco e publicar os materiais dele.

## Área do parceiro e biblioteca de materiais

Parceiro **aprovado** entra em `/parceiro` sem senha: informa o e-mail da candidatura,
recebe um link que vale 20 minutos e vira uma sessão de 30 dias. Se o status deixar de
ser "aprovado", o acesso cai na próxima página — não há nada para revogar.

```
/parceiro                                   Meus programas (+ "pronto para vender" ou "falta seu link")
/parceiro/<programa>                        Link de vendas + QR, destaques, campanhas
/parceiro/<programa>/materiais              Biblioteca: busca, filtros, ordenação, grade/lista
/parceiro/<programa>/materiais/<id>         Detalhe: prévia, baixar/copiar/abrir, link e QR deste material
```

### Link de vendas e material individualizado

O Duck Affiliate não processa venda: quem rastreia e paga é a plataforma do produtor
(Hotmart, no primeiro programa). O parceiro cria a conta lá, pede afiliação ao produto e
**cola o link que a plataforma gerou** na página do programa — é o vínculo parceiro ×
programa (`afiliacoes`, um link por parceiro por programa; o passo a passo por plataforma
está em `src/lib/plataformas.ts`). A partir daí o material vira dele:

- **QR code** gerado no servidor (`qrcode`, sem serviço externo), PNG de 256 a 2048 px ou
  SVG, em `/api/parceiro/programas/<slug>/qr`. Codifica o link do parceiro e nada mais.
- **Textos com `{{link}}`**: o admin escreve o marcador onde o link entra; cada parceiro
  vê e copia o texto já com o próprio link. Sem link cadastrado o marcador fica visível e a
  interface manda cadastrar.
- **Etiqueta de origem por material**: na Hotmart o link ganha `?src=duck-<tipo>-<id>`
  (QR do programa: `src=duck-qr`), que a plataforma devolve no relatório de vendas como
  origem — o parceiro descobre qual thumbnail ou descrição vendeu. Um `src` que o parceiro
  já tenha no link não é sobrescrito. Eduzz/Kiwify: só validação de domínio, sem etiqueta.

Na prévia da equipe o cartão aparece no estado "pronto" com um link de exemplo, e o
passo a passo fica atrás de "ver o passo a passo"; salvar e baixar exigem parceiro real.

Quem publica é a equipe, em `/admin/materiais` (e `/admin/campanhas`). O painel abre em
`/admin` com o que há para fazer (candidaturas na fila, produtores sem contato, materiais,
campanhas) e uma ajuda dobrável; **Ver como parceiro** abre a biblioteca em prévia, com a
sessão da própria equipe, sem contar uso. Um material é um
**arquivo** (baixar), um **texto** (copiar) ou um **link** (abrir). Tipos: imagem, vídeo,
banner, social, e-mail, copy, cupom, logo, PDF, link, outro.

**Sem Supabase** os arquivos vão para `.data/materiais/` e o upload passa pelo servidor.
**Com Supabase** o navegador envia direto para o bucket privado `materiais` (URL assinada)
e o download é um redirecionamento para uma URL de leitura de 60 s — o arquivo nunca ocupa
a função do Next, o que importa porque a Vercel corta requisições em ~4,5 MB.

Em desenvolvimento sem `RESEND_API_KEY`, o link de acesso do parceiro é impresso no
terminal do `npm run dev`.

Todo parceiro aprovado hoje vê todos os programas ativos (há um só). O único vínculo
explícito parceiro × programa é o link de vendas; restringir *quais* programas cada
parceiro vê é a primeira coisa a adicionar quando entrar o segundo produtor — está anotado
no roadmap.

## Estrutura

```
src/
├── app/
│   ├── page.tsx                    Home (porta de entrada, 8 seções)
│   ├── como-funciona/ · para-afiliados/ · comissao/    Landing pages do afiliado
│   ├── para-produtores/            Landing page do produtor + formulário de interesse
│   ├── inscricao/ · contato/       Candidatura e contato (saíram da home)
│   ├── programa/                   Regras completas do programa (SEO)
│   ├── perguntas-frequentes/       FAQ com schema.org FAQPage
│   ├── para-criadores/[area]/      10 páginas programáticas de SEO
│   ├── termos/ · privacidade/      Minutas jurídicas (revisar antes de publicar)
│   ├── obrigado/                   Pós-inscrição (noindex)
│   ├── parceiro/                   Área do parceiro (login por link, link de vendas, biblioteca)
│   ├── admin/                      Painel: início por tarefas, candidaturas, materiais,
│   │                               campanhas, produtores interessados
│   └── api/
│       ├── candidaturas/ · produtores/    POST público dos dois formulários
│       ├── materiais/[id]/arquivo/        Download do material (conta uso)
│       ├── parceiro/                      Acesso, sessão, uso, link de vendas e QR
│       └── admin/                         Sessão, triagem, materiais, campanhas, CSV
├── components/                     Interface (seções, formulários, painel, parceiro)
├── lib/
│   ├── site.ts                     Configuração institucional, menu e rodapé
│   ├── programa.ts                 ⚠️ Conteúdo comercial — números ficam aqui
│   ├── produtores.ts               Conteúdo da página do produtor
│   ├── plataformas.ts              Hotmart/Eduzz/Kiwify: validação do link e etiqueta de origem
│   ├── materiais.ts                Domínio da biblioteca + personalização por parceiro
│   ├── qr.ts                       QR code gerado no servidor (PNG/SVG)
│   ├── schema.ts                   Validação (zod) e tipos
│   ├── score.ts                    Triagem automática de prioridade
│   ├── db.ts                       Supabase ou arquivo (`.data/`)
│   ├── store*.ts                   Candidaturas, materiais, produtores, afiliações
│   ├── storage.ts                  Arquivos: bucket privado ou disco local
│   ├── auth.ts · auth-parceiro.ts  Sessão do painel e do parceiro
│   └── mail.ts                     E-mails transacionais (Resend)
└── middleware.ts                   Barreira do /admin e do /parceiro
supabase/schema.sql                 Tabelas, índices, RLS, bucket e funções
docs/                               Playbooks, roadmap e handoff
```

O `preview/landing.html` foi removido no rebrand: era um espelho estático da identidade
anterior e, mantido, mostraria a marca velha em qualquer aprovação de cliente. O preview
agora é o próprio `npm run dev` (continua no histórico do git, se precisar).

### Seções da home, na ordem

`Hero` · `Numeros` · `Trilhas` · `Pilares` · `Beneficios` · `Assinatura` · `FaqCurto` ·
`Chamada`

Eram 15 seções; viraram 8. A home responde "o que é → é sério? → para onde eu vou → como
funciona → o que eu ganho → de quem é o curso → dúvidas rápidas → me inscrevo", e `Trilhas`
é o desvio: quatro portas para as landing pages, onde mora o aprofundamento. O que saiu da
home não foi jogado fora — virou página no menu e no rodapé.

---

## Identidade visual

A paleta **sai do logo oficial**, amostrada pixel a pixel do PNG entregue — não é
aproximação de olho:

| Token | Valor | Papel |
|---|---|---|
| `--navy` | `#000E29` | Fundo do logo, cabeçalho, faixas escuras |
| `--ambar` | `#FFC20E` | Acento, botão primário, realce de título |
| `--ambar-texto` | `#8A5A00` | Âmbar para **texto sobre fundo claro** |
| `--royal` | `#1B4CB8` | Azul da jaqueta e dos óculos, cor de apoio |
| `--papel` | `#F4F6FB` | Fundo claro (azulado, nunca creme) |

O `--ambar` puro dá **1,6:1** sobre branco e não serve para texto corrido; por isso existe o
`--ambar-texto`, com **5,5:1**. Todos os pares de cor do sistema foram conferidos em
contraste WCAG antes de entrar.

**Tipografia:** Figtree 800 no display (a geométrica pesada mais próxima do wordmark) e
Inter na interface. A assinatura tipográfica é uma expressão do título em âmbar riscada por
uma curva — o gesto da seta que o logo faz sob o pato (`.realce`).

**A paleta creme e dourada do Rascunhos Econômicos não é usada aqui de propósito:** as duas
marcas precisam ser distinguíveis à primeira vista.

### Assets

Todos derivados do logo oficial por [`public/`](public/):

| Arquivo | Uso |
|---|---|
| `duck-emblema-192.webp` | Emblema no cabeçalho, rodapé e painel |
| `duck-emblema.png` | Campo `logo` do schema.org |
| `duck-lockup.webp` | Lockup completo na seção `#catalogo` |
| `icone-64.png` · `apple-touch-icon.png` | Favicon e ícone de app |

O emblema é exportado **sobre o navy oficial**, não com fundo transparente: o aro amarelo do
círculo é interrompido pela cabeça do pato e pela seta, então o recorte por preenchimento
vazava para dentro e comia a jaqueta. A placa em CSS usa exatamente a mesma cor, e a emenda
some em qualquer fundo de página.

Detalhes e regras de uso em [docs/01-posicionamento.md](docs/01-posicionamento.md).

---

## ⚠️ Regra de conteúdo: nada de dado inventado

O programa não tem histórico — não houve turma anterior, não há parceiro ativo, não há
volume de vendas. Por isso **não existe no site** depoimento, contagem de afiliados, número
de vendas ou "já recusamos X"; e nada disso pode ser acrescentado sem que o dado exista.

No lugar da prova social, a faixa sob o hero carrega a **regra** do programa (comissão,
rastreio, custo, prazo de resposta) — verificável, e mais útil para quem está decidindo se
se inscreve. O comparativo descreve o **padrão de mercado**, nunca um concorrente nomeado.

Detalhe em [docs/01-posicionamento.md](docs/01-posicionamento.md).

---

## ⚠️ Números a confirmar com o cliente

Estão todos em [`src/lib/programa.ts`](src/lib/programa.ts), no objeto `comissao`, e são
**propostas iniciais** — nada disso veio do documento de visão. Confirme antes de publicar:

| Item | Valor no código | Onde aparece |
|---|---|---|
| Comissão de entrada | `40%` | Hero, comissão, FAQ, termos, OG image |
| Comissão máxima | `60%` | Idem |
| Cookie de rastreio | `30 dias` | Comissão, FAQ, termos |
| Prazo de pagamento | `D+30` | Comissão, FAQ, termos |
| Ticket de referência | `R$ 497` | Apenas no simulador da landing |

Mudar qualquer um deles é editar uma linha: todo o site lê desse arquivo.

Também precisam de decisão do cliente antes do ar:

- **Domínio.** Decidido: domínio próprio, coerente com a marca independente — **ainda não
  comprado**. Até lá `NEXT_PUBLIC_SITE_URL` guarda um provisório e **nenhum domínio aparece
  em texto visível do site**; comprar e trocar a variável resolve canonical, sitemap, OG e
  o rodapé dos e-mails de uma vez.
- **E-mail e WhatsApp** de contato (`src/lib/site.ts` e `.env.local`).
- **Revisão jurídica** de `/termos` e `/privacidade`, incluindo razão social e CNPJ.

---

## Produção

### 1. Banco de dados

Crie um projeto no [Supabase](https://supabase.com), rode `supabase/schema.sql` no SQL
Editor e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."     # nunca prefixar com NEXT_PUBLIC_
```

As tabelas sobem com RLS ligado e **sem políticas**: só o servidor, usando a service role
key, lê ou escreve. Se essa chave vazar, a base inteira vaza — trate como senha de banco.

O `schema.sql` é **idempotente** (`create ... if not exists`, `add column if not exists`):
rodar de novo num banco que já existe aplica só o que falta. É assim que se migra um
ambiente já publicado — ver [docs/06-handoff.md](docs/06-handoff.md).

### 2. E-mails (opcional, mas recomendado)

Com `RESEND_API_KEY` e `MAIL_FROM` configurados, cada inscrição dispara:

- confirmação automática para o candidato, com o que esperar e em quanto tempo;
- alerta para a equipe (`MAIL_TEAM`) com a ficha completa e a prioridade da triagem.

Sem as variáveis, o site funciona igual — só não envia e-mail. Falha de e-mail **nunca**
derruba a inscrição.

### 3. Deploy

Feito para a Vercel (`npm run build`). Serve em qualquer host com Node 20+.
Configure todas as variáveis do `.env.example` no painel do provedor.

### 4. Depois de publicar

- [ ] Google Search Console: registrar a propriedade e enviar `/sitemap.xml`
- [ ] Google Analytics: preencher `NEXT_PUBLIC_GA_ID`
- [ ] Publicar o vídeo de divulgação apontando para o domínio
- [ ] Trocar `ADMIN_PASSWORD` por uma senha forte e única
- [ ] Conferir o bucket privado `materiais` no Supabase (Storage) e subir os primeiros materiais
- [ ] Combinar com o produtor o link de afiliação do produto (`programas.url_afiliacao`),
      que vira o botão "Solicitar afiliação" na área do parceiro

---

## Como funciona a triagem automática

Cada candidatura recebe uma nota de 0 a 100 ([`src/lib/score.ts`](src/lib/score.ts)) que
pondera audiência (30), alinhamento de área (25), formato de divulgação (20), prontidão
operacional (10), qualidade da motivação (15) e presença multiplataforma (10).

**A nota não aprova nem reprova ninguém.** Ela só ordena a fila para a análise humana
começar pelos casos mais promissores — coerente com a tese do projeto, em que audiência
qualificada pesa mais que audiência grande. A regra é aberta e auditável de propósito:
qualquer pessoa da equipe consegue ler o arquivo e entender por que um candidato apareceu
no topo.

---

## Segurança

- Formulário com honeypot, verificação de tempo de preenchimento e limite de 5 envios por
  IP a cada 10 minutos.
- Validação com zod no servidor — o cliente valida só para a experiência.
- Painel com senha, sessão de 12h em cookie `httpOnly` assinado com HMAC-SHA256.
- O middleware roda no Edge e só checa a presença do cookie; **a assinatura é validada em
  cada página e rota do `/admin`**, no runtime Node. As duas checagens são necessárias.
- `/admin`, `/api/` e `/obrigado` estão fora do `robots.txt` e marcados como `noindex`.

O limite por IP é em memória: some a cada deploy e não é compartilhado entre instâncias.
Serve contra flood bobo. Para algo sério, ver `docs/05-roadmap.md`.

---

## Documentação

| Documento | Para quê |
|---|---|
| [docs/01-posicionamento.md](docs/01-posicionamento.md) | Identidade, tom de voz e decisões de marca |
| [docs/02-operacao-selecao.md](docs/02-operacao-selecao.md) | Playbook de triagem + modelos de e-mail e WhatsApp |
| [docs/03-comunidade-e-materiais.md](docs/03-comunidade-e-materiais.md) | Estrutura do Discord e da biblioteca de materiais |
| [docs/04-seo.md](docs/04-seo.md) | Estratégia de busca e plano de conteúdo |
| [docs/05-roadmap.md](docs/05-roadmap.md) | Da landing page à plataforma multiprodutor |
| [docs/06-handoff.md](docs/06-handoff.md) | **Estado atual, o que falta configurar e o que é manual** |
