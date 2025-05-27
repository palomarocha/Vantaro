document.addEventListener("DOMContentLoaded", function () {
    // Cadastro
    document.querySelector(".register-form")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        if (name && email && password) {
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userPassword", password);

            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html";
        } else {
            alert("Preencha todos os campos!");
        }
    });

    // Login
    document.querySelector(".login-form")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        let storedEmail = localStorage.getItem("userEmail");
        let storedPassword = localStorage.getItem("userPassword");

        if (email === storedEmail && password === storedPassword) {
            alert("Login bem-sucedido!");
            window.location.href = "carros.html";
        } else {
            alert("E-mail ou senha incorretos!");
        }
    });

    // Scroll Header
    window.onscroll = function () {
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            if (window.scrollY > 50) {
                headerContent.classList.add('scrolled');
                headerContent.style.backgroundColor = 'rgb(13, 72, 114)';
            } else {
                headerContent.classList.remove('scrolled');
                headerContent.style.backgroundColor = 'transparent';
            }
        }
    };

    // Carregar carros e ativar filtros
    carregarCarros();
    document.querySelectorAll('select, #busca').forEach(el => {
        el.addEventListener('input', aplicarFiltros);
    });
});


let carros = [];

async function carregarCarros() {
    const res = await fetch('carros.json');
    carros = await res.json();
    preencherFiltros();
    mostrarCarros(carros);
}

function preencherFiltros() {
    const cores = new Set();
    const tipos = new Set();
    const precos = new Set();
    const anos = new Set();
    const transmissoes = new Set();

    carros.forEach(carro => {
        cores.add(carro.cor);
        tipos.add(carro.tipo);
        precos.add(carro.preco <= 25000 ? "Até $25k" : carro.preco <= 40000 ? "$25k - $40k" : "Acima de $40k");
        anos.add(carro.ano);
        transmissoes.add(carro.transmissao);
    });

    preencherSelect('filter-color', [...cores], 'Cor');
    preencherSelect('filter-type', [...tipos], 'Tipo');
    preencherSelect('filter-price', [...precos], 'Preço');
    preencherSelect('filter-year', [...anos].sort((a, b) => b - a), 'Ano');
    preencherSelect('filter-transmission', [...transmissoes], 'Transmissão');
}

function preencherSelect(id, opcoes, textoPadrao) {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = '';

    const optionPadrao = document.createElement('option');
    optionPadrao.value = '';
    optionPadrao.textContent = textoPadrao;
    select.appendChild(optionPadrao);

    opcoes.forEach(op => {
        const option = document.createElement('option');
        option.value = op;
        option.textContent = op;
        select.appendChild(option);
    });
}

function mostrarCarros(lista) {
    const container = document.getElementById('container-carros');
    if (!container) return;

    container.innerHTML = '';
    lista.forEach(carro => {
        const card = document.createElement('div');
        card.className = 'carro-card';
        card.innerHTML = `
            <img src="${carro.imagem}" alt="${carro.modelo}">
            <div class="carro-info">
                <h2>${carro.modelo}</h2>
                <p><strong>${carro.preco.toLocaleString('pt-BR', {
                    style: 'currency', currency: 'BRL'
                })}</strong></p>
                <p class="detalhes-carro">
                    <span>${carro.ano}</span>
                    <span class="separador">•</span>
                    <span>${carro.cor}</span>
                    <span class="separador">•</span>
                    <span>${carro.transmissao}</span>
                </p>
            </div>
            <div class="contato">Entrar em contato</div>
        `;
        container.appendChild(card);
    });
}

function aplicarFiltros() {
    const cor = document.getElementById('filter-color')?.value;
    const tipo = document.getElementById('filter-type')?.value;
    const preco = document.getElementById('filter-price')?.value;
    const ano = document.getElementById('filter-year')?.value;
    const transmissao = document.getElementById('filter-transmission')?.value;
    const busca = document.getElementById('busca')?.value.toLowerCase();

    const filtrados = carros.filter(c => {
        return (!cor || c.cor === cor) &&
            (!tipo || c.tipo === tipo) &&
            (!preco || (preco === "Até $25k" && c.preco <= 25000) ||
                (preco === "$25k - $40k" && c.preco > 25000 && c.preco <= 40000) ||
                (preco === "Acima de $40k" && c.preco > 40000)) &&
            (!ano || c.ano == ano) &&
            (!transmissao || c.transmissao === transmissao) &&
            (!busca || c.modelo.toLowerCase().includes(busca));
    });

    mostrarCarros(filtrados);

}