import { Produto, Bebida, Prato, Venda } from "./models.js";

const controleProdutos = document.querySelector(
  "#controle-produtos",
) as HTMLDivElement;
const btnCadastrarProduto = document.querySelector(
  "#btn-cadastrar",
) as HTMLButtonElement;
const formCadastraProduto = document.querySelector(
  "#form-produtos",
) as HTMLFormElement;
const InputNomeProduto = document.querySelector(
  "#nome-produtos",
) as HTMLInputElement;
const InputImgUrl = document.querySelector("#imgURL") as HTMLInputElement;
const previewContainer = document.querySelector(
  "#preview-container",
) as HTMLDivElement;
const imgPreview = document.querySelector("#imgPreview") as HTMLImageElement;
const TextareaDescricaoProduto = document.querySelector(
  "#descricao-produtos",
) as HTMLTextAreaElement;
const contadorDescricao = document.querySelector(
  "#contador-descricao",
) as HTMLSpanElement;
const inputPrecoProduto = document.querySelector(
  "#preco-produtos",
) as HTMLInputElement;
const produtoSelecionado = document.querySelectorAll('input[name="produto"]');
const divAlcoolico = document.querySelector("#alcoolico") as HTMLDivElement;
const opcaoAlcoolico = document.querySelectorAll('input[name="alcoolico"]');

const btnSalvarProduto = document.querySelector(
  "#btn-salvar",
) as HTMLButtonElement;
const btnCancelar = document.querySelector(
  "#btn-cancelar",
) as HTMLButtonElement;

const divTituloBebida = document.querySelector(
  "#titulo-bebida",
) as HTMLDivElement;
const divTituloLanche = document.querySelector(
  "#titulo-lanche",
) as HTMLDivElement;
const gridCardapioBebida = document.querySelector(
  ".grid-cardapio-bebida",
) as HTMLDivElement;
const gridCardapioLanche = document.querySelector(
  ".grid-cardapio-lanche",
) as HTMLDivElement;

const divListaVendas = document.querySelector(
  "#lista-vendas",
) as HTMLDivElement;
const pMensagem = document.querySelector(
  "#pedido-vazio",
) as HTMLParagraphElement;
const spanTotalDiario = document.querySelector(
  "#total-diario",
) as HTMLSpanElement;
const spanTotalPedido = document.querySelector(
  "#total-pedido",
) as HTMLSpanElement;
const btnFecharPedido = document.querySelector(
  "#fechar-pedido",
) as HTMLButtonElement;

let urlImagemSelecionada: string;
let cardapioCompleto = JSON.parse(localStorage.getItem("cardapio_db") || "[]");
let produto: Produto;
let ehAlcoolico: boolean | undefined;
let tipoProduto: string;
let pedido: Venda[] = [];
let totalPedido: number;

btnCadastrarProduto.addEventListener("click", () => {
  controleProdutos.style.display = "flex";
});

function previewImg() {}

function falhaCarregarImg() {
  imgPreview.style.display = "none";
  if (!document.getElementById("erro-msg")) {
    const erro = document.createElement("p");
    erro.id = "erro-msg";
    erro.style.color = "red";
    erro.textContent = "Erro ao carregar a imagem.";
    previewContainer.appendChild(erro);
  }
}

InputImgUrl.addEventListener("change", (e: Event) => {
  const target = e.target as HTMLInputElement;
  const previewImg = document.getElementById("imgPreview") as HTMLImageElement;
  const previewContainer = document.getElementById(
    "preview-container",
  ) as HTMLElement;
  const erroExistente = document.getElementById("erro-msg");
  if (erroExistente) erroExistente.remove();
  if (target.files && target.files[0]) {
    const arquivo = target.files[0];
    urlImagemSelecionada = URL.createObjectURL(arquivo); // 3. Exibe o Preview
    previewImg.src = urlImagemSelecionada;
    previewContainer.style.display = "block";
    previewImg.style.display = "block";
  } else {
    previewContainer.style.display = "none";
  }
});

imgPreview.addEventListener("error", falhaCarregarImg);

TextareaDescricaoProduto.addEventListener("input", () => {
  contadorDescricao.textContent = `Caracteres restantes: ${(
    100 - TextareaDescricaoProduto.value.length
  ).toString()}`;
});

produtoSelecionado.forEach((opcao) => {
  opcao.addEventListener("change", (e) => {
    const radioProduto = document.querySelector(
      'input[name="produto"]:checked',
    ) as HTMLInputElement;
    tipoProduto = radioProduto.value;
    if (tipoProduto === "bebida") {
      divAlcoolico.style.display = "block";
    } else {
      opcaoAlcoolico.forEach((radio) => {
        (radio as HTMLInputElement).checked = false;
      });
      ehAlcoolico = false;
      divAlcoolico.style.display = "none";
    }
  });
});

opcaoAlcoolico.forEach((opcao) => {
  opcao.addEventListener("change", (e) => {
    const radioAlcoolico = document.querySelector(
      'input[name="alcoolico"]:checked',
    ) as HTMLInputElement;
    let tipoAlcoolico: string = radioAlcoolico.value;
    if (tipoAlcoolico === "sim-alcoolico") {
      ehAlcoolico = true;
    } else {
      ehAlcoolico = false;
    }
  });
});

btnSalvarProduto.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    !InputNomeProduto.value.trim() ||
    imgPreview.src === "" ||
    !TextareaDescricaoProduto.value.trim() ||
    !inputPrecoProduto.value ||
    !produtoSelecionado
  ) {
    alert(
      "Por favor, preencha todos os campos e selecione o tipo antes de salvar.",
    );
    return;
  } else {
    if (tipoProduto === "bebida" && ehAlcoolico === undefined) {
      alert("Para bebidas selecionar a opão alcoólico.");
      return;
    }
  }

  if (Number(inputPrecoProduto.value) < 0) {
    alert("Insira um valor válido.");
  }

  if (tipoProduto === "bebida") {
    produto = new Bebida(
      InputNomeProduto.value,
      urlImagemSelecionada,
      TextareaDescricaoProduto.value,
      Number(inputPrecoProduto.value),
      tipoProduto,
      ehAlcoolico!,
    );
  } else {
    produto = new Prato(
      InputNomeProduto.value,
      urlImagemSelecionada,
      TextareaDescricaoProduto.value,
      Number(inputPrecoProduto.value),
      tipoProduto,
    );
  }

  cardapioCompleto.push(produto);
  localStorage.setItem("cardapio_db", JSON.stringify(cardapioCompleto));
  alert("Produto salvo com sucesso!");
  fecharFormulario();
  listarCards();
});

function fecharFormulario() {
  formCadastraProduto.reset();
  tipoProduto = "";
  ehAlcoolico = undefined;
  divAlcoolico.style.display = "none";
  previewContainer.style.display = "none";
  contadorDescricao.textContent = "100";
  previewContainer.style.display = "none";
  controleProdutos.style.display = "none";
}

btnCancelar.addEventListener("click", fecharFormulario);

function excluirprodutos(index: number) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    cardapioCompleto.splice(index, 1);
    localStorage.setItem("cardapio_db", JSON.stringify(cardapioCompleto));
    listarCards();
  }
}

function listarCards(lista: Produto[] = cardapioCompleto) {
  gridCardapioBebida.innerHTML = "";
  gridCardapioLanche.innerHTML = "";
  divTituloBebida.innerHTML = "";
  divTituloLanche.innerHTML = "";
  const tituloBebida = document.createElement("div");
  tituloBebida.classList.add("titulo");
  const h1Bebida = document.createElement("h1");
  h1Bebida.textContent = "BEBIDAS";
  tituloBebida.appendChild(h1Bebida);
  divTituloBebida.appendChild(tituloBebida);
  const tituloLanche = document.createElement("div");
  tituloLanche.classList.add("titulo");
  const h1Lanche = document.createElement("h1");
  h1Lanche.textContent = "PRATOS";
  tituloLanche.appendChild(h1Lanche);
  divTituloLanche.appendChild(tituloLanche);

  lista.forEach((produto, index) => {
    const card = document.createElement("div");
    card.classList.add("card-produto");
    card.innerHTML = produto.gerarHTML();

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir Produto";
    btnExcluir.classList.add("btn");
    btnExcluir.onclick = () => excluirprodutos(index);
    card.appendChild(btnExcluir);

    const btnAdicionarPedido = document.createElement("button");
    btnAdicionarPedido.textContent = "Incluir Pedido";
    btnAdicionarPedido.classList.add("btn");
    btnAdicionarPedido.onclick = () => adicionarNoPedido(index);
    card.appendChild(btnAdicionarPedido);

    if (produto.tipo === "bebida") {
      gridCardapioBebida.appendChild(card);
    } else {
      gridCardapioLanche.appendChild(card);
    }
  });
}

function adicionarNoPedido(index: number) {
  const itemSelecionado = cardapioCompleto[index];

  const itemTemNoPedido = pedido.find((p) => p.nome === itemSelecionado.nome);
  if (itemTemNoPedido) {
    itemTemNoPedido.adicionarUnidade();
  } else {
    const vendaAtual = new Venda(
      itemSelecionado.nome,
      1,
      itemSelecionado.calcularPrecoFinal(),
    );
    pedido.push(vendaAtual);
  }
  listarPedido();
}

function listarPedido() {
  if (pedido.length === 0) {
    divListaVendas.innerHTML = "";
    pMensagem.style.display = "block";
    btnFecharPedido.disabled = true;
  } else {
    pMensagem.style.display = "none";
    btnFecharPedido.disabled = false;
    divListaVendas.innerHTML = "";
    pedido.forEach((item, index) => {
      const divItensPedido = document.createElement("div");
      divItensPedido.classList.add("itens-pedido");
      divItensPedido.innerHTML = `
      <div class="listagem">
        <p>${item.nome}</p>
      </div>
      <div class="listagem">
        <p>Qtd: ${Number(item.quantidade)}</p>
      </div>
      <div>
        <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>        
      </div>
      `;
      const btnRemover = document.createElement("button");
      btnRemover.textContent = "X";
      btnRemover.classList.add("btn-remover");
      btnRemover.onclick = () => removerItemPedido(index);
      divItensPedido.appendChild(btnRemover);
      divListaVendas.appendChild(divItensPedido);
    });
  }
  totalPedido = pedido.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );
  spanTotalPedido.textContent = `R$ ${totalPedido.toFixed(2)}`;
}

function removerItemPedido(index: number) {
  pedido.splice(index, 1);
  listarPedido();
}

btnFecharPedido.addEventListener("click", (e) => {
  e.preventDefault();
  Venda.vendasAcumuladas(totalPedido);
  spanTotalDiario.textContent = `R$ ${Venda.vendasTotaisDiaria.toFixed(2)}`;
  pedido = [];
  totalPedido = 0;
  listarPedido();
  alert("Pedido finalizado com sucesso!");
});

formCadastraProduto.addEventListener("reset", () => {
  tipoProduto = "";
  ehAlcoolico = undefined;
  divAlcoolico.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  cardapioCompleto = cardapioCompleto.map((item: any) => {
    if (item.tipo === "bebida") {
      return new Bebida(
        item.nome,
        item.imagem,
        item.descricao,
        item.preco,
        item.tipo,
        item._alcoolico,
      );
    }
    return new Prato(
      item.nome,
      item.imagem,
      item.descricao,
      item.preco,
      item.tipo,
    );
  });
  listarCards();
  listarPedido();
});
