// Инициализация главной страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchTabs();
    initializeDropdowns();
    initializeMobileMenu();
    initializeSearchForm();
    
    // Инициализируем счетчики после небольшой задержки
    setTimeout(initializeStatsCounters, 500);
    
    // Инициализируем активность
    initializeActivityFeed();
    
    // Инициализируем новостную ленту
    initializeNewsScroll();
});

// Инициализация вкладок поиска
function initializeSearchTabs() {
    const searchTabs = document.querySelectorAll('.search-tab');
    const searchInput = document.querySelector('.search-input');
    
    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем активный класс у всех вкладок
            searchTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Обновляем placeholder
            const tabType = this.dataset.tab;
            updateSearchPlaceholder(tabType, searchInput);
        });
    });
}

// Обновление placeholder поиска
function updateSearchPlaceholder(tabType, input) {
    const placeholders = {
        venues: 'Например: банкетный зал, ресторан, загородный клуб...',
        artists: 'Например: ведущий, музыкант, DJ, танцоры...',
        vendors: 'Например: фотограф, кейтеринг, декор, звук...',
        agencies: 'Например: свадебное агентство, event-агентство...'
    };
    
    if (input && placeholders[tabType]) {
        input.placeholder = placeholders[tabType];
    }
}

// Инициализация выпадающих меню
function initializeDropdowns() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown');
        if (!dropdown) return;
        
        let hoverTimeout;
        
        item.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdown.style.transform = 'translateY(0)';
        });
        
        item.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateY(-10px)';
            }, 150);
        });
    });
}

// Инициализация мобильного меню
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('mobile-active');
            this.classList.toggle('active');
            
            // Анимация иконки гамбургера
            this.innerHTML = this.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// Инициализация формы поиска
function initializeSearchForm() {
    const searchForm = document.querySelector('.search-form');
    const searchBtn = document.querySelector('.ww-search-button');
    const filterBtn = document.querySelector('.ww-filter-button');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performMainSearch();
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performMainSearch();
        });
    }
    
    if (filterBtn) {
        filterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showFilterModal();
        });
    }
}

// Выполнение главного поиска
function performMainSearch() {
    const activeTab = document.querySelector('.search-tab.active');
    const searchInput = document.querySelector('.search-input');
    const dateInput = document.querySelector('.date-input');
    const guestsSelect = document.querySelector('.search-input[type=""]') || 
                        document.querySelector('select.search-input');
    
    const searchData = {
        category: activeTab ? activeTab.dataset.tab : 'venues',
        query: searchInput ? searchInput.value.trim() : '',
        date: dateInput ? dateInput.value : '',
        guests: guestsSelect ? guestsSelect.value : ''
    };
    
    // Определяем куда перенаправить
    const redirectUrls = {
        venues: 'banquet-halls.html',
        artists: '#', // TODO: создать страницу артистов
        vendors: '#', // TODO: создать страницу подрядчиков  
        agencies: '#'  // TODO: создать страницу агентств
    };
    
    // Формируем URL с параметрами поиска
    const targetUrl = redirectUrls[searchData.category];
    const params = new URLSearchParams();
    
    if (searchData.query) params.append('q', searchData.query);
    if (searchData.date) params.append('date', searchData.date);
    if (searchData.guests) params.append('guests', searchData.guests);
    
    const finalUrl = params.toString() ? 
        `${targetUrl}?${params.toString()}` : targetUrl;
    
    // Анимация кнопки
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            searchBtn.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Переход на страницу результатов
    if (targetUrl !== '#') {
        window.location.href = finalUrl;
    } else {
        showNotification('Эта категория еще в разработке');
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">✕</button>
    `;
    
    // Добавляем стили для уведомления
    const style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #e1e8ed;
        border-radius: 8px;
        padding: 16px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
    `;
    
    notification.style.cssText = style;
    
    if (type === 'success') {
        notification.style.borderLeftColor = '#10b981';
        notification.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
        notification.style.borderLeftColor = '#ef4444';
        notification.style.borderLeftWidth = '4px';
    } else {
        notification.style.borderLeftColor = '#ff6b35';
        notification.style.borderLeftWidth = '4px';
    }
    
    document.body.appendChild(notification);
    
    // Обработчик закрытия
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Автозакрытие через 5 секунд
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Обработка кликов по категориям
document.addEventListener('click', function(e) {
    // Клик по карточке категории
    if (e.target.closest('.category-item')) {
        const categoryItem = e.target.closest('.category-item');
        const href = categoryItem.getAttribute('href');
        
        if (href && href !== '#') {
            // Анимация перед переходом
            categoryItem.style.transform = 'scale(0.95)';
            setTimeout(() => {
                window.location.href = href;
            }, 150);
            e.preventDefault();
        } else {
            e.preventDefault();
            showNotification('Эта категория еще в разработке');
        }
    }
    
    // Клик по карточке услуги
    if (e.target.closest('.service-card')) {
        const serviceCard = e.target.closest('.service-card');
        serviceCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            serviceCard.style.transform = 'translateY(-2px)';
            showNotification('Эта услуга еще в разработке');
        }, 150);
    }
});

// Плавная прокрутка к якорям
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Анимации при скролле
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами
    const animatedElements = document.querySelectorAll(`
        .category-item,
        .service-card,
        .stat-item
    `);
    
    animatedElements.forEach(el => observer.observe(el));
}

// CSS анимации
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        color: #333;
    }
    
    .mobile-active {
        display: block !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e1e8ed;
        border-top: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-active .nav-list {
        flex-direction: column;
        padding: 20px;
        gap: 16px;
    }
    
    .mobile-active .dropdown {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        margin-top: 8px;
        margin-left: 16px;
    }
    
    @keyframes statsPulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
`;

document.head.appendChild(animationStyles);

// Инициализация счетчиков статистики
function initializeStatsCounters() {
    const statsItems = document.querySelectorAll('.stat-item[data-count]');
    
    if (statsItems.length === 0) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statsItems.forEach(item => {
        observer.observe(item);
    });
}

// Анимация счетчика
function animateCounter(element) {
    // Проверяем, не запущена ли уже анимация
    if (element.dataset.animated === 'true') {
        return;
    }
    
    const target = parseFloat(element.dataset.count);
    const numberElement = element.querySelector('.stat-number');
    
    if (!numberElement) {
        return;
    }
    
    // Помечаем элемент как анимируемый
    element.dataset.animated = 'true';
    
    const duration = 2000; // 2 секунды
    const startTime = performance.now();
    
    // Определяем формат (процент, рейтинг или число с плюсом)
    const isPercentage = numberElement.textContent.includes('%');
    const isPlus = numberElement.textContent.includes('+');
    const isRating = target < 10 && target > 1; // рейтинг от 1 до 10
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Эффект ease-out
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;
        
        if (isRating) {
            numberElement.textContent = current.toFixed(1);
        } else if (isPercentage) {
            numberElement.textContent = Math.round(current) + '%';
        } else if (isPlus) {
            numberElement.textContent = Math.round(current) + '+';
        } else {
            numberElement.textContent = Math.round(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    // Добавляем pulse эффект
    element.style.animation = 'statsPulse 0.6s ease-out';
    
    requestAnimationFrame(updateCounter);
}

// Показ модального окна фильтров
function showFilterModal() {
    // Анимация кнопки
    const filterBtn = document.querySelector('.ww-filter-button');
    if (filterBtn) {
        filterBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            filterBtn.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Пока показываем уведомление
    showNotification('Расширенные фильтры скоро будут добавлены', 'info');
}

// Инициализация ленты активности
function initializeActivityFeed() {
    // Обновляем счетчик просмотров
    updateLiveViewers();
    setInterval(updateLiveViewers, 15000); // каждые 15 секунд
    
    // Обновляем время в активности
    updateActivityTimes();
    setInterval(updateActivityTimes, 60000); // каждую минуту
    
    // Добавляем анимацию появления для элементов активности
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Обновление счетчика просмотров
function updateLiveViewers() {
    const viewersElement = document.getElementById('live-viewers');
    if (viewersElement) {
        const currentCount = parseInt(viewersElement.textContent);
        const variation = Math.floor(Math.random() * 10) - 5; // ±5
        const newCount = Math.max(30, Math.min(80, currentCount + variation));
        viewersElement.textContent = newCount;
    }
}

// Обновление времени активности
function updateActivityTimes() {
    const timeElements = document.querySelectorAll('.activity-time');
    timeElements.forEach(element => {
        const currentText = element.textContent;
        const match = currentText.match(/(\d+)/);
        if (match) {
            const minutes = parseInt(match[1]) + 1;
            element.textContent = `${minutes} минут${minutes === 1 ? 'у' : minutes < 5 ? 'ы' : ''} назад`;
        }
    });
}

// Инициализация новостной ленты
function initializeNewsScroll() {
    const newsScroll = document.querySelector('.news-scroll');
    const prevBtn = document.querySelector('.news-prev');
    const nextBtn = document.querySelector('.news-next');
    
    if (!newsScroll || !prevBtn || !nextBtn) return;
    
    const cardWidth = 300 + 24; // ширина карточки + gap
    let currentPosition = 0;
    
    // Обработчики кнопок
    prevBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition--;
            updateScroll();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const maxPosition = Math.max(0, newsScroll.children.length - getVisibleCards());
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateScroll();
        }
    });
    
    // Обновление прокрутки
    function updateScroll() {
        const scrollLeft = currentPosition * cardWidth;
        newsScroll.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        updateButtons();
    }
    
    // Обновление состояния кнопок
    function updateButtons() {
        const maxPosition = Math.max(0, newsScroll.children.length - getVisibleCards());
        prevBtn.disabled = currentPosition === 0;
        nextBtn.disabled = currentPosition >= maxPosition;
    }
    
    // Получение количества видимых карточек
    function getVisibleCards() {
        const containerWidth = newsScroll.parentElement.offsetWidth;
        return Math.floor(containerWidth / cardWidth);
    }
    
    // Поддержка прокрутки мышью/тачем
    newsScroll.addEventListener('scroll', () => {
        currentPosition = Math.round(newsScroll.scrollLeft / cardWidth);
        updateButtons();
    });
    
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentPosition = Math.min(currentPosition, Math.max(0, newsScroll.children.length - getVisibleCards()));
            updateScroll();
        }, 250);
    });
    
    // Анимация появления карточек
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Добавляем клики по карточкам
    newsCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
                showNotification('Статья скоро будет доступна для чтения', 'info');
            }, 150);
        });
    });
    
    // Инициализация
    updateButtons();
}

// Инициализация анимаций при загрузке
window.addEventListener('load', initializeScrollAnimations);