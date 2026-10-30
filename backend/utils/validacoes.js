export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizarTexto(valor) {
  return String(valor ?? '').trim();
}

export function validarSenha(senha) {
  return typeof senha === 'string' && senha.length >= 8 && senha.length <= 72;
}

export function decimalParaNumero(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

export function gerarId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
