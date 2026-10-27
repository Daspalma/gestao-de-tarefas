let listaDeTarefas = []

// 1. Carrega todas as tarefas do servidor e exibe na tabela
async function carregarTarefas() {
    const tabela = document.getElementById('tabela')
    tabela.innerHTML = '<tr><td colspan="6" style="text-align: center;">Carregando tarefas...</td></tr>'

    listaDeTarefas = await chamandoServer('/tarefa')

    if (!Array.isArray(listaDeTarefas) || listaDeTarefas.length === 0) {
        tabela.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #64748b;">Nenhuma tarefa cadastrada.</td></tr>'
        return
    }

    tabela.innerHTML = listaDeTarefas.map(tarefa => {
        // Formatação simples de classes para badges
        const classeStatus = tarefa.status === 'Concluída' 
            ? 'badge-concluida' 
            : (tarefa.status === 'Em Andamento' ? 'badge-andamento' : 'badge-pendente')

        const classePrioridade = tarefa.prioridade === 'Alta' 
            ? 'badge-alta' 
            : (tarefa.prioridade === 'Média' ? 'badge-media' : 'badge-baixa')

        return `
            <tr>
                <td><strong>#${tarefa.id}</strong></td>
                <td>
                    <strong>${tarefa.titulo}</strong>
                    ${tarefa.descricao ? `<br><small style="color: #64748b;">${tarefa.descricao}</small>` : ''}
                </td>
                <td><span class="badge ${classeStatus}">${tarefa.status}</span></td>
                <td><span class="badge ${classePrioridade}">${tarefa.prioridade}</span></td>
                <td>${tarefa.responsavel || '-'}</td>
                <td>
                    <button type="button" class="btn-editar btn-sm" onclick="preencherFormulario(${tarefa.id})">Editar</button>
                    <button type="button" class="btn-perigo btn-sm" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                </td>
            </tr>
        `
    }).join('')
}

// 2. Limpa o formulário e reseta para modo de criação
function limparFormulario() {
    document.getElementById('formulario').reset()
    document.getElementById('id').value = ''
    document.getElementById('btnSalvar').textContent = 'Salvar Tarefa'
    const btnCancelar = document.getElementById('btnCancelar')
    if (btnCancelar) btnCancelar.style.display = 'none'
}

// 3. Preenche o formulário para edição
function preencherFormulario(id) {
    const tarefa = listaDeTarefas.find(item => item.id == id)
    if (!tarefa) return

    document.getElementById('id').value = tarefa.id
    document.getElementById('titulo').value = tarefa.titulo
    document.getElementById('descricao').value = tarefa.descricao || ''
    document.getElementById('status').value = tarefa.status
    document.getElementById('prioridade').value = tarefa.prioridade

    document.getElementById('btnSalvar').textContent = 'Atualizar Tarefa'
    const btnCancelar = document.getElementById('btnCancelar')
    if (btnCancelar) btnCancelar.style.display = 'inline-block'

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 4. Excluir uma tarefa
async function excluirTarefa(id) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

    await chamandoServer('/tarefa/' + id, 'DELETE')
    carregarTarefas()
}

// 5. Envio do Formulário (Criar ou Atualizar)
document.getElementById('formulario').onsubmit = async (evento) => {
    evento.preventDefault()

    const id = document.getElementById('id').value
    const dados = {
        titulo: document.getElementById('titulo').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        status: document.getElementById('status').value,
        prioridade: document.getElementById('prioridade').value
    }

    if (!dados.titulo) {
        alert('O título da tarefa é obrigatório!')
        return
    }

    if (id) {
        // Atualização (PUT)
        await chamandoServer('/tarefa/' + id, 'PUT', dados)
    } else {
        // Criação (POST)
        await chamandoServer('/tarefa', 'POST', dados)
    }

    limparFormulario()
    carregarTarefas()
}

// Carrega as tarefas ao abrir a página
carregarTarefas()
