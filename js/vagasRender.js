const container = document.getElementById("vagas-container");
const modal = document.getElementById("modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");

const addModal = document.getElementById("add-modal");
const userRole = sessionStorage.getItem("role");
const addBtn = document.getElementById("add-vaga-btn");

if (userRole !== "cliente") {
  addBtn.style.display = "none";
}

const closeAddModal = document.getElementById("close-add-modal");
const cancelVaga = document.getElementById("cancel-vaga");
const submitVaga = document.getElementById("submit-vaga");


let cardIdToDelete = null;

const defaultUsers  = [
  {
    login: "ADMIN",
    password: "Senhaforte@123",
    role: "admin",
    nome: "Administrador",
    unidade: "Matriz",
    primeiroAcesso: false
  },
  {
    login: "CLIENTE",
    password: "Senhaforte@123",
    role: "cliente",
    nome: "Cliente Teste",
    unidade: "Unidade Centro",
    primeiroAcesso: false
  }
];

// Inicializa vagas apenas no primeiro acesso
if (!localStorage.getItem("vagas")) {
  localStorage.setItem("vagas", JSON.stringify(defaultVagas));
}

// Sempre carregar do localStorage
let vagas = JSON.parse(localStorage.getItem("vagas"));


if (addBtn && userRole !== "cliente") {
  addBtn.style.display = "none";
}


addBtn.onclick = () => {
  addModal.classList.remove("hidden");
};

function closeAddVagaModal() {
  addModal.classList.add("hidden");
}

closeAddModal.onclick = closeAddVagaModal;
cancelVaga.onclick = closeAddVagaModal;

submitVaga.onclick = () => {
  const especialidade = document.getElementById("nova-especialidade").value.trim();
  const unidade = document.getElementById("nova-unidade").value.trim();
  const criticidade = document.getElementById("nova-criticidade").value.trim();
  const data = document.getElementById("nova-data").value;

  if (!especialidade || !unidade || !criticidade || !data) {
    alert("Preencha todos os campos.");
    return;
  }

  const novoId = vagas.length
    ? Math.max(...vagas.map(v => v.card_id)) + 1
    : 1;

  vagas.push({
    card_id: novoId,
    especialidade,
    unidade,
    criticidade,
    data: data.split("-").reverse().join("/"),
    preenchida: false
  });

  localStorage.setItem("vagas", JSON.stringify(vagas));
  closeAddVagaModal();
  renderVagas();
};



function renderVagas() {
  container.innerHTML = "";

  vagas.forEach(vaga => {
    const card = document.createElement("div");
    card.className = "vaga-card";

    card.innerHTML = `
      ${userRole === "admin" ? `
        <button class="delete-btn" onclick="openModal(${vaga.card_id})">X</button>
        ` : ""}

      <p><strong>Especialidade:</strong> ${vaga.especialidade}</p>
      <p><strong>Unidade:</strong> ${vaga.unidade}</p>
      <p><strong>Criticidade:</strong> ${vaga.criticidade}</p>
      <p><strong>Data:</strong> ${vaga.data}</p>

        ${userRole === "admin" ? `
            <button class="action-btn" onclick="toggleVaga(${vaga.card_id})">
                ${vaga.preenchida ? "Liberar vaga" : "Preencher vaga"}
            </button>
        ` : ""}

    `;

    container.appendChild(card);
  });
}

function toggleVaga(cardId) {
  // Blindagem por role (opcional, mas correta)
  if (userRole !== "admin") return;

  const vaga = vagas.find(v => v.card_id === cardId);
  if (vaga) {
    vaga.preenchida = !vaga.preenchida;
    localStorage.setItem("vagas", JSON.stringify(vagas));
    renderVagas();
  }
}

function openModal(cardId) {
  cardIdToDelete = cardId;
  modal.classList.remove("hidden");
}

confirmDeleteBtn.onclick = () => {
  vagas = vagas.filter(v => v.card_id !== cardIdToDelete);
  localStorage.setItem("vagas", JSON.stringify(vagas));
  modal.classList.add("hidden");
  renderVagas();
};

cancelDeleteBtn.onclick = () => {
  modal.classList.add("hidden");
  cardIdToDelete = null;
};

renderVagas();
