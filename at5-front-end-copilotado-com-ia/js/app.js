/* Questionário: Como está seu equilíbrio digital? */
(function () {
    'use strict';

    var form = document.getElementById('quizForm');
    if (!form) return; // só roda na página do questionário

    var ESCALA = [
        { rotulo: 'Nunca', valor: 0 },
        { rotulo: 'Raramente', valor: 1 },
        { rotulo: 'Frequentemente', valor: 2 },
        { rotulo: 'Sempre', valor: 3 }
    ];

    // Afirmações escritas de forma positiva: quanto maior a frequência, maior o equilíbrio.
    var EIXOS = [
        {
            id: 'tecnologia',
            titulo: 'Uso de tecnologia no cotidiano',
            icone: 'bi-phone',
            perguntas: [
                'Faço refeições sem olhar para o celular ou para a TV.',
                'Silencio ou desativo notificações que não são importantes.',
                'Fico longe das telas nos 30 minutos antes de dormir.'
            ],
            dicas: [
                'Escolha um momento do dia (como o almoço) para ficar sem telas.',
                'Revise os aplicativos que podem te notificar e mantenha só o essencial.',
                'Deixe o celular carregando longe da cama e use um despertador comum.'
            ],
            ok: 'Você usa a tecnologia com intenção. Continue atento aos momentos em que o uso vira piloto automático.'
        },
        {
            id: 'pausas',
            titulo: 'Pausas durante o trabalho ou estudo',
            icone: 'bi-cup-hot',
            perguntas: [
                'Faço pausas curtas a cada uma ou duas horas de trabalho ou estudo.',
                'Nas pausas, me afasto das telas (alongo, bebo água, caminho).',
                'Faço as refeições longe da minha mesa de trabalho ou estudo.'
            ],
            dicas: [
                'Experimente blocos de 25 minutos de foco com 5 minutos de pausa.',
                'Use as pausas para olhar para longe, se movimentar e se hidratar, em vez de rolar o feed.',
                'Programe um lembrete para levantar da cadeira ao menos uma vez por hora.'
            ],
            ok: 'Suas pausas estão em boa forma. Elas ajudam o foco e a recuperação ao longo do dia.'
        },
        {
            id: 'produtividade',
            titulo: 'Pressão por produtividade',
            icone: 'bi-speedometer2',
            perguntas: [
                'Consigo encerrar o dia me sentindo bem, mesmo sem ter feito tudo da lista.',
                'Descanso sem sentir culpa por "não estar produzindo".',
                'Evito me comparar com a rotina produtiva de outras pessoas nas redes.'
            ],
            dicas: [
                'Defina até 3 prioridades por dia e comemore quando cumpri-las.',
                'Lembre que o descanso faz parte do desempenho, não é prêmio por merecimento.',
                'Reduza o consumo de conteúdos de "rotina perfeita" que geram comparação.'
            ],
            ok: 'Você mantém uma relação saudável com a produtividade. Continue valorizando o que já realizou.'
        },
        {
            id: 'limites',
            titulo: 'Limites entre trabalho e descanso',
            icone: 'bi-door-closed',
            perguntas: [
                'Deixo de responder mensagens de trabalho ou estudo fora do horário combinado.',
                'Tenho horários definidos para começar e terminar o dia.',
                'Reservo momentos de lazer ou convivência sem pensar nas pendências.'
            ],
            dicas: [
                'Defina um horário de encerramento e crie um ritual para marcar o fim do expediente.',
                'Combine com colegas, professores ou gestores quando você costuma responder mensagens.',
                'Se possível, mantenha um espaço de trabalho separado do espaço de descanso.'
            ],
            ok: 'Seus limites estão bem definidos. Eles protegem seu descanso e sua saúde no longo prazo.'
        },
        {
            id: 'ia',
            titulo: 'Uso de inteligência artificial',
            icone: 'bi-robot',
            perguntas: [
                'Uso a IA como apoio, mas reviso e decido por conta própria.',
                'Consigo realizar tarefas importantes sem depender da IA para tudo.',
                'Encaro a IA com curiosidade, sem pânico de ser substituído(a) ou ficar para trás.'
            ],
            dicas: [
                'Comece pela sua própria ideia e use a IA para revisar, ampliar ou testar o raciocínio.',
                'Confira informações importantes em fontes confiáveis antes de usá-las.',
                'Aprenda uma ferramenta de cada vez, no seu ritmo, e invista também em habilidades humanas.'
            ],
            ok: 'Você usa a IA de forma equilibrada. Mantenha o hábito de revisar e de exercitar o próprio raciocínio.'
        }
    ];

    var TOTAL = EIXOS.reduce(function (n, e) { return n + e.perguntas.length; }, 0);

    var container = document.getElementById('quizContainer');
    var progressBar = document.getElementById('progressBar');
    var progressTrack = document.getElementById('progressTrack');
    var progressLabel = document.getElementById('progressLabel');
    var alertBox = document.getElementById('quizAlert');
    var resultSection = document.getElementById('resultSection');
    var quizSection = document.getElementById('quizSection');

    function nome(eixoIdx, perguntaIdx) {
        return 'q_' + eixoIdx + '_' + perguntaIdx;
    }

    // ---------- Renderização ----------
    function render() {
        var html = '';
        var numero = 0;
        EIXOS.forEach(function (eixo, i) {
            html += '<div class="card-custom bg-white shadow-sm p-4 p-md-5 mb-4">';
            html += '<div class="d-flex align-items-center gap-3 mb-4">';
            html += '<span class="icon-circle"><i class="bi ' + eixo.icone + '"></i></span>';
            html += '<div><span class="eyebrow">EIXO ' + (i + 1) + ' DE ' + EIXOS.length + '</span>';
            html += '<h2 class="h5 fw-bold mb-0 mt-1">' + eixo.titulo + '</h2></div></div>';

            eixo.perguntas.forEach(function (texto, j) {
                numero++;
                var n = nome(i, j);
                html += '<fieldset class="mb-4" data-pergunta="' + n + '">';
                html += '<legend class="fs-6 fw-semibold mb-3" style="line-height: 1.5;">' + numero + '. ' + texto + '</legend>';
                html += '<div class="d-flex flex-wrap gap-2">';
                ESCALA.forEach(function (op) {
                    var id = n + '_' + op.valor;
                    html += '<input type="radio" class="btn-check" name="' + n + '" id="' + id + '" value="' + op.valor + '" autocomplete="off">';
                    html += '<label class="btn btn-outline-olive rounded-pill px-3 py-2 small" for="' + id + '">' + op.rotulo + '</label>';
                });
                html += '</div></fieldset>';
            });

            html += '</div>';
        });
        container.innerHTML = html;
    }

    // ---------- Progresso ----------
    function respondidas() {
        return form.querySelectorAll('input[type="radio"]:checked').length;
    }

    function atualizarProgresso() {
        var n = respondidas();
        var pct = Math.round((n / TOTAL) * 100);
        progressBar.style.width = pct + '%';
        progressTrack.setAttribute('aria-valuenow', pct);
        progressLabel.textContent = n + ' de ' + TOTAL + ' respondidas';
    }

    form.addEventListener('change', function (e) {
        atualizarProgresso();
        var fs = e.target.closest('fieldset');
        if (fs) fs.classList.remove('pergunta-nao-respondida');
        if (respondidas() === TOTAL) alertBox.classList.add('d-none');
    });

    // ---------- Resultado ----------
    function nivelGeral(p) {
        if (p >= 75) return {
            titulo: 'Equilíbrio saudável',
            msg: 'Seus hábitos indicam uma relação bastante equilibrada com a tecnologia e o trabalho. Mantenha o que funciona e fique atento aos eixos com mais espaço para melhora.'
        };
        if (p >= 50) return {
            titulo: 'Atenção moderada',
            msg: 'Você tem bons hábitos, mas alguns pontos da rotina podem estar pesando mais do que parece. Pequenos ajustes nos eixos abaixo podem trazer alívio.'
        };
        return {
            titulo: 'Hora de ajustar a rotina',
            msg: 'Seus resultados sugerem que a vida digital pode estar sobrecarregando você. A boa notícia é que mudanças pequenas e graduais já fazem diferença. Comece por um eixo só.'
        };
    }

    function corPorPct(p) {
        if (p >= 75) return '#3b5249';
        if (p >= 50) return '#b58a3c';
        return '#a65b4b';
    }

    function rotuloPct(p) {
        if (p >= 75) return 'Equilibrado';
        if (p >= 50) return 'Atenção';
        return 'Precisa de cuidado';
    }

    function calcular() {
        var totalPontos = 0;
        var porEixo = EIXOS.map(function (eixo, i) {
            var soma = 0;
            eixo.perguntas.forEach(function (_, j) {
                var marcado = form.querySelector('input[name="' + nome(i, j) + '"]:checked');
                soma += parseInt(marcado.value, 10);
            });
            totalPontos += soma;
            var max = eixo.perguntas.length * 3;
            return { eixo: eixo, pct: Math.round((soma / max) * 100) };
        });
        return { pct: Math.round((totalPontos / (TOTAL * 3)) * 100), porEixo: porEixo };
    }

    function mostrarResultado() {
        var r = calcular();
        var nivel = nivelGeral(r.pct);

        document.getElementById('resultScore').textContent = r.pct + '%';
        document.getElementById('resultLevel').textContent = nivel.titulo;
        document.getElementById('resultMessage').textContent = nivel.msg;

        // Barras por eixo
        var barras = '';
        r.porEixo.forEach(function (item, idx) {
            var cor = corPorPct(item.pct);
            barras += '<div class="' + (idx < r.porEixo.length - 1 ? 'mb-4' : '') + '">';
            barras += '<div class="d-flex justify-content-between align-items-baseline mb-1">';
            barras += '<span class="fw-semibold small"><i class="bi ' + item.eixo.icone + ' me-2 texto-verde"></i>' + item.eixo.titulo + '</span>';
            barras += '<span class="small fw-semibold" style="color:' + cor + '">' + item.pct + '% · ' + rotuloPct(item.pct) + '</span></div>';
            barras += '<div class="progress progress-olive" role="progressbar" aria-label="' + item.eixo.titulo + '" aria-valuenow="' + item.pct + '" aria-valuemin="0" aria-valuemax="100">';
            barras += '<div class="progress-bar" style="width:' + item.pct + '%; background-color:' + cor + '"></div></div></div>';
        });
        document.getElementById('resultBars').innerHTML = barras;

        // Dicas: eixos abaixo de 75%, do mais baixo ao mais alto. Se todos estiverem bem, parabeniza.
        var precisam = r.porEixo.filter(function (i) { return i.pct < 75; })
            .sort(function (a, b) { return a.pct - b.pct; });
        var dicas = '';
        if (precisam.length === 0) {
            dicas += '<div class="col-12"><div class="card-custom bg-white shadow-sm p-4">';
            dicas += '<h4 class="h6 fw-bold texto-verde mb-2"><i class="bi bi-stars me-2"></i>Parabéns pelo equilíbrio!</h4>';
            dicas += '<p class="text-secondary small mb-0" style="line-height: 1.7;">Todos os eixos estão em bom nível. Revisite o questionário de tempos em tempos, principalmente em fases de mais pressão no trabalho ou nos estudos.</p>';
            dicas += '</div></div>';
        } else {
            precisam.forEach(function (item) {
                dicas += '<div class="col-md-6"><div class="card-custom bg-white shadow-sm p-4 h-100">';
                dicas += '<span class="icon-circle mb-3"><i class="bi ' + item.eixo.icone + '"></i></span>';
                dicas += '<h4 class="h6 fw-bold mb-3">' + item.eixo.titulo + '</h4>';
                dicas += '<ul class="lista-check text-secondary small mb-0" style="line-height: 1.6;">';
                item.eixo.dicas.forEach(function (d) { dicas += '<li>' + d + '</li>'; });
                dicas += '</ul></div></div>';
            });
            var fortes = r.porEixo.filter(function (i) { return i.pct >= 75; });
            if (fortes.length) {
                dicas += '<div class="col-12"><p class="small text-secondary mb-0"><i class="bi bi-check-circle texto-verde me-1"></i>Pontos fortes: ' +
                    fortes.map(function (i) { return i.eixo.titulo.toLowerCase(); }).join(', ') + '. Continue assim!</p></div>';
            }
        }
        document.getElementById('resultTips').innerHTML = dicas;

        resultSection.classList.remove('d-none');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---------- Envio ----------
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var faltando = [];
        EIXOS.forEach(function (eixo, i) {
            eixo.perguntas.forEach(function (_, j) {
                var n = nome(i, j);
                var fs = form.querySelector('fieldset[data-pergunta="' + n + '"]');
                if (!form.querySelector('input[name="' + n + '"]:checked')) {
                    faltando.push(fs);
                    fs.classList.add('pergunta-nao-respondida');
                } else {
                    fs.classList.remove('pergunta-nao-respondida');
                }
            });
        });

        if (faltando.length) {
            alertBox.classList.remove('d-none');
            faltando[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        alertBox.classList.add('d-none');
        mostrarResultado();
    });

    // ---------- Refazer ----------
    document.getElementById('btnRefazer').addEventListener('click', function () {
        form.reset();
        atualizarProgresso();
        resultSection.classList.add('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    render();
    atualizarProgresso();
})();
