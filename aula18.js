// Exemplo em JavaScript (Node.js ou navegador)

function calcularMedia(nota1, nota2) {
  return (nota1 + nota2) / 2;
}

function verificarAprovacao(nota1, nota2) {
  const media = calcularMedia(nota1, nota2);

  if (media >= 7) {
    return "aprovado";
  } else {
    return "reprovado";
  }
}

// Exemplo de uso:
const nota1 = 8.5;
const nota2 = 6.0;

console.log("Média:", calcularMedia(nota1, nota2));
console.log("Resultado:", verificarAprovacao(nota1, nota2));