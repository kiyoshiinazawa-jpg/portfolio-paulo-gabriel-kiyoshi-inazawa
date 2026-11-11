# Futuro & Sociedade: O Paradoxo da Aceleração

Projeto prático de Front-end & Copilotagem com IA (Prof. Diego Marques de Carvalho).
**Tema:** como o ganho de velocidade da IA é reinvestido em mais tarefas, e não em descanso, alimentando a ansiedade de performance e a fadiga digital da Geração Z.

## 1. Visão Geral e Preview

| | |
|---|---|
| **Deploy (GitHub Pages)** | `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/` ← preencher após o deploy |
| **Preview** | `![Preview](img/preview.png)` ← adicionar uma captura de tela da home |
| **Dupla** | [Integrante A] e [Integrante B] |

**Proposta.** Um site de cinco páginas que cruza o *Eixo A (Futuro do Trabalho)*, com IA como colega de trabalho, métricas de produtividade e a NR-1 (riscos psicossociais), e o *Eixo B (Geração Z)*, com adaptabilidade e busca de propósito de um lado e fadiga digital e ansiedade de performance do outro. A pergunta de pesquisa é: *quando a IA reduz o tempo de cada tarefa, o que acontece com o tempo livre, a atenção e a ansiedade de quem está começando a carreira?*

**Recursos avançados (Parte II):** questionário "Como está seu equilíbrio digital?" com gráfico radar, gráficos Chart.js com dados reais, tema claro/escuro persistente, glassmorphism, `@keyframes` e modal contextual.

## 2. Estrutura de Arquivos e Diretórios

```
/
├── index.html            # Início: carrossel, recorte e números-chave
├── impactos.html         # Impactos no cotidiano, IA, tabela comparativa e FAQ
├── dados.html            # Pergunta de pesquisa, 4 gráficos (Chart.js), limitações e referências
├── estrategias.html      # Estratégias para candidatos e organizações, 5 eixos, plano em 4 passos
├── questionario.html     # Microaplicação: "Como está seu equilíbrio digital?"
├── sobre.html            # Contato
├── css/
│   └── styles.css        # Design System (:root), tema escuro, componentes, animações
├── js/
│   ├── app.js            # Questionário (cálculo, radar, modal, impressão)
│   ├── charts.js         # Gráficos da página de dados
│   └── theme.js          # Tema claro/escuro com localStorage
├── img/                  # Imagens do carrossel e dos blocos
├── AUDITORIA_IA.md       # Prompt Logbook (auditoria crítica da IA)
├── README.md
├── LICENSE               # MIT
└── .gitignore
```

## 3. Arquitetura de Software e Contratos de Dados

**Componentes.** `header > nav` (Navbar Bootstrap com menu colapsável e botão de tema) → `main` (seções com `section`, `article`, `aside`, `figure`) → `footer`. O link "Ir para o conteúdo principal" é o primeiro elemento focável.

**Design System.** Todos os tokens ficam em `:root` (cores, superfícies, escala tipográfica 1.25, espaçamentos, raio, transição). O tema escuro redefine os mesmos tokens em `[data-bs-theme="dark"]`, o que permite que o Bootstrap 5.3 e o CSS autoral troquem de tema juntos.

**Contrato 1: dataset dos gráficos (`js/charts.js`, objeto `DADOS`).**

```jsonc
{
  "metr":     { "fonte": "string", "rotulos": ["string"], "valores": [-24, -20, 19] },   // variação % no tempo
  "deloitte": { "fonte": "string", "rotulos": ["string"], "valores": [74, 67, 58, 48, 34, 20],
                "tipos": ["ok" | "warn" | "danger"] },                                    // % da Geração Z
  "brainFry": { "fonte": "string", "rotulos": ["string", "string"], "valores": [14, 86] }, // soma = 100
  "areas":    { "fonte": "string", "rotulos": ["Jurídico", "Média geral", "Marketing"], "valores": [6, 14, 26] }
}
```

Regras: `rotulos.length === valores.length`; valores em percentual; cada série cita a fonte que a sustenta (ver seção 6).

**Contrato 2: questionário (`js/app.js`).**

```jsonc
// Entrada: constante EIXOS (5 itens)
{ "id": "tecnologia", "titulo": "string", "icone": "bi-*", "perguntas": ["string" x3], "dicas": ["string" x3], "ok": "string" }
// Escala de resposta: Nunca=0, Raramente=1, Frequentemente=2, Sempre=3
// Saída de calcular():
{ "pct": 0-100, "porEixo": [ { "eixo": EIXO, "pct": 0-100 } ] }
// Faixas: >=75 Equilíbrio saudável | 50-74 Atenção moderada | <50 Hora de ajustar (abre o modal)
```

Todas as afirmações do questionário são positivas (quanto maior a frequência, maior o equilíbrio), então não há itens invertidos. O instrumento é **autoral e reflexivo**; não é uma escala psicológica validada e não gera diagnóstico.

**Persistência.** `localStorage["tema-preferido"]` guarda `"light"` ou `"dark"`. Se o acesso falhar (modo privado), o tema segue a preferência do sistema.

## 4. Declaração de Dependências e CDN

| Biblioteca | Versão | Origem | Justificativa de compatibilidade |
|---|---|---|---|
| Bootstrap (CSS e JS Bundle) | 5.3.3 | jsDelivr | Versão 5.3 traz `data-bs-theme`, necessário para o tema escuro. Suporta as versões atuais de Chrome, Firefox, Safari e Edge. |
| Bootstrap Icons | 1.11.3 | jsDelivr | Fonte de ícones sem dependência de JS. |
| Chart.js | 4.4.4 (UMD) | jsDelivr | Build UMD funciona via `<script>` sem bundler; renderiza em `<canvas>`, com suporte amplo nos navegadores. |
| Google Fonts: Plus Jakarta Sans | pesos 300 a 700 | Google | `display=swap` evita texto invisível; há fallback para `system-ui`. |

`backdrop-filter` (glassmorphism) usa o prefixo `-webkit-` para o Safari, e o conteúdo continua legível onde não houver suporte, pois a cor de fundo é semitransparente.

## 5. Matriz de Rastreabilidade e Colaboração

> Preencher com os hashes reais do histórico (`git log --oneline --author=...`). Os dois integrantes devem aparecer em commits de `feat`, `style`, `docs` e `refactor`.

| Tarefa | Parte | Responsável | Commits (hash) |
|---|---|---|---|
| Estrutura HTML5 semântica e acessibilidade | I (autoral) | [A] | |
| Design System `styles.css` e tipografia | I (autoral) | [B] | |
| Grid e componentes Bootstrap | I (autoral) | [A] | |
| Pesquisa, recorte e redação (`dados.html`) | Pesquisa | [A] e [B] | |
| Questionário interativo | II (copilotada) | [B] | |
| Gráficos Chart.js | II (copilotada) | [A] | |
| Tema claro/escuro, animações e modal | II (copilotada) | [B] | |
| `AUDITORIA_IA.md` | Dossiê | [A] e [B] | |
| README, deploy e testes cross-browser | Entrega | [A] e [B] | |

### Declaração de uso de IA

> ✏️ **A dupla deve preencher com sinceridade.** A Parte I é de autoria exclusiva da dupla, sem IA generativa. Indique aqui quais arquivos foram escritos à mão e quais receberam qualquer ajuda de IA, e registre os trechos de IA no `AUDITORIA_IA.md`.

## 6. Referências

- BECKER, J.; RUSH, N.; BARNES, E.; REIN, D. *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*. METR, 10 jul. 2025. https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ (arXiv:2507.09089).
- DELOITTE GLOBAL. *2026 Gen Z and Millennial Survey: Progress on Their Own Terms*. 2026. https://www.deloitte.com/content/dam/assets-shared/docs/campaigns/2026/2026-genz-millennial-survey.pdf
- BCG; HARVARD BUSINESS REVIEW. *When Using AI Leads to "Brain Fry"*. Mar. 2026. https://www.bcg.com/news/5march2026-when-using-ai-leads-brain-fry (números por área: Search Engine Journal e Exame, citados em `dados.html`).
- RANGANATHAN, A.; YE, X. M. *AI Doesn't Reduce Work—It Intensifies It*. Harvard Business Review, 9 fev. 2026. https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it
- BRASIL. Ministério do Trabalho e Emprego. Portarias MTE nº 1.419/2024 e nº 765/2025 (NR-1, riscos psicossociais; vigência em 26/05/2026).

*Dados conferidos em novembro de 2026. Verifique a fonte original antes de reutilizar qualquer número.*
