const RENDER_URL = 'https://anime-app-backend-cur1.onrender.com';
const JIKAN_API = 'https://api.jikan.moe';

const grid = document.getElementById('animeGrid');
const searchInput = document.getElementById('searchInput');

// 1. THE MAIN STARTER
async function startApp() {
    console.log("App Starting...");
    
    // Load from your Render first
    await fetchMyPrivateAnime();
    
    // Then load the massive public list
    await fetchMassivePublicList();
}

// 2. GET YOUR 100+ ANIME FROM RENDER
async function fetchMyPrivateAnime() {
    try {
        const response = await fetch(RENDER_URL);
        const data = await response.json();
        if(data.length > 0) {
            renderCards(data, true); // true = adds the pink "Premium" glow
        }
    } catch (err) {
        console.log("Render Backend is waking up... moving to public data for now.");
    }
}

// 3. GET MASSIVE LIST FROM PUBLIC API
async function fetchMassivePublicList() {
    try {
        const response = await fetch(`${JIKAN_API}/top/anime?limit=24`);
        const json = await response.json();
        renderCards(json.data, false);
    } catch (err) {
        grid.innerHTML = "<h2>Failed to load anime. Check connection!</h2>";
    }
}

// 4. THE CARD GENERATOR (The part that actually puts stuff on screen)
function renderCards(data, isPremium) {
    const html = data.map(anime => {
        // Handle different data formats between Render and Jikan
        const title = anime.title || "Untitled Anime";
        const img = anime.image || anime.images?.webp?.large_image_url;
        const video = anime.videoUrl || anime.trailer?.embed_url;
        const score = anime.rating || anime.score || "8.5";
        
        return `
            <div class="anime-card ${isPremium ? 'premium-glow' : ''}" onclick="playVideo('${video}')">
                ${isPremium ? '<div class="badge">PRIVATE VAULT</div>' : ''}
                <img src="${img}" alt="${title}" onerror="this.src='https://via.placeholder.com'">
                <div class="card-info">
                    <h3>${title}</h3>
                    <div class="meta">
                        <span>⭐ ${score}</span>
                        <span>${isPremium ? 'EXCLUSIVE' : 'HD'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // If it's the first load, add it. If it's a search, replace it.
    grid.innerHTML += html;
}

// 5. SEARCH FEATURE (That actually works)
searchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        if (query.length < 3) return;

        grid.innerHTML = '<h2 style="grid-column: 1/-1; text-align: center;">Searching the Vault...</h2>';
        
        const res = await fetch(`${JIKAN_API}/anime?q=${query}&limit=24`);
        const json = await res.json();
        
        grid.innerHTML = ''; // Clear for search results
        renderCards(json.data, false);
    }
});

// 6. VIDEO PLAYER
function playVideo(url) {
    if(!url || url === "undefined" || url === "null") {
        alert("No video source found for this title.");
        return;
    }
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    iframe.src = url;
    modal.style.display = 'flex';
}

// Close Button
document.querySelector('.close-btn').onclick = () => {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('videoIframe').src = '';
};

// RUN IT!
startApp();
       
