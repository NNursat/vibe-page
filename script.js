// Функция рендеринга карточек в HTML
function renderReleases(data) {
    const grid = document.getElementById('releases-grid');
    grid.innerHTML = ''; // Очищаем "Loading..."

    if (!data || data.length === 0) {
        grid.innerHTML = '<div class="loading-text">No releases found.</div>';
        return;
    }

    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card reveal';
        // Добавляем небольшую задержку для каждой следующей карточки (каскадный эффект)
        card.style.transitionDelay = `${index * 100}ms`; 
        
        // Получаем год релиза
        const year = item.release_date ? item.release_date.split('-')[0] : '';
        
        card.innerHTML = `
            <a href="${item.external_urls.spotify}" target="_blank">
                <img src="${item.images[0]?.url}" alt="${item.name} Cover">
                <div class="card-info">
                    <div class="card-title">${item.name}</div>
                    <div class="card-meta">
                        <span>${year}</span>
                        <span style="text-transform:uppercase">${item.album_type}</span>
                    </div>
                    <div class="spotify-btn">Listen on Spotify</div>
                </div>
            </a>
        `;
        grid.appendChild(card);
    });

    // Запускаем анимацию появления для новых элементов
    initScrollAnimation();
}

// Основная функция инициализации
async function init() {
    try {
        // Запрос к вашему Vercel API (файл api/releases.js)
        const response = await fetch('/api/releases');
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Фильтр дублей (Spotify часто отдает Clean и Explicit версии как разные альбомы)
        const uniqueReleases = [];
        const map = new Map();
        for (const item of data) {
            // Ключ уникальности - название альбома
            if(!map.has(item.name)){
                map.set(item.name, true);
                uniqueReleases.push(item);
            }
        }

        renderReleases(uniqueReleases);
        
    } catch (error) {
        console.error('Error fetching releases:', error);
        document.getElementById('releases-grid').innerHTML = 
            `<div class="loading-text">
                Error loading music.<br>
                Make sure the backend is deployed.
            </div>`;
    }
}

// Наблюдатель для анимации при скролле
function initScrollAnimation() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    init();
});