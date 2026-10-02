// Os dados ficam apenas na memória (array).
// Se a página for atualizada, os livros cadastrados serão apagados.
const livros = [
  { titulo: "Dom Casmurro", autor: "Machado de Assis", genero: "Romance", ano: "1899", disponivel: true },
  { titulo: "O Hobbit", autor: "J. R. R. Tolkien", genero: "Fantasia", ano: "1937", disponivel: false }
];

const app = document.querySelector("#app");
const botoesMenu = document.querySelectorAll("nav button");

// Evita que texto digitado vire HTML
function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function marcarMenuAtivo(rota) {
  botoesMenu.forEach(botao => {
    botao.classList.toggle("ativo", botao.dataset.rota === rota);
  });
}

function irPara(rota) {
  marcarMenuAtivo(rota);

  if (rota === "inicio") mostrarInicio();
  if (rota === "cadastro") mostrarCadastro();
  if (rota === "lista") mostrarLista();
  if (rota === "sobre") mostrarSobre();
}

function mostrarInicio() {
  const emprestados = livros.filter(l => !l.disponivel).length;
  const disponiveis = livros.length - emprestados;

  app.innerHTML = `
    <h1>Bem-vindo à BiblioTEX</h1>
    <p>
      Cadastre os livros do acervo e controle quais estão disponíveis
      ou emprestados. A navegação acontece sem recarregar a página.
    </p>

    <div class="contador">
      Livros no acervo: <strong>${livros.length}</strong> |
      Disponíveis: <strong>${disponiveis}</strong> |
      Emprestados: <strong>${emprestados}</strong>
    </div>

    <div class="acoes">
      <button class="botao" id="btnCadastrar">Cadastrar livro</button>
      <button class="botao secundario" id="btnVerLivros">Ver meus livros</button>
    </div>
  `;

  document.querySelector("#btnCadastrar")
    .addEventListener("click", () => irPara("cadastro"));

  document.querySelector("#btnVerLivros")
    .addEventListener("click", () => irPara("lista"));
}

function mostrarCadastro() {
  app.innerHTML = `
    <h1>Cadastrar Livro</h1>

    <form id="formLivro">
      <div class="campo">
        <label for="titulo">Título</label>
        <input id="titulo" type="text" placeholder="Digite o título do livro" required />
      </div>

      <div class="campo">
        <label for="autor">Autor</label>
        <input id="autor" type="text" placeholder="Digite o autor" required />
      </div>

      <div class="campo">
        <label for="genero">Gênero</label>
        <input id="genero" type="text" placeholder="Ex.: Romance, Fantasia..." required />
      </div>

      <div class="campo">
        <label for="ano">Ano de publicação</label>
        <input id="ano" type="number" placeholder="Ex.: 2008" min="1" max="2100" required />
      </div>

      <button class="botao" type="submit">Salvar livro</button>
      <div id="mensagem"></div>
    </form>
  `;

  document.querySelector("#formLivro").addEventListener("submit", function (evento) {
    evento.preventDefault();

    livros.push({
      titulo: document.querySelector("#titulo").value.trim(),
      autor: document.querySelector("#autor").value.trim(),
      genero: document.querySelector("#genero").value.trim(),
      ano: document.querySelector("#ano").value,
      disponivel: true
    });

    document.querySelector("#mensagem").innerHTML =
      `<div class="mensagem">Livro cadastrado com sucesso.</div>`;

    evento.target.reset();
  });
}

function mostrarLista() {
  app.innerHTML = `
    <h1>Meus Livros</h1>
    <p>Os cards abaixo são criados dinamicamente pelo JavaScript a partir do array de livros.</p>
    <div id="conteudoLista"></div>
  `;

  renderizarLista();
}

function renderizarLista() {
  const conteudo = document.querySelector("#conteudoLista");

  if (livros.length === 0) {
    conteudo.innerHTML = `
      <div class="vazio">
        Nenhum livro cadastrado ainda.
      </div>
    `;
    return;
  }

  let cards = "";

  livros.forEach((livro, indice) => {
    cards += `
      <div class="card ${livro.disponivel ? "" : "emprestado"}">
        <div class="capa">${escapar(livro.titulo.charAt(0).toUpperCase())}</div>
        <div class="card-corpo">
          <h3>${escapar(livro.titulo)}</h3>
          <p>${escapar(livro.autor)}</p>
          <p>${escapar(livro.genero)} • ${escapar(livro.ano)}</p>
          <span class="status">${livro.disponivel ? "Disponível" : "Emprestado"}</span>
        </div>
        <div class="card-acoes">
          <button class="alterar" data-indice="${indice}">
            ${livro.disponivel ? "Emprestar" : "Devolver"}
          </button>
          <button class="excluir" data-indice="${indice}">Excluir</button>
        </div>
      </div>
    `;
  });

  conteudo.innerHTML = `<div class="grade">${cards}</div>`;

  document.querySelectorAll(".alterar").forEach(botao => {
    botao.addEventListener("click", function () {
      const indice = Number(this.dataset.indice);
      livros[indice].disponivel = !livros[indice].disponivel;
      renderizarLista();
    });
  });

  document.querySelectorAll(".excluir").forEach(botao => {
    botao.addEventListener("click", function () {
      const indice = Number(this.dataset.indice);
      livros.splice(indice, 1);
      renderizarLista();
    });
  });
}

function mostrarSobre() {
  app.innerHTML = `
    <h1>Sobre o projeto</h1>
    <p>
      A Bibliotex é uma Single Page Application (SPA) de Biblioteca de Livros feita por vittor santos de jesus,
      desenvolvida como atividade da disciplina de Front-end Frameworks.
    </p>
    <p>
      Existe apenas um arquivo HTML. Ao clicar nas opções do menu,
      o JavaScript modifica o conteúdo do elemento <strong>#app</strong>.
    </p>
    <p>
      O projeto demonstra cadastro em array, manipulação do DOM, eventos de clique,
      envio de formulário, listagem, alteração de status (disponível/emprestado)
      e exclusão de livros.
    </p>
  `;
}

botoesMenu.forEach(botao => {
  botao.addEventListener("click", () => {
    irPara(botao.dataset.rota);
  });
});

mostrarInicio();


