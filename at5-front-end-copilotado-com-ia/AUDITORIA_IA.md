# AUDITORIA_IA.md: Prompt Logbook

> ⚠️ **Leia antes de entregar.** Este arquivo foi pré-preenchido com **fatos reais** da sessão de copilotagem (prompts, trechos de código e falhas encontradas). Os campos marcados com ✏️ são da dupla: **reproduzam cada falha no navegador/DevTools, confirmem que ela existe e reescrevam o diagnóstico e a justificativa com suas próprias palavras**. O valor deste dossiê está na análise crítica de vocês, e não no texto pronto. Se algo aqui não corresponder ao que vocês verificaram, corrijam.

**Ferramenta usada nas três fichas:** Claude (Anthropic), interface claude.ai, modelo Claude Sonnet 5.5. Datas: 2 a 4 de novembro de 2026.

---

## Ficha 1: Questionário "Como está seu equilíbrio digital?" (JavaScript + Bootstrap)

### 1. Engenharia de Prompt (entrada)
> "eu quero que mantenha o visual original e a estrutura também, mas eu quero mais informações no index, impactos e estrategias e criar um questionário chamado "Como está seu equilíbrio digital?" com perguntas sobre: Uso de tecnologia no cotidiano, Pausas durante o trabalho ou estudo, Pressão por produtividade, Limites entre trabalho e descanso e Uso de inteligência artificial"

Anexo: `.zip` do projeto. Restrições declaradas: manter visual e estrutura originais, Bootstrap 5. ✏️ *Nota de maturidade:* o prompt não informou critérios de acessibilidade, bibliotecas permitidas nem formato de saída, e isso explica parte das falhas abaixo. Para as próximas iterações, vejam o "prompt refinado" no fim da ficha.

### 2. Resposta bruta da IA (trechos originais)
```js
// js/app.js (1ª versão)
function corPorPct(p) {
    if (p >= 75) return '#3b5249';
    if (p >= 50) return '#b58a3c';   // amarelo-mostarda para "atenção"
    return '#a65b4b';
}
// ...
barras += '<span class="small fw-semibold" style="color:' + cor + '">' + item.pct + '%...';
html += '<div class="card-custom bg-white shadow-sm p-4 p-md-5 mb-4">';
```
```html
<!-- acordeão gerado seguindo o padrão do arquivo original -->
<button class="accordion-button collapsed fw-semibold text-dark" type="button"
        data-bs-toggle="collapse" data-bs-target="#flush-collapseFour">...</button>
```

### 3. Auditoria crítica (diagnóstico de falhas) ✏️
1. **Contraste insuficiente (WCAG 1.4.3):** `#b58a3c` sobre branco tem razão de **3.15:1**, abaixo do mínimo de 4.5:1 para texto pequeno.
2. **Cor "chumbada" no JS** (`style="color:..."`): impede o tema escuro e mistura apresentação com lógica.
3. **Semântica fraca:** cartões e eixos do quiz são `<div>`, mas o PDF exige `section`/`article`; o título não está ligado à região (`aria-labelledby`).
4. **Acordeão sem `aria-expanded`/`aria-controls`:** a IA replicou o padrão incompleto do arquivo original em 5 itens novos. Além disso, `accordion-header` era `<h2>` dentro de uma `<section>` com `<h2>`, o que quebra a hierarquia de títulos.
5. **Progresso sem anúncio para leitores de tela:** o texto "x de 15 respondidas" não tinha `aria-live`.
6. **Montagem de HTML por concatenação de strings (`innerHTML`)**: aceitável aqui porque os dados são constantes do próprio código, mas se algum texto passasse a vir de entrada do usuário, abriria brecha de XSS. Registrar como débito técnico.
7. **Arquivo entregue pela IA estava truncado:** `estrategias.html` do projeto terminava no meio de uma tag (`class="img-fluid`), e a IA só percebeu ao ler o final do arquivo.

### 4. Refatoração manual e justificativa ✏️
- `corPorPct` virou `classeCor`, que devolve `ok | warn | danger` e aplica classes (`.cor-warn`, `.bg-ok`) definidas no CSS com variáveis. O âmbar passou a `--color-warn: #8a6420` (5.35:1) no claro e `#e0b25a` no escuro.
- Cartões do quiz viraram `<section aria-labelledby="eixo-N">`; cartões de dicas viraram `<article>`.
- Acordeões ganharam `aria-expanded="false"` e `aria-controls`; `accordion-header` passou a `<h3>`.
- `#progressLabel` recebeu `aria-live="polite"`.
- Débito registrado: se o conteúdo vier a ser dinâmico, trocar `innerHTML` por `createElement/textContent`.
- **Aprendizado:** a IA copia fielmente os defeitos do código-base. Auditar o que ela *herda* é tão importante quanto auditar o que ela inventa.

**Prompt refinado sugerido:** *"Contexto: site Bootstrap 5.3.3, HTML5 semântico, WCAG 2.1 AA. Crie um questionário de 15 itens (5 eixos x 3) em JavaScript Vanilla. Restrições: sem `innerHTML` com dados externos; contraste mínimo 4.5:1; cores via CSS Custom Properties; `aria-live` no progresso; `fieldset/legend` por pergunta. Saída: um arquivo `app.js` e o trecho HTML necessário."*

---

## Ficha 2: Design System, tema claro/escuro e acessibilidade (CSS3 + DOM + `localStorage`)

### 1. Engenharia de Prompt (entrada)
> "me fale o que falta para completar no arquivo zip e de acordo com o pdf e fazer o que falta por favor"

Anexos: `.zip` do projeto e o PDF da atividade (rubrica). ✏️ Prompt curto, que delega a análise à IA. Para a nota, a dupla deve substituir por um prompt técnico próprio (ver "prompt refinado" abaixo).

### 2. Resposta bruta da IA (situação de partida e primeira abordagem)
O CSS original tinha cores fixas (`body { background-color: #fcfbf7 }`, sem `:root`), e o HTML usava utilitários do Bootstrap como `bg-white`, `text-dark` e, nas chamadas finais, `btn btn-light ... texto-verde`. A primeira abordagem da IA foi mapear as cores para variáveis em `:root` e redefini-las em `[data-bs-theme="dark"]`.

### 3. Auditoria crítica ✏️
1. **Utilitários do Bootstrap não acompanham o tema:** `bg-white` continua branco no escuro; `text-dark` continua escuro. Resultado: cartões brancos em página escura.
2. **Regressão de contraste descoberta ao revisar:** com `texto-verde` redefinido para `#8fb3a3` no tema escuro, o botão `btn-light` das chamadas ficava com razão de **2.18:1** (texto claro em botão claro).
3. **Flash de tema errado (FOUC):** se o tema só fosse aplicado quando `theme.js` carrega no fim da página, a tela piscaria em claro antes de escurecer.
4. **`localStorage` pode lançar exceção** (modo privado, bloqueio de cookies) e quebrar a página inteira se não houver `try/catch`.
5. **Animações sem `prefers-reduced-motion`**, o que é um problema de acessibilidade para quem tem sensibilidade a movimento.
6. **Foco invisível:** o Bootstrap remove/atenua o contorno em alguns componentes; faltava `:focus-visible` consistente.
7. **Cabeçalhos:** o carrossel tinha 3 `<h1>` na home (o PDF exige um único `<h1>`).

### 4. Refatoração manual e justificativa ✏️
- `bg-white` → `.bg-surface` (usa `var(--surface-card)`); `text-dark` → regra própria com `var(--text-strong)`.
- `.bg-verde .btn-light { color: #3b5249 !important }` garante contraste nos dois temas.
- Script inline mínimo no `<head>` aplica o tema antes de pintar a página; `theme.js` só liga o botão e persiste a escolha, tudo em `try/catch`.
- `@media (prefers-reduced-motion: reduce)` desliga animações e transições; `:focus-visible` com contorno de 3px.
- Home: só o primeiro slide é `<h1>`; os demais viraram `<h2>` mantendo a classe `.hero-title` (mesmo visual).
- **Aprendizado:** variáveis CSS resolvem o tema do *seu* CSS, mas é preciso mapear o que o framework fixa por conta própria.

---

## Ficha 3: Dados reais para Chart.js (verificação de afirmações geradas)

### 1. Engenharia de Prompt (entrada)
O mesmo pedido da Ficha 2 (a rubrica exige "dados empíricos reais obtidos na pesquisa da dupla"). A IA usou busca na web e leitura do PDF primário da Deloitte.

### 2. Resposta bruta da IA (dados encontrados em fontes secundárias)
- "35% da Geração Z sente-se ansiosa ou estressada na maior parte do tempo" (blog que cita a Deloitte).
- "62% dos associados e 61% dos iniciantes relatam burnout por IA" (blog que cita a HBR).
- Manchete: "74% da Geração Z e dos millennials usam IA para aliviar o estresse no trabalho".

### 3. Auditoria crítica ✏️
1. **Número divergente da fonte primária:** o PDF da Deloitte (p. 34) informa **34%** para a Geração Z; os 35% vinham de um blog.
2. **Manchete que mistura dois dados:** no PDF, **74%** é o uso de IA no trabalho e **67%** é o uso de IA para lidar com estresse. A manchete juntou os dois.
3. **Afirmação não verificável:** o "62%/61%" só aparece em um blog, sem confirmação nas fontes primárias que foi possível consultar. Foi descartada.
4. **Limites metodológicos:** METR (n=16, ferramentas de início de 2025), BCG (autodeclarado, EUA), Deloitte (global, online). Os dados mostram associação, não causalidade.
5. **Risco de alucinação em URLs:** links foram conferidos em resultados de busca; não foram "lembrados" de memória.

### 4. Refatoração manual e justificativa ✏️
- Todos os números do objeto `DADOS` (`js/charts.js`) vêm da fonte primária ou de duas fontes independentes (BCG/HBR: SEJ e Exame para os valores por área).
- A seção "O que estes dados não permitem afirmar" (`dados.html`) expõe os limites de cada estudo.
- Cores dos gráficos lidas das variáveis CSS e redesenho no evento `temamudou`; `role="img"` + `aria-label` em cada `<canvas>`; animações desligadas com `prefers-reduced-motion`.
- Versão do Chart.js fixada (4.4.4) para evitar quebra por atualização.
- **Aprendizado:** número encontrado em busca ≠ número verificado. Sempre voltar à fonte primária.

---

### Checklist da dupla antes de entregar
- [ ] Reproduzi cada falha listada (DevTools, Lighthouse, leitor de tela ou verificador de contraste).
- [ ] Reescrevi os diagnósticos com minhas palavras e removi o que não confirmei.
- [ ] Os dois integrantes participaram (commits `docs:` de ambos).
- [ ] Ao menos 3 fichas completas (aqui há 3; adicionar outras mantendo o formato).
