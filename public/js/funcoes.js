// Função padrão para realizar chamadas à API (igual ao modelo de referência)
async function chamandoServer(endereco, metodo = 'GET', dados) {
    try {
        const opcoes = {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
        }

        if (dados) {
            opcoes.body = JSON.stringify(dados)
        }

        const resposta = await fetch(endereco, opcoes)
        return await resposta.json()
    } catch (erro) {
        console.error('Erro na requisição:', erro)
        return { erro: 'Falha ao conectar com o servidor.' }
    }
}

// Atualiza mensagem de boas-vindas se existir na página
const mensagemDeBoasVindas = document.getElementById('mensagemDeBoasVindas')
if (mensagemDeBoasVindas) {
    const nomeURL = new URLSearchParams(location.search).get('nome')
    const usuarioSalvo = localStorage.getItem('usuarioLogado')

    const nome = nomeURL || usuarioSalvo || 'Usuário'
    mensagemDeBoasVindas.textContent = `Olá, ${nome}!`
}

// Função utilitária de Logout
function fazerLogout() {
    localStorage.removeItem('usuarioLogado')
    window.location.href = 'login.html'
}
