(function () {
    'use strict';
    var CHAVE = 'tema-preferido';
    var raiz = document.documentElement;

    function ler() {
        try { return localStorage.getItem(CHAVE); } catch (e) { return null; }
    }
    function gravar(valor) {
        try { localStorage.setItem(CHAVE, valor); } catch (e) { /* modo privado: ignora */ }
    }
    function temaInicial() {
        var salvo = ler();
        if (salvo === 'dark' || salvo === 'light') return salvo;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    var botao = document.getElementById('temaToggle');

    function aplicar(tema) {
        raiz.setAttribute('data-bs-theme', tema);
        if (botao) {
            var escuro = tema === 'dark';
            botao.setAttribute('aria-pressed', String(escuro));
            botao.setAttribute('aria-label', escuro ? 'Ativar tema claro' : 'Ativar tema escuro');
            var icone = botao.querySelector('i');
            if (icone) icone.className = 'bi ' + (escuro ? 'bi-sun' : 'bi-moon-stars');
        }
        document.dispatchEvent(new CustomEvent('temamudou', { detail: tema }));
    }

    aplicar(temaInicial());

    if (botao) {
        botao.addEventListener('click', function () {
            var novo = raiz.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            gravar(novo);
            aplicar(novo);
        });
    }
})();