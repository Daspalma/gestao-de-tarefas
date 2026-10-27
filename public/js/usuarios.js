let listaDeUsuarios = []

// Carregar lista de usuários
async function carregarUsuarios() {
    const tabela = document.getElementById('tabelaUsuarios')
    listaDeUsuarios = await chamandoServer('/usuario')

    if (!Array.isArray(listaDeUsuarios) || listaDeUsuarios.length === 0) {
        tabela.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum usuário cadastrado.</td></tr>'
        return
    }

    tabela.innerHTML = listaDeUsuarios.map(u => `
        <tr>
            <td>${u.id}</td>
            <td><b>${u.nome}</b></td>
            <td>${u.login}</td>
            <td>
                <button type="button" class="btn-excluir" onclick="excluirUsuario(${u.id})">Excluir</button>
            </td>
        </tr>
    `).join('')
}

// Excluir usuário
async function excluirUsuario(id) {
    if (!confirm('Deseja realmente remover este usuário? As tarefas atribuídas a ele ficarão sem responsável.')) return

    await chamandoServer('/usuario/' + id, 'DELETE')
    carregarUsuarios()
}

// Cadastrar usuário
document.getElementById('formUsuario').onsubmit = async (evento) => {
    evento.preventDefault()

    const dados = {
        nome: document.getElementById('nomeUsuario').value.trim(),
        login: document.getElementById('loginUsuario').value.trim(),
        senha: document.getElementById('senhaUsuario').value.trim()
    }

    if (!dados.nome || !dados.login || !dados.senha) {
        alert('Preencha todos os campos do usuário!')
        return
    }

    const resultado = await chamandoServer('/registro', 'POST', dados)

    if (resultado.erro) {
        alert(resultado.erro)
        return
    }

    document.getElementById('formUsuario').reset()
    alert('Usuário cadastrado com sucesso!')
    carregarUsuarios()
}

// Inicializar
carregarUsuarios()
