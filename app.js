// ===== Configuration =====
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : '/api';

// ===== Fallback Demo Data =====
const DEMO_MOVIES = [
    { _id: 'the-dark-knight-2008', title: 'The Dark Knight', year: 2008, rating: '9.0', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BVCEP9WlksSl.jpg', type: 'movie', genre: ['Action', 'Drama'] },
    { _id: 'inception-2010', title: 'Inception', year: 2010, rating: '8.8', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', type: 'movie', genre: ['Action', 'Sci-Fi'] },
    { _id: 'interstellar-2014', title: 'Interstellar', year: 2014, rating: '8.7', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', type: 'movie', genre: ['Sci-Fi', 'Drama'] },
    { _id: 'parasite-2019', title: 'Parasite', year: 2019, rating: '8.5', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', type: 'movie', genre: ['Thriller', 'Drama'] },
    { _id: 'avengers-endgame-2019', title: 'Avengers: Endgame', year: 2019, rating: '8.4', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9SlMiYv6Sy.jpg', type: 'movie', genre: ['Action', 'Sci-Fi'] },
    { _id: 'joker-2019', title: 'Joker', year: 2019, rating: '8.4', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', type: 'movie', genre: ['Crime', 'Drama'] },
    { _id: 'your-name-2016', title: 'Your Name', year: 2016, rating: '8.4', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg', type: 'movie', genre: ['Animation', 'Romance'] },
    { _id: 'spider-man-no-way-home-2021', title: 'Spider-Man: No Way Home', year: 2021, rating: '8.2', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', type: 'movie', genre: ['Action', 'Adventure'] },
    { _id: 'the-shawshank-redemption-1994', title: 'The Shawshank Redemption', year: 1994, rating: '9.3', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/9cjIGRRJHMdMU5KuVwtYVa1t6eN.jpg', type: 'movie', genre: ['Drama'] },
    { _id: 'dune-2021', title: 'Dune', year: 2021, rating: '8.0', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', type: 'movie', genre: ['Sci-Fi', 'Adventure'] },
    { _id: 'forrest-gump-1994', title: 'Forrest Gump', year: 1994, rating: '8.8', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', type: 'movie', genre: ['Drama', 'Romance'] },
    { _id: 'the-godfather-1972', title: 'The Godfather', year: 1972, rating: '9.2', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', type: 'movie', genre: ['Crime', 'Drama'] },
    { _id: 'oppenheimer-2023', title: 'Oppenheimer', year: 2023, rating: '8.3', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', type: 'movie', genre: ['Drama', 'History'] },
    { _id: 'fight-club-1999', title: 'Fight Club', year: 1999, rating: '8.8', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', type: 'movie', genre: ['Drama', 'Thriller'] },
    { _id: 'the-matrix-1999', title: 'The Matrix', year: 1999, rating: '8.7', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', type: 'movie', genre: ['Sci-Fi', 'Action'] },
];

const DEMO_SERIES = [
    { _id: 'breaking-bad', title: 'Breaking Bad', year: 2008, rating: '9.5', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', type: 'series', genre: ['Crime', 'Drama'], episodeLabel: 62 },
    { _id: 'stranger-things', title: 'Stranger Things', year: 2016, rating: '8.7', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', type: 'series', genre: ['Sci-Fi', 'Horror'], episodeLabel: 34 },
    { _id: 'squid-game', title: 'Squid Game', year: 2021, rating: '8.0', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg', type: 'series', genre: ['Thriller', 'Drama'], episodeLabel: 18 },
    { _id: 'wednesday', title: 'Wednesday', year: 2022, rating: '8.1', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', type: 'series', genre: ['Comedy', 'Mystery'], episodeLabel: 8 },
    { _id: 'the-witcher', title: 'The Witcher', year: 2019, rating: '8.0', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', type: 'series', genre: ['Fantasy', 'Action'], episodeLabel: 24 },
    { _id: 'money-heist', title: 'Money Heist', year: 2017, rating: '8.2', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', type: 'series', genre: ['Crime', 'Thriller'], episodeLabel: 41 },
    { _id: 'dark', title: 'Dark', year: 2017, rating: '8.8', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg', type: 'series', genre: ['Sci-Fi', 'Mystery'], episodeLabel: 26 },
    { _id: 'the-last-of-us', title: 'The Last of Us', year: 2023, rating: '8.8', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', type: 'series', genre: ['Drama', 'Action'], episodeLabel: 16 },
    { _id: 'peaky-blinders', title: 'Peaky Blinders', year: 2013, rating: '8.8', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg', type: 'series', genre: ['Crime', 'Drama'], episodeLabel: 36 },
    { _id: 'game-of-thrones', title: 'Game of Thrones', year: 2011, rating: '9.2', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', type: 'series', genre: ['Fantasy', 'Drama'], episodeLabel: 73 },
];

const DEMO_POPULAR = [
    ...DEMO_MOVIES.slice(0, 5),
    { _id: 'everything-everywhere-all-at-once-2022', title: 'Everything Everywhere All at Once', year: 2022, rating: '7.8', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg', type: 'movie', genre: ['Sci-Fi', 'Comedy'] },
    { _id: 'top-gun-maverick-2022', title: 'Top Gun: Maverick', year: 2022, rating: '8.2', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', type: 'movie', genre: ['Action', 'Drama'] },
    { _id: 'the-batman-2022', title: 'The Batman', year: 2022, rating: '7.8', quality: 'HD', poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', type: 'movie', genre: ['Action', 'Crime'] },
    ...DEMO_MOVIES.slice(5, 10),
];

// ===== State =====
let currentPage = 1;
let currentView = 'home';
let currentType = 'movie'; // movie or series (API uses singular)
let lastQuery = '';

// ===== DOM Elements =====
const heroSection = document.getElementById('heroSection');
const contentSection = document.getElementById('contentSection');
const detailSection = document.getElementById('detailSection');
const loadingOverlay = document.getElementById('loadingOverlay');
const contentGrid = document.getElementById('contentGrid');
const sectionTitle = document.getElementById('sectionTitle');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const homePopular = document.getElementById('homePopular');
const homeRecent = document.getElementById('homeRecent');
const homeSeries = document.getElementById('homeSeries');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    goHome();
    setupEvents();
});

// ===== Event Setup =====
function setupEvents() {
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// ===== Navigation =====
function setActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
}

function showView(view) {
    heroSection.style.display = 'none';
    contentSection.style.display = 'none';
    detailSection.style.display = 'none';
    homePopular.style.display = 'none';
    homeRecent.style.display = 'none';
    homeSeries.style.display = 'none';
    loadingOverlay.style.display = 'none';

    currentView = view;
    document.getElementById('navLinks').classList.remove('open');
}

// ===== API Helper with Fallback =====
async function fetchAPI(endpoint) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(`${API_BASE}${endpoint}`, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        const data = json.data || json.results || json;

        if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
            return data;
        }
        return null;
    } catch (err) {
        console.warn('API fetch failed, using fallback:', err.message);
        return null;
    }
}

// ===== Home Page =====
async function goHome() {
    showView('home');
    setActiveNav('home');
    heroSection.style.display = 'flex';
    showLoading();

    try {
        const [popularRes, recentRes, seriesRes] = await Promise.allSettled([
            fetchAPI('/movies/populer?page=1'),
            fetchAPI('/movies/latest?page=1'),
            fetchAPI('/series/latest?page=1')
        ]);

        const popularData = (popularRes.status === 'fulfilled' && popularRes.value) ? popularRes.value : DEMO_POPULAR;
        const recentData = (recentRes.status === 'fulfilled' && recentRes.value) ? recentRes.value : DEMO_MOVIES;
        const seriesData = (seriesRes.status === 'fulfilled' && seriesRes.value) ? seriesRes.value : DEMO_SERIES;

        renderScrollRow('popularRow', popularData, 'movie');
        homePopular.style.display = 'block';

        renderScrollRow('recentRow', recentData, 'movie');
        homeRecent.style.display = 'block';

        renderScrollRow('seriesRow', seriesData, 'series');
        homeSeries.style.display = 'block';
    } catch (err) {
        console.error('Error loading home:', err);
        renderScrollRow('popularRow', DEMO_POPULAR, 'movie');
        homePopular.style.display = 'block';
        renderScrollRow('recentRow', DEMO_MOVIES, 'movie');
        homeRecent.style.display = 'block';
        renderScrollRow('seriesRow', DEMO_SERIES, 'series');
        homeSeries.style.display = 'block';
    }

    hideLoading();
}

// ===== Movies List =====
async function loadMovies(page = 1) {
    showView('list');
    setActiveNav('movies');
    contentSection.style.display = 'block';
    sectionTitle.textContent = '🎬 Film Terbaru';
    currentType = 'movie';
    currentPage = page;

    showLoading();
    const data = await fetchAPI(`/movies/latest?page=${page}`);
    renderGrid(data || DEMO_MOVIES, 'movie');
    renderPagination(page, 'loadMovies');
    hideLoading();
}

// ===== Series List =====
async function loadSeries(page = 1) {
    showView('list');
    setActiveNav('series');
    contentSection.style.display = 'block';
    sectionTitle.textContent = '📺 Series Terbaru';
    currentType = 'series';
    currentPage = page;

    showLoading();
    const data = await fetchAPI(`/series/latest?page=${page}`);
    renderGrid(data || DEMO_SERIES, 'series');
    renderPagination(page, 'loadSeries');
    hideLoading();
}

// ===== Popular =====
async function loadPopular(page = 1) {
    showView('list');
    setActiveNav('popular');
    contentSection.style.display = 'block';
    sectionTitle.textContent = '🔥 Film Populer';
    currentType = 'movie';
    currentPage = page;

    showLoading();
    const data = await fetchAPI(`/movies/populer?page=${page}`);
    renderGrid(data || DEMO_POPULAR, 'movie');
    renderPagination(page, 'loadPopular');
    hideLoading();
}

// ===== Search (local filter from demo data since API doesn't have search) =====
async function performSearch(page = 1) {
    const query = searchInput.value.trim();
    if (!query) return;

    lastQuery = query;
    showView('list');
    setActiveNav('');
    contentSection.style.display = 'block';
    sectionTitle.textContent = `🔍 Hasil pencarian: "${query}"`;
    currentPage = page;

    showLoading();

    try {
        const data = await fetchAPI(`/search?s=${encodeURIComponent(query)}&page=${page}`);

        if (data && data.length > 0) {
            renderGrid(data, 'mixed');
            renderPagination(page, 'performSearch');
        } else {
            console.warn('Search returned no data');
            showEmpty('Tidak ditemukan', `Maaf, film "${query}" tidak ditemukan. Coba gunakan judul yang lebih umum.`);
        }
    } catch (err) {
        console.error('Search failed:', err);
        showEmpty('Pencarian Gagal', 'Gagal terhubung ke database. URL sumber mungkin sedang bermasalah.');
    }

    hideLoading();
}

// ===== Detail Page =====
async function showDetail(id, type) {
    showView('detail');
    setActiveNav('');
    detailSection.style.display = 'block';
    showLoading();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const apiType = (type === 'series') ? 'series' : 'movies';
        const data = await fetchAPI(`/${apiType}/${id}`);

        if (data && data.title) {
            renderDetail(data, id, type);
        } else {
            showEmpty('Detail Tidak Tersedia', 'Konten ini belum tersedia atau sedang dalam perbaikan. Silakan coba film lain.');
        }
    } catch (err) {
        console.error('ShowDetail failed:', err);
        showEmpty('Gagal Memuat Detail', 'Terjadi kesalahan saat mengambil informasi. Harap periksa koneksi internet Anda.');
    } finally {
        hideLoading();
    }
}

// ===== Load Stream =====
async function loadStream(id, type) {
    const streamContainer = document.getElementById('streamContainer');
    if (!streamContainer) return;

    streamContainer.innerHTML = '<div class="loader"><div class="loader-ring"></div><p class="loader-text">Memuat stream...</p></div>';

    try {
        const apiType = type === 'series' ? 'series' : 'movies';
        const data = await fetchAPI(`/${apiType}/${id}/stream`);

        if (data && data.length > 0) {
            renderStreamSources(streamContainer, data);
        } else {
            streamContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; margin-bottom: 12px;">📡</div>
                    <p style="color: var(--text-secondary); font-size: 15px; margin-bottom: 8px;">Stream belum tersedia</p>
                    <p style="color: var(--text-muted); font-size: 13px;">Server mungkin sedang tidak aktif. Coba lagi nanti.</p>
                </div>
            `;
        }
    } catch (err) {
        streamContainer.innerHTML = '<p style="color: var(--text-muted); text-align:center; padding:20px;">Gagal memuat stream.</p>';
    }
}

// ===== Load Episode Stream (for series) =====
async function loadEpisodeStream(slug, type) {
    const streamContainer = document.getElementById('streamContainer');
    if (!streamContainer) return;

    streamContainer.innerHTML = '<div class="loader"><div class="loader-ring"></div><p class="loader-text">Memuat stream episode...</p></div>';

    try {
        const data = await fetchAPI(`/series/${slug}/stream`);

        if (data && data.length > 0) {
            renderStreamSources(streamContainer, data);
        } else {
            streamContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <p style="color: var(--text-muted); font-size: 13px;">Stream episode ini belum tersedia.</p>
                </div>
            `;
        }
    } catch (err) {
        streamContainer.innerHTML = '<p style="color: var(--text-muted); text-align:center; padding:20px;">Gagal memuat stream.</p>';
    }
}

// ===== Render Stream Sources =====
function getProxyUrl(originalUrl) {
    return `${API_BASE}/proxy?url=${encodeURIComponent(originalUrl)}`;
}

function renderStreamSources(container, sources) {
    // Store sources globally for player switching
    window._streamSources = sources;

    const proxyUrl = getProxyUrl(sources[0].link);

    let html = `
        <div class="stream-player" id="streamPlayer">
            <iframe src="${proxyUrl}" allowfullscreen allow="autoplay; encrypted-media; fullscreen" 
                id="streamIframe"
                style="width:100%; height:100%; border:none;"></iframe>
        </div>
        <div class="stream-sources">
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Pilih Server:</p>
            <div class="stream-buttons">
    `;

    sources.forEach((source, i) => {
        html += `<button class="source-btn ${i === 0 ? 'active' : ''}" onclick="switchStream(${i}, this)">${source.provider || 'Server ' + (i + 1)}</button>`;
    });

    html += `
            </div>
            <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <span style="font-size: 11px; color: var(--text-muted);">Buka di tab baru:</span>
                ${sources.map((s, i) => `
                    <a href="${s.link}" target="_blank" rel="noopener noreferrer" class="stream-ext-link" title="Buka ${s.provider || 'Server ' + (i + 1)} di tab baru">
                        🔗 ${s.provider || 'Server ' + (i + 1)}
                    </a>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function switchStream(index, btn) {
    const sources = window._streamSources;
    if (!sources || !sources[index]) return;

    const iframe = document.getElementById('streamIframe');
    if (iframe) {
        iframe.src = getProxyUrl(sources[index].link);
    }

    document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function changeSource(src, btn) {
    const iframe = document.querySelector('#streamPlayer iframe');
    if (iframe) iframe.src = getProxyUrl(src);
    document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ===== Render Functions =====
function renderGrid(items, type) {
    if (!items || items.length === 0) {
        showEmpty('Tidak ada konten', 'Coba cari dengan kata kunci lain.');
        return;
    }
    contentGrid.innerHTML = items.map((item, i) => createCardHTML(item, type, i)).join('');
}

function renderScrollRow(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!items || items.length === 0) return;
    container.innerHTML = items.slice(0, 15).map((item, i) => createCardHTML(item, type, i)).join('');
}

function createCardHTML(item, type, index = 0) {
    const itemType = item.type || type;
    const actualType = (itemType === 'series') ? 'series' : 'movie';
    const id = item._id || item.slug || item.id || '';
    const poster = item.poster || item.thumbnail || '';
    const title = item.title || 'Untitled';
    const year = item.year || '';
    const rating = item.rating || '';
    const quality = item.quality || '';
    const episodeLabel = item.episodeLabel || '';

    return `
        <div class="movie-card" onclick="showDetail('${id}', '${actualType}')" style="animation-delay: ${index * 0.05}s">
            ${quality ? `<span class="card-badge">${quality}</span>` : ''}
            ${episodeLabel ? `<span class="card-badge" style="background: #FFF; color: #000; border: 1px solid #000;">Ep ${episodeLabel}</span>` : ''}
            <img class="card-poster" src="${poster}" alt="${title}" loading="lazy"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 300%22><rect fill=%22%23000%22 width=%22200%22 height=%22300%22/><text x=%2250%25%22 y=%2250%25%22 fill=%22%23FFF%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 font-weight=%22bold%22>No Poster</text></svg>'">
            <div class="card-overlay">
                <div class="card-play">
                    <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
            </div>
            <div class="card-info">
                <h3 class="card-title" title="${title}">${title}</h3>
                <div class="card-meta">
                    ${rating ? `<span class="card-rating">★ ${rating}</span>` : ''}
                    ${year ? `<span class="card-year">${year}</span>` : ''}
                    ${actualType === 'series' ? '<span style="color: #000; background: var(--accent); padding: 0 5px; font-size:11px; font-weight:800;">SERIES</span>' : ''}
                </div>
            </div>
        </div>
    `;
}

function renderDetail(data, id, type) {
    const container = document.getElementById('detailContainer');
    const poster = data.poster || data.thumbnail || '';
    const title = data.title || 'Untitled';
    const description = data.description || data.synopsis || 'Tidak ada sinopsis tersedia.';
    const year = data.year || '';
    const rating = data.rating || '';
    const duration = data.duration || '';
    const quality = data.quality || '';
    const director = data.director || '';
    const cast = data.cast || [];
    const genres = data.genre || data.genres || [];
    const similar = data.similar || [];
    const episodes = data.episodes || [];

    let html = `
        <button class="detail-back" onclick="goBack()">
            ← Kembali
        </button>
        <div class="detail-layout">
            <div class="detail-poster">
                <img src="${poster}" alt="${title}"
                    onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 280 420%22><rect fill=%22%23000%22 width=%22280%22 height=%22420%22/><text x=%2250%25%22 y=%2250%25%22 fill=%22%23FFF%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22sans-serif%22 font-size=%2218%22 font-weight=%22bold%22>No Image</text></svg>'">
            </div>
            <div class="detail-info">
                <h1 class="detail-title">${title}</h1>
                <div class="detail-meta">
                    ${rating ? `<span class="meta-tag rating">★ ${rating}</span>` : ''}
                    ${year ? `<span class="meta-tag">📅 ${year}</span>` : ''}
                    ${duration ? `<span class="meta-tag">⏱ ${duration}</span>` : ''}
                    ${quality ? `<span class="meta-tag">🎬 ${quality}</span>` : ''}
                    ${director ? `<span class="meta-tag">🎬 ${director}</span>` : ''}
                </div>
                ${genres.length > 0 ? `
                    <div class="detail-genres">
                        ${genres.map(g => `<span class="genre-tag">${typeof g === 'string' ? g : g.name || g}</span>`).join('')}
                    </div>
                ` : ''}
                ${cast.length > 0 ? `
                    <div style="margin-bottom: 16px;">
                        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">Cast:</p>
                        <p style="font-size: 14px; color: var(--text-secondary);">${cast.join(', ')}</p>
                    </div>
                ` : ''}
                <p class="detail-synopsis">${description}</p>
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="loadStream('${id}', '${type}')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Tonton Sekarang
                    </button>
                </div>
            </div>
        </div>

        <div class="stream-section">
            <h3>🎥 Streaming</h3>
            <div id="streamContainer">
                <p style="color: var(--text-muted); text-align: center; padding: 20px;">Klik "Tonton Sekarang" untuk memuat streaming.</p>
            </div>
    `;

    // Episode list for series (from API data)
    if (type === 'series' && episodes.length > 0) {
        // Group episodes by season
        const seasons = {};
        episodes.forEach(ep => {
            const s = ep.season || 1;
            if (!seasons[s]) seasons[s] = [];
            seasons[s].push(ep);
        });

        const seasonNums = Object.keys(seasons).sort((a, b) => a - b);

        html += `
            <div class="episode-selector">
                <h4>Pilih Episode (${episodes.length} episode)</h4>
                <div class="season-tabs" id="seasonTabs">
                    ${seasonNums.map((s, i) => `
                        <button class="season-tab ${i === 0 ? 'active' : ''}" onclick="showSeason(${s})">${seasonNums.length > 1 ? 'Season ' + s : 'Season 1'}</button>
                    `).join('')}
                </div>
                ${seasonNums.map((s, i) => `
                    <div class="episode-grid season-group ${i === 0 ? '' : 'hidden'}" data-season="${s}" id="seasonGroup${s}">
                        ${seasons[s].map((ep, idx) => `
                            <button class="episode-btn ${idx === 0 && i === 0 ? 'active' : ''}" onclick="playEpisode('${ep.slug}', '${type}', this)" title="${ep.title || 'Episode ' + (idx + 1)}">
                                ${ep.title ? ep.title.replace(/^Episode\s*/i, 'Ep ') : 'Ep ' + (idx + 1)}
                            </button>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Similar movies
    if (similar.length > 0) {
        html += `
            <div style="margin-top: 28px;">
                <h4 style="margin-bottom: 14px; font-size: 15px; color: var(--text-secondary);">Film Serupa</h4>
                <div class="scroll-row">
                    ${similar.map((item, i) => createCardHTML(item, 'movie', i)).join('')}
                </div>
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;
}

function showSeason(seasonNum) {
    document.querySelectorAll('.season-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.season-group').forEach(g => g.classList.add('hidden'));
    const target = document.getElementById('seasonGroup' + seasonNum);
    if (target) target.classList.remove('hidden');
}

function playEpisode(slug, type, btn) {
    document.querySelectorAll('.episode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadEpisodeStream(slug, type);
}

function renderPagination(currentPageNum, loaderName) {
    let html = '';

    if (currentPageNum > 1) {
        html += `<button class="page-btn" onclick="${loaderName}(${currentPageNum - 1})">← Prev</button>`;
    }

    for (let i = Math.max(1, currentPageNum - 2); i <= currentPageNum + 2; i++) {
        html += `<button class="page-btn ${i === currentPageNum ? 'active' : ''}" onclick="${loaderName}(${i})">${i}</button>`;
    }

    html += `<button class="page-btn" onclick="${loaderName}(${currentPageNum + 1})">Next →</button>`;

    pagination.innerHTML = html;
}

function goBack() {
    switch (currentType) {
        case 'series': loadSeries(); break;
        default: loadMovies();
    }
}

// ===== UI Helpers =====
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showEmpty(title, text) {
    contentGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-icon">🎬</div>
            <h3 class="empty-title">${title}</h3>
            <p class="empty-text">${text}</p>
        </div>
    `;
    pagination.innerHTML = '';
}
