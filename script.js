const RENDER_URL = 'https://anime-app-backend-cur1.onrender.com';
const JIKAN_API = 'https://api.jikan.moe';

const animeGrid = document.getElementById('animeGrid');
const searchInput = document.getElementById('searchInput');

// 1. LOAD EVERYTHING ON STARTUP
async function init() {
    // First, get your private 100+ anime from Render
    await loadPrivateVault();
    // Then, fill the rest with Trending Anime from the API
    await loadPublicAnime();
}

// 2. FETCH FROM YOUR RENDER BACKEND
async function loadPrivateVault() {
    try {
        const res = await fetch(RENDER_URL);
        const myAnime = await res.json();
        
        const html = myAnime.map(anime => `
            <div class="anime-card premium-glow" onclick="playTrailer('${anime.videoUrl}')">
                <div class="badge">PRIVATE VAULT</div>
                <img src="${anime.image}" loading="lazy">
                <div class="card-info">
                    <h3>${anime.title}</h3>
                    <div class="meta"><span>⭐ ${anime.rating || '10/10'}</span><span>EXCLUSIVE</span></div>
                </div>
            </div>
        `).join('');
        
        animeGrid.insertAdjacentHTML('beforeend', html);
    } catch (err) {
        console.error("Render Backend not responding yet...");
    }
}

// 3. FETCH FROM PUBLIC API (FOR MASSIVE QUANTITY)
async function loadPublicAnime() {
    const res = await fetch(`${JIKAN_API}/top/anime?limit=15`);
    const json = await res.json();
    renderPublic(json.data);
}

function renderPublic(list) {
    const html = list.map(anime => `
        <div class="anime-card" onclick="playTrailer('${anime.trailer.embed_url}')">
            <img src="${anime.images.webp.large_image_url}" loading="lazy">
            <div class="card-info">
                <h3>${anime.title}</h3>
                <div class="meta"><span>⭐ ${anime.score || 'N/A'}</span><span>${anime.type}</span></div>
            </div>
        </div>
    `).join('');
    animeGrid.insertAdjacentHTML('beforeend', html);
}

// 4. SEARCH LOGIC (Searches everything)
searchInput.addEventListener('input', async (e) => {
    const term = e.target.value;
    if (term.length < 3) return;

    const res = await fetch(`${JIKAN_API}/anime?q=${term}&limit=24`);
    const json = await res.json();
    
    animeGrid.innerHTML = ''; // Clear for search results
    renderPublic(json.data);
});

// 5. VIDEO PLAYER
function playTrailer(url) {
    if(!url || url === 'null') return alert("No video link found!");
    const modal = document.getElementById('videoModal');
    document.getElementById('videoIframe').src = url;
    modal.style.display = 'flex';
}

document.querySelector('.close-btn').onclick = () => {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('videoIframe').src = '';
};

init();
    
