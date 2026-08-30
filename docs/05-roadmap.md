# Roadmap — da landing page à plataforma

O documento de visão pede que o site seja pensado "desde o primeiro dia como um ativo
digital independente", capaz de deixar de ser uma landing page e virar plataforma. Este é o
caminho, com o que já está pronto e o que cada etapa exige.

## Fase 1 — MVP (entregue)

- [x] Landing page completa, com todas as seções previstas no documento de visão
- [x] Formulário próprio de inscrição, em 4 etapas, com validação e antispam
- [x] Banco de candidatos (Supabase Postgres) com schema, índices e RLS
- [x] Triagem automática de prioridade (0–100), auditável
- [x] Painel administrativo com filtros, ficha do candidato, status e notas
- [x] Exportação CSV para a planilha
- [x] E-mails transacionais (confirmação ao candidato + alerta à equipe)
- [x] SEO: sitemap, robots, dados estruturados, 10 páginas programáticas
- [x] Termos e política de privacidade (minutas, a revisar juridicamente)
- [x] Documentação de operação, comunidade e SEO

**Substituições em relação ao plano original.** O documento previa Google Forms + Google
Sheets. Trocamos por formulário e banco próprios porque o custo é praticamente o mesmo e a
diferença estratégica é grande: os dados ficam nossos, o formulário fica na nossa marca (não
em uma tela do Google no meio da conversão), a triagem pode ser automatizada e a evolução
para plataforma não exige migração. O Google Sheets continua no fluxo — via exportação CSV —
para quem preferir analisar em planilha.

## Fase 2 — Consolidação (30 a 60 dias após o lançamento)

Só faz sentido depois de ~20 parceiros ativos.

- [ ] **Área do parceiro** (`/parceiro`) — login próprio, materiais, cupom e link em um só
      lugar, sem depender do Discord. *Exige: Supabase Auth, tabela `parceiros`.*
- [ ] **Webhook da Hotmart** — receber evento de venda aprovada e reembolso para exibir
      resultado por parceiro no site. *Exige: endpoint `/api/hotmart/webhook` com validação
      de assinatura (`hottok`) e tabela `vendas`.*
- [ ] **Painel de resultados do parceiro** — cliques, vendas e comissão do mês.
- [ ] **E-mail de onboarding automatizado** ao mudar o status para "aprovado".
- [ ] **Autenticação real no admin** — hoje é senha compartilhada; com 3+ pessoas na
      operação, migrar para Supabase Auth com usuário por pessoa e log de quem mudou o quê.
- [ ] **Rate limit distribuído** (Upstash Redis) no lugar do controle em memória.
- [ ] **Blog** (`/artigos`) conforme o plano de conteúdo em `04-seo.md`.

## Fase 3 — Rede multiprodutor (após o modelo validado)

É aqui que o Rascunhos Econômicos deixa de ser o produto e vira o primeiro caso.

- [ ] **Catálogo de produtos** — vários produtores, cada um com seus cursos, comissões e
      materiais.
- [ ] **Cadastro de produtor** — outros criadores educacionais entram na rede pelo site.
- [ ] **Marketplace de encaixe** — o parceiro vê os produtos compatíveis com a área dele.
- [ ] **Biblioteca de materiais nativa**, no lugar do Google Drive.
- [ ] **Ranking e níveis de parceiro**, com comissão progressiva por histórico.
- [ ] **Marca própria da rede** (Green Eyes), com o Duck Affiliate como um dos programas.

### O que na arquitetura de hoje já prepara isso

| Decisão de hoje | O que ela destrava depois |
|---|---|
| Conteúdo comercial isolado em `lib/programa.ts` | Vira registro por produto sem tocar em componente |
| Persistência atrás de um adaptador (`lib/store.ts`) | Trocar de banco ou adicionar tabelas sem reescrever rota |
| Validação centralizada em `lib/schema.ts` | Formulário por produtor reaproveita a base |
| `candidaturas` com `area`, `score` e `origem` | Base do matching produto × parceiro |
| Design em variáveis CSS | Rebrand ou tema por produtor é troca de bloco |
| Páginas programáticas por área | Mesmo padrão serve para produto e para produtor |

## O que deliberadamente não foi feito

Cada item aqui foi considerado e descartado **para esta fase** — registrar isso evita
retrabalho de discussão daqui a três meses.

| Item | Por que ficou de fora |
|---|---|
| Infraestrutura própria de pagamento | O documento de visão é explícito: a Hotmart resolve isso e é a escolha certa agora |
| Login do candidato | Antes da aprovação ele não tem o que acessar; login vazio só aumenta atrito |
| Chat no site | Sem equipe para responder em tempo real, um chat sem resposta é pior que nenhum |
| Depoimentos e prova social | Não há parceiro ainda. Depoimento inventado destrói o posicionamento inteiro — incluir na primeira revisão, depois da primeira turma |
| Dashboard de vendas | Depende do webhook da Hotmart (fase 2) |
| Multi-idioma | O público é brasileiro |
| CMS | O conteúdo muda pouco e mora em arquivos versionados; CMS agora seria complexidade sem retorno |

## Dívidas técnicas conhecidas

1. **Rate limit em memória** — some a cada deploy e não é compartilhado entre instâncias.
   Aceitável no volume atual, resolver na fase 2.
2. **Senha compartilhada no admin** — sem trilha de auditoria de quem alterou o quê.
3. **Modo arquivo** (`.data/candidaturas.json`) — desenvolvimento apenas; o painel avisa em
   vermelho quando está ativo.
4. **Sem testes automatizados** — os pontos que mais mereceriam: `score.ts` (regra pura,
   trivial de testar) e a validação de `schema.ts`.
5. **Termos e privacidade sem revisão jurídica** — são minutas funcionais, sinalizadas no
   próprio texto das páginas.
