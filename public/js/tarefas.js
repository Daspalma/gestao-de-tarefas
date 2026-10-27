let listaDeTarefas = []

// Carrega os usuários no select de responsável
async function carregarUsuariosNoSelect() {
    const usuarios = await chamandoServer('/usuario')
    const select = document.getElementById('id_usuario')
    
    if (Array.isArray(usuarios)) {
        select.innerHTML = '<option value="">-- Sem responsável --</option>' + 
            usuarios.map(u => `<option value="${u.id}">${u.nome} (${u.login})</option>`).join('')
    }
}

// Carrega todas as tarefas do servidor
async function carregarTarefas() {
    const tabela = document.getElementById('tabela')
    listaDeTarefas = await chamandoServer('/tarefa')

    if (!Array.isArray(listaDeTarefas) || listaDeTarefas.length === 0) {
        tabela.innerHTML = '<tr><td colspan="8" style="text-align: center;">Nenhuma tarefa cadastrada.</td></tr>'
        return
    }

    tabela.innerHTML = listaDeTarefas.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>
                <b>${t.titulo}</b>
                ${t.descricao ? `<br><small style="color: #666;">${t.descricao}</small>` : ''}
            </td>
            <td>${t.setor}</td>
            <td>${t.prioridade}</td>
            <td><b>${t.status}</b></td>
            <td>${t.data_limite || '-'}</td>
            <td>${t.responsavel || '-'}</td>
            <td>
                <button type="button" class="btn-editar" onclick="preencherFormulario(${t.id})">Editar</button>
                <button type="button" class="btn-excluir" onclick="excluirTarefa(${t.id})">Excluir</button>
            </td>
        </tr>
    `).join('')
}

// Limpa o formulário
function limparFormulario() {
    document.getElementById('formulario').reset()
    document.getElementById('id').value = ''
    document.getElementById('btnSalvar').textContent = 'Salvar Tarefa'
    document.getElementById('btnCancelar').style.display = 'none'
}

// Preenche os campos para edição
function preencherFormulario(id) {
    const tarefa = listaDeTarefas.find(item => item.id == id)
    if (!tarefa) return

    document.getElementById('id').value = tarefa.id
    document.getElementById('titulo').value = tarefa.titulo
    document.getElementById('descricao').value = tarefa.descricao || ''
    document.getElementById('setor').value = tarefa.setor || 'Geral'
    document.getElementById('prioridade').value = tarefa.prioridade || 'Média'
    document.getElementById('status').value = tarefa.status || 'Pendente'
    document.getElementById('data_limite').value = tarefa.data_limite || ''
    document.getElementById('id_usuario').value = tarefa.id_usuario || ''

    document.getElementById('btnSalvar').textContent = 'Atualizar Tarefa'
    document.getElementById('btnCancelar').style.display = 'inline-block'

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Excluir tarefa
async function excluirTarefa(id) {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return

    await chamandoServer('/tarefa/' + id, 'DELETE')
    carregarTarefas()
}

// Salvar (POST ou PUT)
document.getElementById('formulario').onsubmit = async (evento) => {
    evento.preventDefault()

    const id = document.getElementById('id').value
    const dados = {
        titulo: document.getElementById('titulo').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        setor: document.getElementById('setor').value,
        prioridade: document.getElementById('prioridade').value,
        status: document.getElementById('status').value,
        data_limite: document.getElementById('data_limite').value || null,
        id_usuario: document.getElementById('id_usuario').value || null
    }

    if (!dados.titulo) {
        alert('O título da tarefa é obrigatório!')
        return
    }

    if (id) {
        await chamandoServer('/tarefa/' + id, 'PUT', dados)
    } else {
        await chamandoServer('/tarefa', 'POST', dados)
    }

    limparFormulario()
    carregarTarefas()
}

// Inicialização
carregarUsuariosNoSelect()
carregarTarefas()
