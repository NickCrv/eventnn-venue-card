// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeScrollEffects();
    initializeFavoriteButton();
    initializeImageGallery();
    initializePhoneReveal();
    initializeFloatingButtons();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }

    // Share button
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }

    // Calendar button
    const calendarBtn = document.querySelector('.calendar-btn');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', function() {
            alert('Открывается календарь занятости...');
        });
    }

    // Booking buttons
    const bookingBtns = document.querySelectorAll('.btn-primary, .book-btn');
    bookingBtns.forEach(btn => {
        if (btn.textContent.includes('Забронировать')) {
            btn.addEventListener('click', function() {
                alert('Открывается форма бронирования...');
            });
        }
    });

    // Message button
    const messageBtn = document.querySelector('.btn-secondary');
    if (messageBtn && messageBtn.textContent.includes('Написать')) {
        messageBtn.addEventListener('click', function() {
            alert('Открывается чат с площадкой...');
        });
    }

    // Review button
    const reviewBtn = document.querySelector('.reviews-actions .btn-primary');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', function() {
            alert('Открывается форма отзыва...');
        });
    }

    // Calculate price button
    const calculateBtn = document.querySelector('.pricing .btn-primary');
    if (calculateBtn && calculateBtn.textContent.includes('Рассчитать')) {
        calculateBtn.addEventListener('click', function() {
            alert('Открывается калькулятор стоимости...');
        });
    }

    // Messenger buttons
    const messengerBtns = document.querySelectorAll('.messenger-btn');
    messengerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const messenger = btn.textContent.toLowerCase();
            alert(`Открывается ${messenger}...`);
        });
    });

    // Show all reviews button
    const showAllReviewsBtn = document.querySelector('.reviews-actions .btn-outline');
    if (showAllReviewsBtn) {
        showAllReviewsBtn.addEventListener('click', function() {
            alert('Показать все отзывы...');
        });
    }

    // Show all venues button
    const showAllVenuesBtn = document.querySelector('.recommendations .btn-outline');
    if (showAllVenuesBtn) {
        showAllVenuesBtn.addEventListener('click', function() {
            alert('Показать все площадки...');
        });
    }

    // Show on map button
    const showMapBtn = document.querySelector('.show-map-btn');
    if (showMapBtn) {
        showMapBtn.addEventListener('click', function() {
            // Прокрутка к карте
            const mapSection = document.querySelector('.map-container');
            if (mapSection) {
                mapSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                showNotification('Карта открыта!');
            }
        });
    }

    // Map click handler
    const mapImage = document.querySelector('.map-image');
    if (mapImage) {
        mapImage.addEventListener('click', function() {
            // Открытие карты в Google Maps или Яндекс.Картах
            const address = 'г. Нижний Новгород, ул. Большая Покровская, 62';
            const encodedAddress = encodeURIComponent(address);
            const mapsUrl = `https://yandex.ru/maps/?text=${encodedAddress}`;
            
            window.open(mapsUrl, '_blank');
            showNotification('Открываются Яндекс.Карты...');
        });
    }

    // Recommendation cards
    const recCards = document.querySelectorAll('.recommendation-card');
    recCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = card.querySelector('.rec-title').textContent;
            alert(`Переход к площадке ${title}...`);
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Favorite button functionality
function initializeFavoriteButton() {
    const favoriteBtn = document.querySelector('.favorite-btn');
    let isFavorite = false;

    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            isFavorite = !isFavorite;
            
            if (isFavorite) {
                favoriteBtn.innerHTML = '❤️ В избранном';
                favoriteBtn.style.color = '#dc3545';
                favoriteBtn.style.borderColor = '#dc3545';
                showNotification('Добавлено в избранное!');
            } else {
                favoriteBtn.innerHTML = '♡ Избранное';
                favoriteBtn.style.color = '';
                favoriteBtn.style.borderColor = '';
                showNotification('Удалено из избранного');
            }
        });
    }
}

// Image gallery functionality
function initializeImageGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item:not(.show-more)');
    const showMoreBtn = document.querySelector('.gallery-item.show-more');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openImageModal(index);
        });
    });

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            alert('Открывается полная галерея...');
        });
    }
}

// Phone number reveal
function initializePhoneReveal() {
    const showPhoneBtn = document.querySelector('.show-phone');
    const phoneText = document.querySelector('.contact-item .contact-text');

    if (showPhoneBtn && phoneText) {
        showPhoneBtn.addEventListener('click', function() {
            phoneText.textContent = '+7 (831) 123-45-67';
            showPhoneBtn.style.display = 'none';
            showNotification('Номер телефона открыт!');
        });
    }
}

// Floating buttons
function initializeFloatingButtons() {
    const floatingBtns = document.querySelectorAll('.floating-btn');
    
    floatingBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Share functionality
function handleShare() {
    if (navigator.share) {
        navigator.share({
            title: 'Банкетный зал "Золотой Феникс"',
            text: 'Элегантный банкетный зал в центре Нижнего Новгорода',
            url: window.location.href
        }).then(() => {
            showNotification('Спасибо за то, что поделились!');
        }).catch(console.error);
    } else {
        // Fallback for browsers without Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Ссылка скопирована в буфер обмена!');
        }).catch(() => {
            // Fallback for clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Ссылка скопирована!');
        });
    }
}

// Image modal
function openImageModal(imageIndex) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeImageModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeImageModal()">×</button>
            <img src="https://via.placeholder.com/800x600/f0f0f0/666?text=Фото+${imageIndex + 1}" alt="Фото ${imageIndex + 1}">
            <div class="modal-nav">
                <button class="modal-prev" onclick="changeImage(-1)">‹</button>
                <span class="modal-counter">${imageIndex + 1} / 8</span>
                <button class="modal-next" onclick="changeImage(1)">›</button>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            transition: background-color 0.2s;
        }
        
        .modal-close:hover {
            background: rgba(0, 0, 0, 0.7);
        }
        
        .modal-content img {
            width: 100%;
            height: auto;
            max-height: 70vh;
            object-fit: contain;
        }
        
        .modal-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #f8f9fa;
        }
        
        .modal-prev, .modal-next {
            background: #007bff;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .modal-prev:hover, .modal-next:hover {
            background: #0056b3;
        }
        
        .modal-counter {
            font-size: 14px;
            color: #495057;
            font-weight: 500;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Store current image index
    window.currentImageIndex = imageIndex;
    window.totalImages = 8;
}

// Close image modal
function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Change image in modal
function changeImage(direction) {
    window.currentImageIndex += direction;
    
    if (window.currentImageIndex < 0) {
        window.currentImageIndex = window.totalImages - 1;
    } else if (window.currentImageIndex >= window.totalImages) {
        window.currentImageIndex = 0;
    }
    
    const img = document.querySelector('.modal-content img');
    const counter = document.querySelector('.modal-counter');
    
    if (img) {
        img.src = `https://via.placeholder.com/800x600/f0f0f0/666?text=Фото+${window.currentImageIndex + 1}`;
        img.alt = `Фото ${window.currentImageIndex + 1}`;
    }
    
    if (counter) {
        counter.textContent = `${window.currentImageIndex + 1} / ${window.totalImages}`;
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const modal = document.querySelector('.image-modal');
    
    if (modal) {
        switch(e.key) {
            case 'Escape':
                closeImageModal();
                break;
            case 'ArrowLeft':
                changeImage(-1);
                break;
            case 'ArrowRight':
                changeImage(1);
                break;
        }
    }
});

// Touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    
    const modal = document.querySelector('.image-modal');
    if (modal) {
        handleGesture();
    }
});

function handleGesture() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            changeImage(1);
        } else {
            // Swipe right - previous image
            changeImage(-1);
        }
    }
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(function() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
}, 100);

// Replace the scroll event listener with debounced version
window.removeEventListener('scroll', debouncedScrollHandler);
window.addEventListener('scroll', debouncedScrollHandler);

// Accessibility improvements
function improveAccessibility() {
    // Add ARIA labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Add proper focus management
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #007bff';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveAccessibility);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('Произошла ошибка. Пожалуйста, обновите страницу.');
});

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}