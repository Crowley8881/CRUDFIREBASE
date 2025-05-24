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

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};


// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos do DOM
const notify = document.querySelector('#notify');
const addBtn = document.querySelector('#add_Data');
const updateBtn = document.querySelector('#update_data');

// Função para adicionar dados no Firebase
async function addData() {
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    
    // Validação básica
    if (!name || !email) {
        notify.innerHTML = "Por favor, preencha todos os campos";
        setTimeout(() => {
            notify.innerHTML = "";
        }, 3000);
        return;
    }
    
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: name,
            email: email
        });
        
        notify.innerHTML = `Dados adicionados com sucesso!`;
        document.querySelector('#name').value = "";
        document.querySelector('#email').value = "";
        
        setTimeout(() => {
            notify.innerHTML = "";
        }, 3000);
        
        // Atualiza a tabela
        GetData();
    } catch (error) {
        console.log(error);
        notify.innerHTML = `Erro ao adicionar dados: ${error.message}`;
        setTimeout(() => {
            notify.innerHTML = "";
        }, 3000);
    }
}

// Evento de click no botão cadastrar
addBtn.addEventListener('click', addData);

// Função para buscar dados no Firestore
async function GetData() {
    try {
        const getDataQuery = await getDocs(collection(db, "users"));
        let html = "";
        
        getDataQuery.forEach((doc) => {
            const data = doc.data();
            html += `
                <tr>
                    <td>${doc.id}</td>
                    <td>${data.name}</td>
                    <td>${data.email}</td>
                    <td><button class="del_btn" onclick="deleteData('${doc.id}')">Excluir</button></td>
                    <td><button class="up_btn" onclick="updateData('${doc.id}')">Atualizar</button></td>
                </tr>
            `;
        });
        
        document.querySelector('tbody').innerHTML = html;
    } catch (err) {
        console.log(err);
        notify.innerHTML = `Erro ao buscar dados: ${err.message}`;
        setTimeout(() => {
            notify.innerHTML = "";
        }, 3000);
    }
}

// Carrega os dados ao iniciar a página
GetData();

// Função para excluir usuário
window.deleteData = async function(id) {
    // Popup de confirmação
    const confirmDelete = confirm("Tem certeza que deseja excluir este usuário?");
    
    if (confirmDelete) {
        try {
            await deleteDoc(doc(db, "users", id));
            notify.innerHTML = "Usuário excluído com sucesso!";
            setTimeout(() => {
                notify.innerHTML = "";
            }, 3000);
            
            // Atualiza a tabela
            GetData();
        } catch (err) {
            console.log(err);
            notify.innerHTML = `Erro ao excluir usuário: ${err.message}`;
            setTimeout(() => {
                notify.innerHTML = "";
            }, 3000);
        }
    }
};

// Função para atualizar dados
window.updateData = async function(id) {
    try {
        const docSnapshot = await getDoc(doc(db, "users", id));
        const currentUser = docSnapshot.data();
        
        document.querySelector('#name').value = currentUser.name;
        document.querySelector('#email').value = currentUser.email;
        
        updateBtn.classList.add('show');
        addBtn.classList.add('hide');
        
        // Remove event listeners anteriores
        const newUpdateBtn = updateBtn.cloneNode(true);
        updateBtn.parentNode.replaceChild(newUpdateBtn, updateBtn);
        
        // Adiciona novo event listener
        newUpdateBtn.addEventListener("click", async function() {
            const newName = document.querySelector('#name').value;
            const newEmail = document.querySelector('#email').value;
            
            if (newName && newEmail) {
                await updateDoc(doc(db, "users", id), {
                    name: newName,
                    email: newEmail
                });
                
                notify.innerHTML = "Dados atualizados com sucesso!";
                GetData();
                
                newUpdateBtn.classList.remove('show');
                addBtn.classList.remove('hide');
                
                document.querySelector('#name').value = "";
                document.querySelector('#email').value = "";
                
                setTimeout(() => {
                    notify.innerHTML = "";
                }, 3000);
            } else {
                notify.innerHTML = "Por favor, preencha todos os campos";
                setTimeout(() => {
                    notify.innerHTML = "";
                }, 3000);
            }
        });
    } catch (err) {
        console.log(err);
        notify.innerHTML = `Erro ao preparar atualização: ${err.message}`;
        setTimeout(() => {
            notify.innerHTML = "";
        }, 3000);
    }
};
