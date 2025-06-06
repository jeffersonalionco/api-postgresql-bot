// Supondo que você já tenha o token salvo no servidor e sirva ele via API
// Exemplo: GET /api/user/token

const token = localStorage.getItem("token")

document.addEventListener('DOMContentLoaded', () => {
    const tokenDisplay = document.getElementById('tokenDisplay');
    const copyButton = document.getElementById('copyButton');
    const generateButton = document.getElementById('generateButton');

    // 1. Buscar o token na API
    fetch('/api/userAdmin/tokenBot', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                tokenDisplay.textContent = data.token;
            } else {
                tokenDisplay.textContent = 'Nenhum token encontrado. Gere um novo.';
            }
        })
        .catch(err => {
            console.error('Erro ao buscar token:', err);
            tokenDisplay.textContent = 'Erro ao carregar o token.';
        });

    // 2. Copiar token para a área de transferência
    copyButton.addEventListener('click', () => {
        const text = tokenDisplay.textContent;
        navigator.clipboard.writeText(text)
            .then(() => alert('Token copiado!'))
            .catch(err => console.error('Erro ao copiar token:', err));
    });

    // 3. Gerar um novo token via API
    generateButton.addEventListener('click', () => {
        fetch('/api/userAdmin/gerarToken', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: token }) })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    tokenDisplay.textContent = data.token;
                    alert('Novo token gerado com sucesso!');
                } else {
                    alert('Falha ao gerar o token.');
                }
            })
            .catch(err => {
                console.error('Erro ao gerar token:', err);
                alert('Erro ao gerar token.');
            });
    });
});
