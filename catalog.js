// Инициализация каталога
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSearch();
    initializePagination();
    initializeVenueCards();
});

// Инициализация фильтров
function initializeFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    const sortSelect = document.querySelector('.sort-select');
    const resetBtn = document.querySelector('.filter-reset');

    // Обработчики изменения фильтров
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            applyFilters();
        });
    });

    // Обработчик сортировки
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applySorting(this.value);
        });
    }

    // Сброс фильтров
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
}

// Инициализация поиска
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput) {
        // Поиск при вводе с задержкой
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value.trim());
            }, 300);
        });

        // Поиск по кнопке
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                performSearch(searchInput.value.trim());
            });
        }

        // Поиск по Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value.trim());
            }
        });
    }
}

// Инициализация пагинации
function initializePagination() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const paginationNumbers = document.querySelectorAll('.pagination-number');

    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                const isNext = this.classList.contains('pagination-next');
                changePage(isNext ? 'next' : 'prev');
            }
        });
    });

    paginationNumbers.forEach(number => {
        number.addEventListener('click', function() {
            const page = parseInt(this.textContent);
            changePage(page);
        });
    });
}

// Инициализация карточек площадок
function initializeVenueCards() {
    const venueCards = document.querySelectorAll('.venue-card');
    
    venueCards.forEach(card => {
        // Анимация при скролле
        observeCard(card);
        
        // Клик по карточке
        card.addEventListener('click', function(e) {
            // Проверяем, что клик не по кнопке
            if (!e.target.closest('.btn')) {
                window.location.href = 'venue-detail.html';
            }
        });
    });
}

// Применение фильтров
function applyFilters() {
    const cards = document.querySelectorAll('.venue-card');
    const filters = getActiveFilters();
    
    cards.forEach(card => {
        const matchesFilters = checkCardAgainstFilters(card, filters);
        
        if (matchesFilters) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    updateResultsCount();
}

// Получение активных фильтров
function getActiveFilters() {
    const filters = {};
    
    const capacityFilter = document.querySelector('.filter-select[data-filter="capacity"]') || 
                          document.querySelector('.filter-group:nth-child(1) .filter-select');
    const priceFilter = document.querySelector('.filter-select[data-filter="price"]') || 
                       document.querySelector('.filter-group:nth-child(2) .filter-select');
    const districtFilter = document.querySelector('.filter-select[data-filter="district"]') || 
                          document.querySelector('.filter-group:nth-child(3) .filter-select');
    const featuresFilter = document.querySelector('.filter-select[data-filter="features"]') || 
                          document.querySelector('.filter-group:nth-child(4) .filter-select');
    
    if (capacityFilter && capacityFilter.value) {
        filters.capacity = parseInt(capacityFilter.value);
    }
    
    if (priceFilter && priceFilter.value) {
        filters.price = parseInt(priceFilter.value);
    }
    
    if (districtFilter && districtFilter.value) {
        filters.district = districtFilter.value;
    }
    
    if (featuresFilter && featuresFilter.value) {
        filters.features = featuresFilter.value;
    }
    
    return filters;
}

// Проверка карточки против фильтров
function checkCardAgainstFilters(card, filters) {
    // Проверка вместимости
    if (filters.capacity) {
        const cardCapacity = parseInt(card.dataset.capacity) || 0;
        if (filters.capacity === 300) { // "Более 200"
            if (cardCapacity <= 200) return false;
        } else {
            if (cardCapacity > filters.capacity) return false;
        }
    }
    
    // Проверка цены
    if (filters.price) {
        const cardPrice = parseInt(card.dataset.price) || 0;
        if (filters.price === 5000) { // "Более 4000"
            if (cardPrice <= 4000) return false;
        } else {
            if (cardPrice > filters.price) return false;
        }
    }
    
    // Проверка района
    if (filters.district) {
        const cardDistrict = card.dataset.district || '';
        if (cardDistrict !== filters.district) return false;
    }
    
    // Проверка особенностей
    if (filters.features) {
        const cardFeatures = card.querySelector('.venue-features');
        if (!cardFeatures) return false;
        
        const featureText = cardFeatures.textContent.toLowerCase();
        const requiredFeature = getFeatureText(filters.features);
        
        if (!featureText.includes(requiredFeature)) return false;
    }
    
    return true;
}

// Получение текста особенности
function getFeatureText(featureValue) {
    const featureMap = {
        'parking': 'парковка',
        'alcohol': 'алкоголь',
        'catering': 'кейтеринг',
        'late': '23:00'
    };
    
    return featureMap[featureValue] || '';
}

// Применение сортировки
function applySorting(sortType) {
    const container = document.querySelector('.venues-grid');
    const cards = Array.from(container.querySelectorAll('.venue-card'));
    
    cards.sort((a, b) => {
        switch (sortType) {
            case 'rating':
                return getRating(b) - getRating(a);
            case 'price-asc':
                return getPrice(a) - getPrice(b);
            case 'price-desc':
                return getPrice(b) - getPrice(a);
            case 'capacity':
                return getCapacity(b) - getCapacity(a);
            default: // popular
                return 0; // Оставляем исходный порядок
        }
    });
    
    // Перестраиваем DOM
    cards.forEach(card => container.appendChild(card));
    
    // Анимация появления
    cards.forEach((card, index) => {
        card.style.animation = `fadeIn 0.3s ease-out ${index * 0.1}s`;
    });
}

// Вспомогательные функции для сортировки
function getRating(card) {
    const ratingElement = card.querySelector('.rating-stars');
    if (!ratingElement) return 0;
    return parseFloat(ratingElement.textContent.replace('★ ', '')) || 0;
}

function getPrice(card) {
    return parseInt(card.dataset.price) || 0;
}

function getCapacity(card) {
    return parseInt(card.dataset.capacity) || 0;
}

// Поиск
function performSearch(query) {
    const cards = document.querySelectorAll('.venue-card');
    
    if (!query) {
        cards.forEach(card => {
            card.style.display = 'block';
        });
        updateResultsCount();
        return;
    }
    
    const searchTerms = query.toLowerCase().split(' ');
    
    cards.forEach(card => {
        const cardText = getCardSearchText(card).toLowerCase();
        const matches = searchTerms.every(term => cardText.includes(term));
        
        if (matches) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    updateResultsCount();
}

// Получение текста для поиска из карточки
function getCardSearchText(card) {
    const name = card.querySelector('.venue-name')?.textContent || '';
    const location = card.querySelector('.venue-location')?.textContent || '';
    const features = card.querySelector('.venue-features')?.textContent || '';
    
    return `${name} ${location} ${features}`;
}

// Сброс фильтров
function resetFilters() {
    // Сбрасываем все селекты
    const selects = document.querySelectorAll('.filter-select, .sort-select');
    selects.forEach(select => {
        select.value = '';
    });
    
    // Очищаем поиск
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Показываем все карточки
    const cards = document.querySelectorAll('.venue-card');
    cards.forEach(card => {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease-out';
    });
    
    updateResultsCount();
}

// Изменение страницы
function changePage(direction) {
    const currentPage = document.querySelector('.pagination-number.active');
    if (!currentPage) return;
    
    const currentPageNum = parseInt(currentPage.textContent);
    let newPageNum;
    
    if (direction === 'next') {
        newPageNum = currentPageNum + 1;
    } else if (direction === 'prev') {
        newPageNum = currentPageNum - 1;
    } else {
        newPageNum = direction; // Прямое указание номера страницы
    }
    
    // Обновляем активную страницу
    document.querySelectorAll('.pagination-number').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === newPageNum) {
            btn.classList.add('active');
        }
    });
    
    // Обновляем состояние кнопок
    updatePaginationButtons();
    
    // Прокручиваем к началу каталога
    const catalog = document.querySelector('.venues-catalog');
    if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Обновление состояния кнопок пагинации
function updatePaginationButtons() {
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');
    const currentPage = document.querySelector('.pagination-number.active');
    
    if (!currentPage) return;
    
    const currentPageNum = parseInt(currentPage.textContent);
    const maxPage = 8; // Предполагаем максимум 8 страниц
    
    if (prevBtn) {
        prevBtn.disabled = currentPageNum <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPageNum >= maxPage;
    }
}

// Обновление счетчика результатов
function updateResultsCount() {
    const visibleCards = document.querySelectorAll('.venue-card[style*="display: block"], .venue-card:not([style*="display: none"])');
    const totalCards = document.querySelectorAll('.venue-card');
    
    // Можно добавить отображение количества результатов
    console.log(`Показано ${visibleCards.length} из ${totalCards.length} площадок`);
}

// Наблюдение за карточками для анимации при скролле
function observeCard(card) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.5s ease-out';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    observer.observe(card);
}

// Анимация fadeIn для CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);