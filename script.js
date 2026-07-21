// OIO TV Player - Lógica Principal Integrada com Edge Functions
const CONFIG = {
    TMDB_URL: "https://uqdwtzlkqaosnweyoyit.supabase.co/functions/v1/tmdb",
    YOUTUBE_URL: "https://uqdwtzlkqaosnweyoyit.supabase.co/functions/v1/youtube",
    SUPABASE_KEY: "sb_publishable_uafBQD1aJ3w8_eq4meOsNQ_wzk8TwhA"
};

const APP_DATA = {
    hero: {
        title: "Cyber Odyssey 2026",
        desc: "Uma jornada épica pelo futuro digital com interface glassmorphism de alta performance.",
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
        url: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    filmes: [
        { id: 1, title: "Cyber Odyssey", subtitle: "Sci-Fi • 2026", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { id: 2, title: "Neon Pulse", subtitle: "Ação • 4K", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { id: 3, title: "Quantum Realm", subtitle: "Aventura", poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ],
    series: [
        { id: 4, title: "Edge Architecture", subtitle: "Tech • 1 Temporada", poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { id: 5, title: "Modular Mindset", subtitle: "Documentário", poster: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
    ],
    infantil: [
        { id: 6, title: "OIO Kids Animation", subtitle: "Infantil • HD", poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { id: 7, title: "Robo Friends", subtitle: "Desenho • 3D", poster: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

async function initApp() {
    const container = document.getElementById("content-container");
    if (!container) return;

    let currentData = { ...APP_DATA };

    try {
        const responseTmdb = await fetch(CONFIG.TMDB_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${CONFIG.SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (responseTmdb.ok) {
            const tmdbData = await responseTmdb.json();
            if (tmdbData) {
                if (tmdbData.hero) currentData.hero = tmdbData.hero;
                if (tmdbData.filmes) currentData.filmes = tmdbData.filmes;
                if (tmdbData.series) currentData.series = tmdbData.series;
            }
        }

        const responseYt = await fetch(CONFIG.YOUTUBE_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${CONFIG.SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (responseYt.ok) {
            const ytData = await responseYt.json();
            if (ytData && ytData.videos) {
                currentData.infantil = ytData.videos;
            }
        }
    } catch (error) {
        console.warn("Modo de proteção ativo. Executando com dados locais.", error);
    }

    container.innerHTML = "";
    renderHero(currentData.hero);
    renderRow(container, "Filmes em Alta", currentData.filmes);
    renderRow(container, "Séries & Documentários", currentData.series);
    renderRow(container, "Desenhos & Animações", currentData.infantil);

    setupModal();
    setupNavigation();
}

function renderHero(hero) {
    if (!hero) return;
    document.getElementById("hero-title").innerText = hero.title || "OIO TV";
    document.getElementById("hero-desc").innerText = hero.desc || "";
    if (hero.poster) {
        document.getElementById("hero").style.backgroundImage = `url('${hero.poster}')`;
    }
    
    document.getElementById("hero-play").onclick = () => {
        openPlayer(hero.title, hero.desc, hero.url);
    };
}

function renderRow(parent, title, items) {
    if (!items || items.length === 0) return;
    const row = document.createElement("div");
    row.className = "row";
    
    const cards = items.map(item => `
        <div class="card" data-title="${item.title || ''}" data-subtitle="${item.subtitle || ''}" data-url="${item.url || ''}">
            <img class="card-img" src="${item.poster || ''}" alt="${item.title || ''}" loading="lazy">
            <div class="card-body">
                <div class="card-title">${item.title || ''}</div>
                <div class="card-subtitle">${item.subtitle || ''}</div>
            </div>
        </div>
    `).join("");

    row.innerHTML = `
        <div class="row-title">${title}</div>
        <div class="row-cards">${cards}</div>
    `;

    parent.appendChild(row);

    row.querySelectorAll(".card").forEach(card => {
        card.onclick = () => {
            openPlayer(
                card.getAttribute("data-title"),
                card.getAttribute("data-subtitle"),
                card.getAttribute("data-url")
            );
        };
    });
}

function openPlayer(title, desc, url) {
    const modal = document.getElementById("player-modal");
    const container = document.getElementById("player-container");
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-desc").innerText = desc;

    if (!url) {
        container.innerHTML = `<div style="color:white; padding:20px; text-align:center;">Mídia indisponível</div>`;
    } else if (url.includes("youtube.com/embed") || url.includes("youtu.be")) {
        container.innerHTML = `<iframe src="${url}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
        container.innerHTML = `<video src="${url}" controls autoplay playsinline></video>`;
    }

    modal.classList.remove("hidden");
}

function setupModal() {
    const modal = document.getElementById("player-modal");
    const closeBtn = document.getElementById("modal-close");
    
    closeBtn.onclick = () => {
        modal.classList.add("hidden");
        document.getElementById("player-container").innerHTML = "";
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    };
}

function setupNavigation() {
    document.querySelectorAll(".bottom-nav .nav-item").forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll(".bottom-nav .nav-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        };
    });
}
