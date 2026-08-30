# Estratégia de SEO

O documento de visão prevê "tráfego orgânico vindo do Google" como fonte permanente de
parceiros. Este é o plano para isso.

## Premissa

Ninguém busca "Duck Affiliate" — a marca acabou de nascer. As
buscas que existem são de **problema**, feitas por criadores:

- "como monetizar canal educacional"
- "programa de afiliados para professores"
- "como ganhar dinheiro com canal de história"
- "monetizar canal pequeno"
- "afiliado de curso online vale a pena"

Volume individual baixo, intenção altíssima. Quem digita isso é literalmente o público que
queremos — e é uma disputa que dá para vencer, porque a concorrência quase toda é conteúdo
raso de blog de marketing digital.

## O que já está implementado

| Item | Onde |
|---|---|
| Metadata completa, canonical, OpenGraph e Twitter Card | `src/app/layout.tsx` + cada página |
| `sitemap.xml` gerado, com todas as áreas | `src/app/sitemap.ts` |
| `robots.txt` com bloqueio de `/admin`, `/api` e `/obrigado` | `src/app/robots.ts` |
| JSON-LD `Organization` | `src/app/layout.tsx` |
| JSON-LD `FAQPage` (elegível a rich snippet) | landing e `/perguntas-frequentes` |
| Imagem OG gerada dinamicamente | `src/app/opengraph-image.tsx` |
| 10 páginas programáticas por área | `src/app/para-criadores/[area]` |
| HTML semântico, headings em ordem, `lang="pt-BR"` | todo o site |
| Renderização estática (SSG) das páginas públicas | padrão do App Router |

## Arquitetura de conteúdo

```
/                              Página principal — "programa de afiliados para criadores"
├── /programa                  Regras completas — cauda longa de intenção comercial
├── /perguntas-frequentes      FAQPage — alvo de featured snippet
└── /para-criadores/{area}     10 páginas de intenção específica por área
```

As páginas por área têm **texto próprio, não template com a palavra trocada**. Página fina
gerada em massa não ranqueia desde 2022 e ainda arrasta a autoridade do domínio para baixo.
Se for criar novas áreas, escreva os quatro blocos de conteúdo de verdade — está tudo no
mapa `CONTEUDO` em `src/app/para-criadores/[area]/page.tsx`.

## Domínio: subdomínio ou pasta?

**Recomendação: `afiliados.rascunhoseconomicos.com`.**

Uma pasta (`rascunhoseconomicos.com/afiliados`) herdaria mais autoridade, mas o documento
de visão é explícito em querer o site como **ativo digital independente**, capaz de servir
outros produtores no futuro. Um subdomínio pode virar domínio próprio sem quebrar o site do
Rascunhos; uma pasta, não.

O custo dessa escolha é real: subdomínio recebe menos autoridade herdada. Compense com
links do site principal e do canal — o que já está previsto no plano de captação.

## Plano de conteúdo — primeiros 6 meses

Um artigo por mês resolve. O objetivo não é volume, é ser a melhor resposta para cada
pergunta.

| Mês | Artigo | Busca-alvo |
|---|---|---|
| 1 | Como monetizar um canal educacional pequeno em 2026 | monetizar canal pequeno |
| 2 | Programa de afiliados para professores: como funciona | afiliado para professor |
| 3 | Quanto ganha um afiliado de curso online (com contas reais) | quanto ganha afiliado |
| 4 | Como indicar um curso sem queimar a confiança da sua audiência | — (compartilhamento) |
| 5 | AdSense, patrocínio ou afiliação: o que rende mais para canal educacional | monetização youtube educacional |
| 6 | Guia da Hotmart para criadores de conteúdo educacional | como ser afiliado hotmart |

Cada artigo termina com um convite para o programa. O do mês 3 é o mais importante:
"quanto ganha" tem o maior volume de busca e é onde a concorrência mais mente — mostrar
conta real é a nossa vantagem.

Quando implementar, crie `/artigos/{slug}` com JSON-LD `Article` e acrescente ao
`sitemap.ts`.

## Fora do site

1. **Link do site principal** do Rascunhos Econômicos (rodapé e página "sobre") — o link
   mais valioso disponível.
2. **Descrição dos vídeos** do canal: link fixo para o programa.
3. **Vídeo dedicado** apresentando o projeto, seguindo o fluxo do documento de visão
   (vídeo → landing page → formulário).
4. **Perfil no Google Business** da empresa, se houver.
5. **Menções orgânicas**: cada parceiro aprovado que fala do programa gera link e busca por
   marca. É o efeito composto do modelo.

## Acompanhamento

- **Search Console** (obrigatório): registrar a propriedade e enviar o sitemap no dia da
  publicação.
- **Analytics**: preencher `NEXT_PUBLIC_GA_ID`.
- Marcar como evento a conclusão do formulário (`/obrigado` é a página de conversão).
- Os parâmetros UTM são capturados pelo formulário e gravados na candidatura — dá para
  saber exatamente qual vídeo ou campanha trouxe cada parceiro, direto no `/admin`.

## O que não fazer

- Comprar links.
- Gerar dezenas de páginas por área com o mesmo texto trocado.
- Prometer ganho no `<title>` ("ganhe R$ 5.000 por mês") — atrai o público errado e
  contradiz todo o posicionamento.
