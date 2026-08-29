# PARE — Projeto Afiliado Rascunhos Econômicos

Central de apresentação, recrutamento e triagem de parceiros criadores de conteúdo.

Não é uma landing page com um Google Forms embutido: é uma aplicação Next.js com
formulário próprio, banco de candidatos, triagem automática de prioridade e painel
administrativo. A operação financeira (venda, rastreio e comissão) continua na Hotmart,
como previsto no documento de visão — o que muda é que o **cadastro e o funil de
seleção passam a ser um ativo nosso**, não de um formulário do Google.

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
preview/landing.html                Preview estático para aprovação do cliente
```

---

## Identidade visual

A paleta, a tipografia e o brasão vêm do site do cliente, não de um palpite: os valores
foram extraídos das variáveis CSS de `rascunhoseconomicos.com/assets/site.css` e o brasão é
o arquivo oficial (`/logo.svg`), baixado e versionado em [`public/logo.svg`](public/logo.svg).

Navy `#0a0e1a`, creme `#f5f3ee` / `#ebe7dc`, dourado `#c8a45c`, Fraunces 500 + Inter — com a
assinatura do canal: uma expressão do título em Fraunces itálico dourado. Tudo mora em
tokens no topo de [`src/app/globals.css`](src/app/globals.css); nenhum componente conhece
cor literal.

Detalhes e regras de uso em [docs/01-posicionamento.md](docs/01-posicionamento.md).

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

- **Domínio.** A sugestão é `afiliados.rascunhoseconomicos.com` (subdomínio herda parte da
  autoridade do domínio principal). Ajuste em `NEXT_PUBLIC_SITE_URL`.
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
