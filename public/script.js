const URL_DB = "127.0.0.1:3007"
const token = localStorage.getItem('token');

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type');
    passwordInput.setAttribute('type', type === 'password' ? 'text' : 'password');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    // Aqui você faria a chamada à API para validar o login (exemplo)
    console.log('Email:', email, 'Senha:', senha);

    // Se o usuário não existir, você poderia redirecionar ou mostrar uma mensagem
    // Exemplo:
    fetch(`http://${URL_DB}/api/userAdmin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json',  'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email, senha }) // 👈 Atenção aqui!
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text) });
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                alert('Login realizado com sucesso!');
                localStorage.setItem('token', data.token);
                window.location.href = '/home';
            } else {
                alert("Erro: " + data.message);
                window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error(error);
            alert("Usuario não cadastrado no sistema.");
            window.location.href = '/login';
        });



}
