// Importação dos módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Configuração do Firebase
// Replace the hardcoded `firebaseConfig` with environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const notify = document.querySelector("#notify");
const addBtn = document.querySelector("#addUser");
const updateBtn = document.querySelector("#updateUser");

function getFormData() {
  return {
    fullName: document.querySelector("#fullName").value,
    birthDate: document.querySelector("#birthDate").value,
    rg: document.querySelector("#rg").value,
    cpf: document.querySelector("#cpf").value,
    father: document.querySelector("#father").value,
    mother: document.querySelector("#mother").value,
    education: document.querySelector("#education").value,
    profession: document.querySelector("#profession").value,
    phone: document.querySelector("#phone").value,
    cell: document.querySelector("#cell").value,
    email: document.querySelector("#email").value
  };
}

function clearForm() {
  document.querySelectorAll(".form input, .form select").forEach(el => el.value = "");
}

function showNotify(msg) {
  notify.innerHTML = msg;
  setTimeout(() => notify.innerHTML = "", 3000);
}

async function addUser() {
  const user = getFormData();
  if (!user.fullName || !user.cpf || !user.email || !user.phone) {
    return showNotify("Preencha pelo menos Nome, CPF, Email e Telefone.");
  }
  try {
    await addDoc(collection(db, "users2"), user);
    showNotify("Usuário cadastrado com sucesso!");
    clearForm();
    loadUsers();
  } catch (error) {
    showNotify("Erro ao cadastrar: " + error.message);
  }
}

async function loadUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users2"));
    let html = "";
    querySnapshot.forEach((docSnap) => {
      const u = docSnap.data();
      html += `
        <tr>
          <td>${docSnap.id}</td>
          <td>${u.fullName}</td>
          <td>${u.cpf}</td>
          <td>${u.email}</td>
          <td>${u.phone}</td>
          <td>
            <button class="del_btn" onclick="deleteUser('${docSnap.id}')">Excluir</button>
            <button class="up_btn" onclick="updateUser('${docSnap.id}')">Atualizar</button>
          </td>
        </tr>
      `;
    });
    document.querySelector("tbody").innerHTML = html;
  } catch (err) {
    showNotify("Erro ao carregar usuários: " + err.message);
  }
}

async function deleteUser(id) {
  if (!confirm("Deseja realmente excluir este usuário?")) return;
  try {
    await deleteDoc(doc(db, "users2", id));
    showNotify("Usuário removido com sucesso!");
    loadUsers();
  } catch (err) {
    showNotify("Erro ao excluir: " + err.message);
  }
}

async function updateUser(id) {
  try {
    const docSnap = await getDoc(doc(db, "users2", id));
    const data = docSnap.data();
    
    document.querySelector("#fullName").value = data.fullName;
    document.querySelector("#birthDate").value = data.birthDate;
    document.querySelector("#rg").value = data.rg;
    document.querySelector("#cpf").value = data.cpf;
    document.querySelector("#father").value = data.father;
    document.querySelector("#mother").value = data.mother;
    document.querySelector("#education").value = data.education;
    document.querySelector("#profession").value = data.profession;
    document.querySelector("#phone").value = data.phone;
    document.querySelector("#cell").value = data.cell;
    document.querySelector("#email").value = data.email;

    updateBtn.classList.add("show");
    addBtn.classList.add("hide");

    const newBtn = updateBtn.cloneNode(true);
    updateBtn.parentNode.replaceChild(newBtn, updateBtn);

    newBtn.addEventListener("click", async () => {
      const updatedUser = getFormData();
      if (!updatedUser.fullName || !updatedUser.cpf || !updatedUser.email || !updatedUser.phone) {
        return showNotify("Preencha pelo menos Nome, CPF, Email e Telefone.");
      }
      try {
        await updateDoc(doc(db, "users2", id), updatedUser);
        showNotify("Usuário atualizado com sucesso!");
        clearForm();
        loadUsers();
        newBtn.classList.remove("show");
        addBtn.classList.remove("hide");
      } catch (err) {
        showNotify("Erro ao atualizar: " + err.message);
      }
    });
  } catch (err) {
    showNotify("Erro ao carregar usuário para edição: " + err.message);
  }
}

addBtn.addEventListener("click", addUser);
window.deleteUser = deleteUser;
window.updateUser = updateUser;

loadUsers();