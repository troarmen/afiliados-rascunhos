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
dentro do programa — daí a assinatura *Powered by Rascunhos Econômicos*, que aparece na
pílula do cabeçalho, no rodapé, no cartão social e numa seção própria da home
(`#catalogo`).

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

## Estrutura

```
src/
├── app/
│   ├── page.tsx                    Landing page (todas as seções)
│   ├── programa/                   Regras completas do programa (SEO)
│   ├── perguntas-frequentes/       FAQ com schema.org FAQPage
│   ├── para-criadores/[area]/      10 páginas programáticas de SEO
│   ├── termos/ · privacidade/      Minutas jurídicas (revisar antes de publicar)
│   ├── obrigado/                   Pós-inscrição (noindex)
│   ├── admin/                      Painel de triagem
│   └── api/
│       ├── candidaturas/           POST público do formulário
│       └── admin/                  Sessão, atualização e exportação CSV
├── components/                     Interface (seções, formulário, painel)
├── lib/
│   ├── site.ts                     Configuração institucional
│   ├── programa.ts                 ⚠️ Conteúdo comercial — números ficam aqui
│   ├── schema.ts                   Validação (zod) e tipos
│   ├── score.ts                    Triagem automática de prioridade
│   ├── store.ts                    Persistência (Supabase ou arquivo)
│   ├── auth.ts                     Sessão do painel
│   └── mail.ts                     E-mails transacionais (Resend)
└── middleware.ts                   Barreira do /admin
supabase/schema.sql                 Tabela, índices, RLS e views do funil
docs/                               Playbooks de operação, comunidade, SEO e roadmap
```

O `preview/landing.html` foi removido no rebrand: era um espelho estático da identidade
anterior e, mantido, mostraria a marca velha em qualquer aprovação de cliente. O preview
agora é o próprio `npm run dev` (continua no histórico do git, se precisar).

### Seções da home, na ordem

`Hero` · `Numeros` · `Pilares` · `FaixaAreas` · `ComoFunciona` · `QuemPodeParticipar` ·
`Beneficios` · `Comissao` · `Portal` · `Comparativo` · `Selecao` · `Assinatura` · `Faq` ·
formulário · `Contato` · `Chamada`

A sequência responde, nesta ordem, às perguntas de quem chega: o que é → é sério? → como
funciona → serve para mim? → o que eu ganho → quanto → o que recebo → por que aqui → como
me escolhem → de quem é o curso → e as dúvidas → me inscrevo.

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

A tabela sobe com RLS ligado e **sem políticas**: só o servidor, usando a service role key,
lê ou escreve. Se essa chave vazar, a base inteira vaza — trate como senha de banco.

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
