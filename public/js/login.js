document.getElementById('formularioDeLogin').onsubmit = async (evento) => {
    evento.preventDefault()

    const loginInput = document.getElementById('login').value.trim()
    const senhaInput = document.getElementById('senha').value.trim()

    if (!loginInput || !senhaInput) {
        alert('Por favor, preencha todos os campos!')
        return
    }

    const resposta = await chamandoServer('/login', 'POST', {
        login: loginInput,
        senha: senhaInput,
    })

    if (resposta.erro) {
        alert(resposta.erro)
        return
    }

    if (resposta.user && resposta.user.nome) {
        // Salva nome para persistência
        localStorage.setItem('usuarioLogado', resposta.user.nome)
        // Redireciona para o index
        window.location.href = 'index.html?nome=' + encodeURIComponent(resposta.user.nome)
    }
}
