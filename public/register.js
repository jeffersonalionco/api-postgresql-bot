const URL_DB = "127.0.0.1:3007";

function removeErrors() {
  const fields = ['nome', 'email', 'numeroBot', 'senha'];
  fields.forEach(id => {
    const input = document.getElementById(id);
    input.classList.remove('input-error');
  });
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePhone(numero) {
  const regex = /^(\+55\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$)|(\+1\s?\(?\d{3}\)?\s?\d{3}-?\d{4}$)|(\+52\s?\(?\d{2,3}\)?\s?\d{4,5}-?\d{4}$)/;
  return regex.test(numero);
}

// Função para formatar o telefone dinamicamente
function formatPhoneInput(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.startsWith('55')) {
    value = value.substring(2);
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    input.value = '+55 ' + value.trim().replace(/[-\s]+$/, '');
  } else if (value.startsWith('1')) {
    value = value.substring(1);
    value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '($1) $2-$3');
    input.value = '+1 ' + value.trim().replace(/[-\s]+$/, '');
  } else if (value.startsWith('52')) {
    value = value.substring(2);
    value = value.replace(/(\d{2,3})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    input.value = '+52 ' + value.trim().replace(/[-\s]+$/, '');
  } else {
    input.value = '+' + value;
  }
}

// Validação dinâmica de email
function validateEmailLive(input) {
  const value = input.value;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (regex.test(value)) {
    input.classList.remove('input-error');
  } else {
    input.classList.add('input-error');
  }
}

function handleRegister(event) {
  event.preventDefault();

  removeErrors();

  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const numeroBotInput = document.getElementById('numeroBot');
  const senhaInput = document.getElementById('senha');

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const numeroBot = numeroBotInput.value.trim();
  const senha = senhaInput.value.trim();

  let hasError = false;

  if (nome.length < 2) {
    nomeInput.classList.add('input-error');
    hasError = true;
  }

  if (!validateEmail(email)) {
    emailInput.classList.add('input-error');
    hasError = true;
  }

  if (!validatePhone(numeroBot)) {
    numeroBotInput.classList.add('input-error');
    hasError = true;
  }

  if (senha.length < 6) {
    senhaInput.classList.add('input-error');
    hasError = true;
  }

  if (hasError) {
    return;
  }

  fetch(`http://${URL_DB}/api/userAdmin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, numeroBot, senha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success === true) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = '/login';
      } else {
        alert('Erro: ' + data.message);
        window.location.reload();
      }
    })
    .catch(err => {
      console.log(err);
      alert('Erro ao cadastrar! ' + err);
    });
}

// Adicionar listeners ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const numeroBotInput = document.getElementById('numeroBot');
  const emailInput = document.getElementById('email');
  const form = document.querySelector('.register-form');

  numeroBotInput.addEventListener('input', () => formatPhoneInput(numeroBotInput));
  emailInput.addEventListener('input', () => validateEmailLive(emailInput));
  form.addEventListener('submit', handleRegister);
});
