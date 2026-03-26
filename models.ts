interface IProduto {
  readonly id: string;
  nome: string;
  imagem: string;
  descricao: string;
  preco: number;
  tipo: string;
  calcularPrecoFinal(): number;
  gerarHTML(): string;
}

export class Produto implements IProduto {
  readonly id: string;
  constructor(
    public nome: string,
    public imagem: string,
    public descricao: string,
    public preco: number,
    public tipo: string,
  ) {
    this.id = Date.now().toString();
  }

  calcularPrecoFinal(): number {
    return this.preco;
  }

  gerarHTML(): string {
    return `
      <h2 class="nome-produto">${this.nome}</h2>
      <img src="${this.imagem}" class="img-produto" alt="${this.descricao}">
      <p class="descricao-produto">${this.descricao}</p>
      <p class="preco-produto">R$ ${this.calcularPrecoFinal().toFixed(2)}</p>
      <small>*Taxas e impostos inclusos</small>
    `;
  }
}

export class Bebida extends Produto {
  constructor(
    nome: string,
    imagem: string,
    descricao: string,
    preco: number,
    tipo: string,
    private _alcoolico: boolean,
  ) {
    super(nome, imagem, descricao, preco, tipo);
  }
  override calcularPrecoFinal(): number {
    const imposto = this._alcoolico ? 1.15 : 1.05;
    return this.preco * imposto;
  }
}

export class Prato extends Produto {
  override calcularPrecoFinal(): number {
    const taxaEmbalagem = 3;
    return this.preco + taxaEmbalagem;
  }
}

export class Venda {
  private static _vendasTotaisDiarias: number = 0;
  constructor(
    private _nome: string,
    private _quantidade: number,
    private _preco: number,
  ) {}
  get nome() {
    return this._nome;
  }
  get preco() {
    return this._preco;
  }
  get quantidade() {
    return this._quantidade;
  }

  public adicionarUnidade(): void {
    this._quantidade++;
  }

  static vendasAcumuladas(valor: number): void {
    Venda._vendasTotaisDiarias += valor;
  }

  static get vendasTotaisDiaria(): number {
    return Venda._vendasTotaisDiarias;
  }
}
