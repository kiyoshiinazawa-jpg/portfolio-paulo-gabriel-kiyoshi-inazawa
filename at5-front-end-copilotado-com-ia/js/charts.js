(function () {
    'use strict';
    if (typeof Chart === 'undefined') return;
    var DADOS = {
        metr: {
            fonte: 'METR (2025), ensaio randomizado, n=16 desenvolvedores, 246 tarefas',
            rotulos: ['Expectativa antes', 'Percepção depois', 'Resultado medido'],
            valores: [-24, -20, 19]            // variação % no tempo de conclusão
        },
        deloitte: {
            fonte: 'Deloitte Global (2026), Geração Z, 44 países',
            rotulos: ['Usam IA no trabalho', 'Usam IA para lidar com estresse', 'Relatam fadiga digital',
                      'Sentem-se esgotados (burnout)', 'Ansiosos ou estressados na maior parte do tempo',
                      'Veem gestores orientando o uso de IA'],
            valores: [74, 67, 58, 48, 34, 20],
            tipos:   ['ok', 'ok', 'danger', 'danger', 'danger', 'warn']
        },
        brainFry: {
            fonte: 'BCG e HBR (2026), n=1.488 trabalhadores nos EUA',
            rotulos: ['Relatam fadiga mental por IA', 'Não relatam'],
            valores: [14, 86]
        },
        areas: {
            fonte: 'BCG e HBR (2026), por área de atuação',
            rotulos: ['Jurídico', 'Média geral', 'Marketing'],
            valores: [6, 14, 26]
        }
    };
    var graficos = [];
    var reduzir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function v(nome) {
        return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
    }
    function desenhar() {
        graficos.forEach(function (g) { g.destroy(); });
        graficos = [];
        var cores = { ok: v('--color-ok'), warn: v('--color-warn'), danger: v('--color-danger'), primary: v('--color-primary') };
        var texto = v('--text-soft');
        var grade = v('--border-color');
        var superficie = v('--surface-card');
        Chart.defaults.font.family = v('--font-body');
        Chart.defaults.color = texto;
        Chart.defaults.animation = reduzir ? false : { duration: 700 };
        var eixoPct = function (min, max) {
            return {
                min: min, max: max,
                grid: { color: grade },
                ticks: { color: texto, callback: function (val) { return val + '%'; } }
            };
        };
        var semGrade = { grid: { display: false }, ticks: { color: texto } };
        function criar(id, config) {
            var el = document.getElementById(id);
            if (el) graficos.push(new Chart(el, config));
        }
        criar('graficoMetr', {
            type: 'bar',
            data: {
                labels: DADOS.metr.rotulos,
                datasets: [{
                    label: 'Variação no tempo (%)',
                    data: DADOS.metr.valores,
                    backgroundColor: [cores.ok, cores.ok, cores.danger],
                    borderRadius: 6
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: { y: eixoPct(-30, 25), x: semGrade },
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: function (c) {
                        var n = c.parsed.y;
                        return (n > 0 ? '+' : '') + n + '% no tempo (' + (n > 0 ? 'mais lento' : 'mais rápido') + ')';
                    } } }
                }
            }
        });
        criar('graficoDeloitte', {
            type: 'bar',
            data: {
                labels: DADOS.deloitte.rotulos,
                datasets: [{
                    label: '% da Geração Z',
                    data: DADOS.deloitte.valores,
                    backgroundColor: DADOS.deloitte.tipos.map(function (t) { return cores[t]; }),
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                maintainAspectRatio: false,
                scales: { x: eixoPct(0, 100), y: { grid: { display: false }, ticks: { color: texto, font: { size: 11 } } } },
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: function (c) { return c.parsed.x + '% da Geração Z'; } } }
                }
            }
        });
        criar('graficoBrainFry', {
            type: 'doughnut',
            data: {
                labels: DADOS.brainFry.rotulos,
                datasets: [{
                    data: DADOS.brainFry.valores,
                    backgroundColor: [cores.danger, grade],
                    borderColor: superficie,
                    borderWidth: 3
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: texto, padding: 16 } },
                    tooltip: { callbacks: { label: function (c) { return c.label + ': ' + c.parsed + '%'; } } }
                }
            }
        });
        criar('graficoAreas', {
            type: 'bar',
            data: {
                labels: DADOS.areas.rotulos,
                datasets: [{
                    label: '% com fadiga mental por IA',
                    data: DADOS.areas.valores,
                    backgroundColor: [cores.ok, cores.warn, cores.danger],
                    borderRadius: 6
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: { y: eixoPct(0, 30), x: semGrade },
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: function (c) { return c.parsed.y + '% relatam fadiga mental'; } } }
                }
            }
        });
    }
    desenhar();
    document.addEventListener('temamudou', desenhar);   // redesenha com as cores do novo tema
})();