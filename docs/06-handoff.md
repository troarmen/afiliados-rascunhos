# Handoff — estado do projeto

Atualizado em **11 de setembro de 2026**. Este documento responde três perguntas: o que
está pronto, o que precisa ser configurado por uma pessoa e o que ainda é manual. O
"como o código funciona" está no [README](../README.md); o "o que vem depois" está no
[roadmap](05-roadmap.md).

---

## 1. O que está pronto

| Frente | Estado |
|---|---|
| Site público | 12 páginas indexáveis, home como porta de entrada e landing page por assunto |
| Funil do afiliado | Formulário → banco → triagem por nota → painel → e-mails |
| Funil do produtor | `/para-produtores` → formulário → fila em `/admin/produtores` com status |
| Área do parceiro | Login por link de e-mail, biblioteca de materiais, link de vendas e QR |
| Comunidade | Convite no e-mail de aprovação, cartão e menu da área do parceiro — **depende da URL configurada** |
| Painel da equipe | Início por tarefas, candidaturas, materiais, campanhas, produtores |
| Persistência | Supabase quando configurado; JSON em `.data/` quando não |

O site **não processa venda nem pagamento**. Quem rastreia, cobra e paga é a plataforma do
produtor (Hotmart, no primeiro programa). Isso é decisão de arquitetura, não pendência.

---

## 2. O que uma pessoa precisa configurar

Nada disso é código: é acesso, conta e decisão comercial.

### Obrigatório para publicar

- [ ] **Domínio próprio** — ainda não comprado. Até lá, nenhum domínio aparece em texto
      visível do site; só em `NEXT_PUBLIC_SITE_URL`, que alimenta SEO, sitemap, canonical e
      o rodapé dos e-mails. Comprado o domínio, trocar a variável resolve tudo de uma vez.
- [ ] **Supabase** — criar o projeto, rodar `supabase/schema.sql` no SQL Editor e preencher
      `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. Sem isso o site funciona,
      mas grava em arquivo — o que **não sobrevive a um deploy** na Vercel.
- [ ] **`ADMIN_PASSWORD` e `AUTH_SECRET`** — senha do painel e segredo das sessões. O
      `AUTH_SECRET` também assina o link de acesso do parceiro: **trocá-lo derruba todas as
      sessões de parceiro em aberto**.
- [ ] **Revisar `/termos` e `/privacidade`** — são minutas. Precisam de leitura jurídica
      antes de a primeira turma se inscrever.

### Recomendado

- [ ] **Brevo** (`BREVO_API_KEY`, `MAIL_FROM`, `MAIL_TEAM`) — sem isso ninguém recebe
      confirmação, a equipe não recebe alerta e **o parceiro aprovado não consegue entrar**,
      porque o link de acesso vai por e-mail. Em desenvolvimento o link é impresso no
      terminal e mostrado na tela; em produção, não. A chave é a de **API v3** (Brevo →
      SMTP & API → API keys), não a de SMTP, e o remetente de `MAIL_FROM` precisa ser um
      domínio autenticado na conta — domínio não verificado é entrega em spam ou recusa.
- [ ] **Números do programa** — comissão, ticket de referência e prazos vivem em
      `src/lib/programa.ts` e estão marcados no README como "a confirmar com o cliente".
- [ ] **Critério interno do percentual de comissão** — o site promete de 10% a 40% "por
      análise interna de cada parceria" (encaixe com o curso, audiência, formato e contexto
      da campanha) e que o parceiro conhece o número antes de divulgar. Essa análise ainda
      não está escrita em lugar nenhum. Antes da primeira aprovação, a equipe precisa de uma
      régua, mesmo simples, em `docs/02-operacao-selecao.md` — senão dois parceiros parecidos
      recebem percentuais diferentes sem explicação.
- [ ] **Link de afiliação do produto** — a URL onde o parceiro pede afiliação na Hotmart.
      Vai na coluna `programas.url_afiliacao` e vira o botão "Solicitar afiliação" no passo
      2 da área do parceiro. Sem ela, o passo continua existindo, só sem atalho.
- [ ] **Google Search Console e Analytics** — enviar o sitemap e preencher
      `NEXT_PUBLIC_GA_ID`.
- [ ] **Comunidade de parceiros** (`NEXT_PUBLIC_COMUNIDADE_URL`) — a plataforma é o
      **Telegram** (decisão do cliente, setembro/2026). Criar o canal de avisos e o grupo
      com Tópicos — estrutura em [03](03-comunidade-e-materiais.md) — e colar um link que
      **não expire** (`t.me/+…` principal ou `@usuario` público). Sem a variável, o convite
      não aparece no e-mail de aprovação nem na área do parceiro — e o site continua
      prometendo a comunidade em três lugares.

---

## 3. Migrar um ambiente que já está no ar

O `supabase/schema.sql` é idempotente. Num banco que já existe, rodá-lo de novo aplica só
o que falta e não toca em dado nenhum. Foi assim que as duas últimas entregas subiram:

| Entrega | O que o schema acrescenta |
|---|---|
| Biblioteca de materiais | `programas`, `campanhas`, `materiais`, `materiais_usos`, função `incrementar_uso_material`, bucket privado `materiais` |
| Funil de produtores | `produtores_interessados` |
| Link de vendas | colunas `programas.plataforma` e `programas.url_afiliacao`, tabela `afiliacoes` |

Depois de rodar, confira no Supabase: **Storage → bucket `materiais` existe e está
privado**, e a tabela `programas` tem pelo menos uma linha (o programa do Rascunhos
Econômicos). No modo arquivo esse programa nasce sozinho na primeira leitura; no Supabase,
ele vem do `schema.sql`.

---

## 4. O que ainda é manual (de propósito)

Nenhum dos itens abaixo é bug. São escolhas de escopo, e cada um tem o gatilho que
justificaria automatizar.

**Integrar um produtor novo.** A página `/para-produtores` captura interesse e organiza a
fila; ela não faz onboarding. Colocar um produtor no ar hoje é inserir a linha em
`programas` e publicar os materiais dele pelo painel. *Automatizar quando: o terceiro
produtor entrar.*

**Conferir a afiliação na Hotmart.** O parceiro cola o Hotlink e o sistema valida formato e
domínio — não confere se a afiliação existe de verdade, porque isso exige a API deles.
Um link de outro produto seria aceito. *Automatizar quando: entrar o webhook da Hotmart, que
já está no roadmap para mostrar vendas.*

**Cupom nominal por parceiro.** Quem cria cupom é o produtor, dentro da Hotmart. O site
distribui o cupom como material do tipo "cupom"; não o gera. *Automatizar quando: houver API
de cupom no plano do produtor.*

**Qual parceiro vê qual programa.** Todo parceiro aprovado vê todos os programas ativos —
hoje há um. O único vínculo explícito parceiro × programa é o link de vendas.
*Automatizar quando: entrar o segundo produtor.*

**Login de produtor.** Não existe. Produtor fala com a equipe; quem publica material é a
equipe. *Automatizar quando: o produtor pedir para publicar sozinho.*

---

## 5. Como conferir que está funcionando

Com o `npm run dev` rodando:

| Caminho | O que confirma |
|---|---|
| `/` → menu → cada página | Navegação, sem link morto |
| `/inscricao` | Formulário grava e responde; ver a candidatura em `/admin/candidaturas` |
| `/para-produtores#interesse` | Interesse grava e aparece em `/admin/produtores` |
| `/admin` (com `ADMIN_PASSWORD`) | Painel abre pelas tarefas do dia |
| `/admin/materiais` → "Ver como parceiro" | Prévia da biblioteca com a sessão da equipe |
| `/parceiro/entrar` com o e-mail de uma candidatura **aprovada** | Link de acesso (em dev, aparece na tela) |
| `/parceiro/<programa>` | Cadastrar o link da Hotmart, ver o QR nascer |

Em desenvolvimento, o e-mail do parceiro só sai se o status da candidatura for
**aprovado**. Qualquer outro status devolve a mesma tela de sucesso e não manda nada — é
proposital: diferenciar a resposta contaria a qualquer um quem está no programa.

---

## 6. Dívidas conhecidas

- ~~**O caminho Supabase nunca foi exercitado.**~~ **Resolvido em 10/09/2026.** O fluxo
  inteiro foi rodado contra um projeto Supabase real: inscrição (gravou no Postgres, nota
  calculada, origem por UTM), login e aprovação no painel, `atualizado_em` pelo trigger,
  pedido de acesso do parceiro (com a proteção contra enumeração conferida), token
  adulterado rejeitado, upload por URL assinada no bucket privado, download pelo parceiro
  e contagem de uso pela RPC — com o log atribuindo o download ao parceiro certo. Os dados
  de teste foram apagados depois.
- **A verificação do banco é um comando.** `npm run verificar:supabase`
  ([scripts/verificar-supabase.mjs](../scripts/verificar-supabase.mjs)) confere tabela,
  coluna, visão, função e bucket, e separa falha de rede de falha de schema. Rode depois de
  aplicar o `schema.sql` em qualquer ambiente novo.
- **Limite por IP é em memória** — some a cada deploy e não é compartilhado entre
  instâncias. Serve contra flood bobo; ver roadmap para Redis.
- **Senha compartilhada no painel** — com três pessoas na operação, migrar para uma conta
  por pessoa (roadmap).
- **Vocabulário "produtor"** — o site chama de *produtor* quem tem o curso, para não
  colidir com o *canal* do youtuber. Internamente a entidade continua sendo *programa*.
  Se o cliente preferir outro termo, é uma troca de texto.
