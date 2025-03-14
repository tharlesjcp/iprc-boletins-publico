const GITHUB_USERNAME = "tharlesjcp";
const REPO_NAME = "iprc-boletins-publico";
const BRANCH_NAME = "main";
const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/`;

async function uploadBoletim() {
    const fileInput = document.getElementById("boletimFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("⚠️ Selecione um arquivo PDF primeiro.");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const base64Content = reader.result.split(",")[1];
        const fileName = `boletins/boletim_${new Date().toISOString().split("T")[0]}.pdf`;

        try {
            const response = await fetch(API_URL + fileName, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${PUBLIC_PATH_REPO}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `📄 Adicionando boletim: ${fileName}`,
                    content: base64Content,
                    branch: BRANCH_NAME
                })
            });

            if (response.ok) {
                alert("✅ Boletim enviado com sucesso!");
                carregarBoletins();
            } else {
                const errorData = await response.json();
                alert(`❌ Erro ao enviar boletim: ${errorData.message}`);
            }
        } catch (error) {
            alert("❌ Erro ao conectar com o GitHub.");
            console.error(error);
        }
    };
}

async function carregarBoletins() {
    try {
        const response = await fetch(API_URL + "boletins", {
            headers: { "Authorization": `token ${PUBLIC_PATH_REPO}` }
        });

        if (!response.ok) {
            alert("❌ Erro ao carregar boletins.");
            return;
        }

        const data = await response.json();
        const listaBoletins = document.getElementById("lista-boletins");
        listaBoletins.innerHTML = "";

        data.forEach(file => {
            const link = document.createElement("a");
            link.href = file.download_url;
            link.textContent = file.name;
            link.target = "_blank";

            const div = document.createElement("div");
            div.appendChild(link);
            listaBoletins.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar boletins:", error);
        alert("❌ Falha ao buscar boletins.");
    }
}

carregarBoletins();
