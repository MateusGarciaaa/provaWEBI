let tarefas = [];
let filtroAtual = "todas";

function adicionarTarefa() {
  let entrada = document.getElementById("entradaTarefa");
  let texto = entrada.value.trim();

  if (texto !== "") {
    let novaTarefa = {
      id: Date.now(),
      texto: texto,
      concluida: false,
    };

    tarefas.push(novaTarefa);
    entrada.value = "";
    atualizarLista();
  }
}

function atualizarLista() {
  let lista = document.getElementById("listaTarefas");
  lista.innerHTML = "";

  let tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtroAtual === "pendentes") return !tarefa.concluida;
    if (filtroAtual === "concluidas") return tarefa.concluida;
    return true;
  });

  tarefasFiltradas.forEach((tarefa) => {
    let li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center fade-in";

    let span = document.createElement("span");
    span.textContent = tarefa.texto;
    if (tarefa.concluida) {
      span.classList.add("concluida");
    }

    span.onclick = function () {
      tarefa.concluida = !tarefa.concluida;
      atualizarLista();
    };

    span.ondblclick = function () {
      let input = document.createElement("input");
      input.type = "text";
      input.value = tarefa.texto;
      input.className = "editando";

      input.onblur = function () {
        tarefa.texto = input.value.trim() || tarefa.texto;
        atualizarLista();
      };

      input.onkeydown = function (e) {
        if (e.key === "Enter") {
          input.blur();
        }
      };

      li.replaceChild(input, span);
      input.focus();
    };

    let botaoExcluir = document.createElement("button");
    botaoExcluir.className = "btn btn-danger btn-sm";
    botaoExcluir.textContent = "Excluir";

    botaoExcluir.onclick = function () {
      li.classList.add("fade-out");
      setTimeout(() => {
        tarefas = tarefas.filter((t) => t.id !== tarefa.id);
        atualizarLista();
      }, 300);
    };

    li.appendChild(span);
    li.appendChild(botaoExcluir);
    lista.appendChild(li);
  });

  // Atualizar botão ativo do filtro
  document.querySelectorAll(".filtros .btn").forEach((botao) => {
    botao.classList.remove("active");
    if (botao.textContent.toLowerCase().includes(filtroAtual)) {
      botao.classList.add("active");
    }
  });
}

function limparConcluidas() {
  tarefas = tarefas.filter((t) => !t.concluida);
  atualizarLista();
}

// Drag and drop com Sortable
new Sortable(document.getElementById("listaTarefas"), {
  animation: 150,
  onEnd: () => {
    let novaLista = [];
    document.querySelectorAll("#listaTarefas li span").forEach((span) => {
      let texto = span.textContent;
      let tarefa = tarefas.find((t) => t.texto === texto);
      if (tarefa) novaLista.push(tarefa);
    });
    tarefas = novaLista;
  },
});

// Inicializa
atualizarLista();
