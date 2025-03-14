const GITHUB_USERNAME = "tharlesjcp";
const REPO_NAME = "iprc-boletins-publico";
const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/boletins`;
const ACCESS_TOKEN = "PUBLIC_PATH_REPO";

async function carregarBoletins() {
    try {
        const response = await fetch(API_URL, {
            headers: { "Authorization": `Bearer ${ACCESS_TOKEN}` }
        });

        if (!response.ok) {
            console.error("❌ Erro ao carregar boletins:", await response.json());
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
