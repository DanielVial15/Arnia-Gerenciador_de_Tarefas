// Comando para rodar o Jason : json-server --watch db.json

// Função para carregar a tela ao iniciar
const carregamento = () => {
  document.getElementById("carregamento").style.display = "block"
}
window.addEventListener("load", (event) => {
    carregamento();
});
window.addEventListener("DOMContentLoaded", (event) => {
    window.setTimeout(() => {
        document.getElementById("carregamento").style.display = "none"
    },1000);
})
//Funções para abrir e fechar o modal.
const addTarefa = () => {
    modal.style.display = "block";
    document.getElementById("formNum").value = "";
    document.getElementById("formDesc").value = "";
    document.getElementById("formData").value = "";
    document.getElementById("formStatus").value = "";
    document.getElementById("salva").onclick = () => {
        SalvaForm();
    }
}
const fechaModal = () => {
    modal.style.display = "none";
}
//Funções da funcionalidade do modal - status.
const formConcluido = () => {
    document.getElementById("formStatus").innerHTML = "Concluído";
}
const formAndamento = () => {
    document.getElementById("formStatus").innerHTML = "Em andamento";
}
const formParado = () => {
    document.getElementById("formStatus").innerHTML = "Parado";
}
//Função para salvar o modal e o formulario
const SalvaForm = async () => {
    let numSend = document.getElementById("formNum").value;
    let descSend = document.getElementById("formDesc").value;
    let dataSend = document.getElementById("formData").value;
    let statusSend = document.getElementById("formStatus").value;
    tarefas = {
        numero: parseInt(numSend),
        descricao: descSend,
        data: dataSend,
        status: statusSend,
    }
    await fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(tarefas),
    });
    imprimeForm();
    modal.style.display = "none";
}
//Função que imprime o form na tela
async function imprimeForm(){
    let listaTarefa = await fetch("http://localhost:3000/tarefas");
    let recebeTarefa = await listaTarefa.json();
    let color = "";
    var linha = "";
    recebeTarefa.forEach( (x) => {
        if (x.status == "Concluído") {
            color = "verde";
        }   else if (x.status =="Em andamento") {
            color = "orange";
        }   else {
            color = "red";
        }
        linha = linha +
            `<tr id="linha${x.id}" class="forColor">
            <td id="num${x.id}" class="col-1">${x.numero}</td> 
            <td id="desc${x.id}" class="col-4">${x.descricao}</td>
            <td id="dEntrega${x.id}" class="col-3 ps-3">${x.data.split('-').reverse().join('/')}</td>
            <td id="status${x.id}" class="col-2 ${color}">${x.status}</td>
            <td id="acao${x.id}" class="col-2"><i class="fa-solid fa-pen-to-square" onclick="editar(${x.id})"></i>   <i class="fa-solid fa-trash" onclick="deleta(${x.id})"></i></td>
        </tr>`
    });
    document.getElementById("cores").innerHTML = linha;
}
imprimeForm();

//Função que deleta no formulário
const deleta = async (x) => {
    await fetch(`http://localhost:3000/tarefas/${x}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
        },
    });
    await imprimeForm();
}

//Função para editar o formulário
const editar = async (x) => {
    modal.style.display = "block";
    let listaTarefa = await fetch(`http://localhost:3000/tarefas/${x}`);
    let recebeTarefa = await listaTarefa.json();
    document.getElementById("formNum").value = recebeTarefa.numero;
    document.getElementById("formDesc").value = recebeTarefa.descricao;
    document.getElementById("formData").value = recebeTarefa.data;
    document.getElementById("formStatus").value = recebeTarefa.status;
    document.getElementById("salva").onclick = () => {
        salvaEdita(x);
    }
}

//Função que edita e salva no formulario
const salvaEdita = async (x) => {
    let numSend = document.getElementById("formNum").value
    let descSend = document.getElementById("formDesc").value
    let dataSend = document.getElementById("formData").value
    let statusSend = document.getElementById("formStatus").value
    tarefas = {
        numero: parseInt(numSend),
        descricao: descSend,
        data: dataSend,
        status: statusSend,
    }
    await fetch(`http://localhost:3000/tarefas/${x}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(tarefas),
    });
    await imprimeForm();
    modal.style.display = "none";
}

//Função para não deixar preencher campos vazios
const obrigatorio = (pageElement, formId) => {
    if (formId =="") {
        pageElement.innerHTML = "*Campo obrigatório!*"
    } else {
        pageElement.innerHTML = ""
    }
}