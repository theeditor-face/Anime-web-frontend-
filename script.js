const JIKAN_API = 'https://api.jikan.moe/v4';
const animeGrid = document.getElementById('animeGrid');
const searchInput = document.getElementById('searchInput');

// 1. Initial Load: Get Top Trending Anime
async function loadTopAnime() {
    const res = await fetch(`${JIKAN_API}/top/anime?limit=20`);
    const json = await res.json();
    displayAnime(json.data);
}

// 2. Powerful Search Feature
searchInput.addEventListener('input', async (e) => {
    const term = e.target.value;
    if (term.length < 3) return; // Wait for 3 characters

    const res = await fetch(`${JIKAN_API}/anime?q=${term}&limit=24`);
    const json = await res.json();
    displayAnime(json.data);
});

// 3. Render High-End Cards
function displayAnime(list) {
    animeGrid.innerHTML = list.map(anime => `
        <div class="anime-card" onclick="playTrailer('${anime.trailer.embed_url}')">
            <img src="${anime.images.webp.large_image_url}" loading="lazy">
            <div class="card-info">
                <h3>${anime.title}</h3>
                <div class="meta">
                    <span>⭐ ${anime.score || 'N/A'}</span>
                    <span>${anime.type}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 4. Video Player Logic
function playTrailer(url) {
    if(!url || url === 'null') {
        alert("Trailer not available for this title!");
        return;
    }
    const modal = document.getElementById('videoModal');
    document.getElementById('videoIframe').src = url;
    modal.style.display = 'flex';
}

// Close Modal
document.querySelector('.close-btn').onclick = () => {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('videoIframe').src = '';
};

loadTopAnime();
