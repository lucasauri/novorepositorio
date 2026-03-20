// ======== CONSTANTES (não podem ser alteradas) ========
const EMPRESA = "Dev Store";
const VERSAO = "1.0";

// ======== VARIÁVEIS GLOBAIS (acessíveis em toda parte) ========
var usuariosRegistrados = 0;
var listaUsuarios = [];

// ======== FUNÇÃO 1: Cadastrar Usuário ========
function cadastrarUsuario(nome, email) {
  // Variáveis locais (existem apenas dentro desta função)
  var id = usuariosRegistrados + 1;
  var dataCadastro = new Date();
  
  console.log("=== CADASTRANDO USUÁRIO ===");
  console.log("Empresa: " + EMPRESA);
  console.log("Versão: " + VERSAO);
  console.log("ID do usuário: " + id);
  console.log("Nome: " + nome);
  console.log("Email: " + email);
  console.log("Data: " + dataCadastro);
  
  usuariosRegistrados++;
  listaUsuarios.push({ id: id, nome: nome, email: email });
}

// ======== FUNÇÃO 2: Exibir Total de Usuários ========
function exibirTotalUsuarios() {
  // Variável local
  var total = usuariosRegistrados;
  var mensagem = "Total de usuários cadastrados: ";
  
  console.log("=== RELATÓRIO DE USUÁRIOS ===");
  console.log(mensagem + total);
  console.log("Empresa: " + EMPRESA);
  
  if (total === 0) {
    console.log("Nenhum usuário cadastrado ainda!");
  } else {
    console.log("Status: Usuários ativos");
  }
}

// ======== FUNÇÃO 3: Listar Todos os Usuários ========
function listarTodosUsuarios() {
  // Variável local
  var contador = 0;
  
  console.log("=== LISTA COMPLETA DE USUÁRIOS ===");
  console.log("Sistema: " + EMPRESA + " v" + VERSAO);
  console.log("Total: " + listaUsuarios.length + " usuário(s)\n");
  
  for (contador = 0; contador < listaUsuarios.length; contador++) {
    var usuario = listaUsuarios[contador];
    console.log("ID: " + usuario.id + " | Nome: " + usuario.nome + " | Email: " + usuario.email);
  }
}

// ======== EXECUTANDO AS FUNÇÕES ========
console.log("\n");
cadastrarUsuario("João Silva", "joao@email.com");
console.log("\n");

cadastrarUsuario("Maria Santos", "maria@email.com");
console.log("\n");

cadastrarUsuario("Pedro Oliveira", "pedro@email.com");
console.log("\n");

exibirTotalUsuarios();
console.log("\n");

listarTodosUsuarios();
