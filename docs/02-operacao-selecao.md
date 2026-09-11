# Playbook de operação e seleção

O site capta. Este documento é o que acontece depois — a parte que decide se o programa
funciona ou vira um banco de e-mails parado.

## Regra número um

**Toda candidatura recebe resposta em até 7 dias úteis.** O prazo está prometido em cinco
lugares do site. Um criador ignorado não só não vira parceiro: ele conta para os outros
criadores da área que a gente não respondeu.

Se o volume crescer a ponto de inviabilizar isso, mude a promessa no site antes de quebrá-la
(`src/lib/programa.ts` → `etapas`).

## Ritmo semanal sugerido

| Quando | O quê | Tempo |
|---|---|---|
| Segunda, 30 min | Abrir `/admin`, mover tudo de **Novo** para **Em análise** ou **Banco de talentos** | 30 min |
| Terça e quinta | Contatar os aprovados na triagem; agendar as conversas | 30 min |
| Quinta | Conversas de 30 min por Meet | conforme fila |
| Sexta, 15 min | Fechar aprovações, liberar na Hotmart, dar acesso à comunidade | 15 min |

Cerca de duas horas por semana até algo em torno de 50 candidaturas/mês.

## Como analisar uma candidatura

A nota de 0 a 100 do painel **ordena a fila, não decide nada**. A decisão é sua, e leva
cerca de cinco minutos por candidato:

1. **Abrir o canal** (link na ficha). Assista dois minutos de um vídeo recente.
2. **Olhar a proporção**, não o número: views por vídeo contra número de inscritos.
   Um canal de 8 mil inscritos com 4 mil views por vídeo é ouro. Um de 300 mil com 2 mil
   views é fachada.
3. **Ler os comentários.** É o melhor termômetro de qualidade de audiência que existe.
   Perguntas de verdade sobre o conteúdo? Ótimo sinal.
4. **Ler o campo "por que quer participar".** Resposta genérica ("quero ganhar dinheiro
   com meu canal") pesa contra. Resposta que demonstra conhecer o Rascunhos pesa muito a
   favor.
5. **Perguntar-se:** eu ficaria confortável se esse canal falasse em nome do produto?

### Critérios de recusa direta

- Audiência comprada (engajamento incompatível com o tamanho declarado).
- Conteúdo que conflita com o posicionamento editorial.
- Histórico de divulgação predatória (promessa de ganho, pirâmide, jogo de aposta).
- Canal inativo há mais de seis meses.

### Quando usar "Banco de talentos"

Para o candidato bom cujo encaixe não é agora: área adjacente, canal em crescimento,
formato que ainda não temos material. É a categoria mais valiosa do painel — é dela que
saem os parceiros da segunda e da terceira leva. Registre nas notas **por que** ficou em
espera e o que mudaria isso.

---

## Modelos de mensagem

Ajuste o tom, mas mantenha a estrutura: contexto → decisão → próximo passo concreto.

### 1. Convite para conversa (aprovado na triagem)

> **Assunto:** Sua inscrição no Duck Affiliate — vamos conversar?
>
> Oi, {primeiro nome}!
>
> Analisei sua inscrição e o {nome do canal} com calma. Gostei especialmente de {algo
> específico e verdadeiro — um vídeo, um recorte, o tipo de comentário que o público deixa}.
> Acho que tem encaixe real com o que a gente publica.
>
> Consegue meia hora nesta semana para a gente alinhar formato de divulgação e condições?
> Mando o link do Meet no horário que for melhor para você — ou, se preferir, resolvemos
> por WhatsApp mesmo.
>
> Abraço,
> {seu nome} — Rascunhos Econômicos

**Não pule a personalização do segundo parágrafo.** É o que separa este e-mail de um
disparo automático, e o público-alvo percebe a diferença na primeira linha.

### 2. Aprovação e onboarding

> **Assunto:** Bem-vindo(a) ao Duck Affiliate 🎉
>
> {primeiro nome}, fechado! Parceria confirmada.
>
> Três passos para você começar:
>
> 1. **Hotmart** — crie ou acesse sua conta em hotmart.com e me confirme o e-mail
>    cadastrado. Libero você como afiliado em seguida.
> 2. **Comunidade** — entre por este link: {link do grupo no Telegram}. É onde ficam artes,
>    textos, cupons e o calendário de campanhas.
> 3. **Seu cupom** — vou gerar o cupom {SUGESTAO} para a sua audiência. Se preferir outro
>    nome, me diga.
>
> Sua comissão ficou em **{X}%** por venda aprovada, com {30} dias de rastreio.
>
> Qualquer dúvida, me chama direto. Bom trabalho!

### 3. Recusa (educada e útil)

> **Assunto:** Sobre a sua inscrição no Duck Affiliate
>
> Oi, {primeiro nome}, obrigado por se candidatar.
>
> Neste momento não vamos seguir com a parceria — {motivo honesto e específico: o encaixe
> entre o seu público e os cursos ainda não está claro / a área está fora do nosso catálogo
> atual}.
>
> Isso não é um "não" definitivo. Seu cadastro fica no nosso banco de parceiros e eu volto a
> te procurar quando abrirmos campanha que converse com o seu público.
>
> Continue publicando — {algo específico e verdadeiro sobre o trabalho da pessoa}.
>
> Abraço,
> {seu nome}

Recusa vaga gera resposta pedindo explicação e queima mais tempo que a recusa honesta.

### 4. Primeiro contato por WhatsApp

> Oi, {nome}! Aqui é o {seu nome}, do Rascunhos Econômicos. Recebi sua inscrição no Projeto
> Afiliado e queria conversar sobre. Consegue falar hoje ou amanhã?

Curta de propósito. Bloco de texto no primeiro contato por WhatsApp derruba a resposta.

---

## Roteiro da conversa de 30 minutos

| Bloco | Tempo | Objetivo |
|---|---|---|
| Abertura | 5 min | Conhecer o projeto do parceiro, não vender o nosso |
| O programa | 5 min | Comissão, rastreio, material, calendário |
| Formato | 10 min | **O bloco que mais importa:** como a divulgação entra no conteúdo dele |
| Combinados | 5 min | Comissão acordada, cupom, primeira ação e data |
| Encerramento | 5 min | Próximos passos e prazo de cada um |

Saia da conversa com **uma data marcada** para a primeira divulgação. Parceria sem primeira
ação agendada tende a nunca começar.

## Acompanhamento pós-aprovação

- **Dia 7:** o parceiro entrou na comunidade e baixou material? Se não, um toque.
- **Dia 30:** primeira divulgação saiu? Se não, entender o que travou — quase sempre é
  falta de material no formato dele.
- **Dia 90:** revisar resultado, ajustar comissão e discutir campanha dedicada.

Parceiro que passa 90 dias sem publicar não é problema dele: é sinal de que o material ou
o encaixe está errado. Trate como diagnóstico, não como cobrança.

## Métricas para acompanhar

| Métrica | Onde | Meta inicial sugerida |
|---|---|---|
| Candidaturas por mês | `/admin` | 30 no primeiro trimestre |
| Taxa de aprovação | `/admin` | 15% a 25% |
| Tempo até a primeira resposta | manual | < 7 dias úteis |
| Parceiros que publicaram em 30 dias | manual | > 60% dos aprovados |
| Vendas por parceiro ativo | Hotmart | definir após a primeira leva |

As duas últimas são as que realmente importam. Cadastro grande com poucos parceiros ativos
é vaidade — o objetivo do programa é venda, não banco de dados.
