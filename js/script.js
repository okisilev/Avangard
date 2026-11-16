document.addEventListener('DOMContentLoaded', () => {

    /* ============ 1. КАТАЛОГ ТУРОВ (рендер из массива) ============ */
    const tours = [
        { title: 'Мадагаскар', dates: '26 ноября — 02 декабря 2026', days: '7 дней', img: 'https://picsum.photos/id/1018/600/800', badge: 'NEW' },
        { title: 'Альпы на суперкарах', dates: '26 — 30 января 2027', days: '5 дней', img: 'https://picsum.photos/id/1036/600/800', badge: '' },
        { title: 'Патагония', dates: '17 — 25 февраля 2027', days: '9 дней', img: 'https://picsum.photos/id/1039/600/800', badge: '' },
        { title: 'Байкал', dates: '24 — 28 февраля 2027', days: '5 дней', img: 'https://picsum.photos/id/1043/600/800', badge: '' },
        { title: 'Япония', dates: '19 — 26 апреля 2027', days: '8 дней', img: 'https://picsum.photos/id/1040/600/800', badge: '' },
        { title: 'Исландия', dates: '10 — 17 августа 2027', days: '8 дней', img: 'https://picsum.photos/id/1044/600/800', badge: '' },
        { title: 'Камчатка', dates: '05 — 11 сентября 2027', days: '7 дней', img: 'https://picsum.photos/id/1050/600/800', badge: '' },
        { title: 'Антарктида 2028', dates: '12 — 22 февраля 2028', days: '11 дней', img: 'https://picsum.photos/id/1051/600/800', badge: 'ХИТ' }
    ];

    const grid = document.getElementById('toursGrid');
    if (grid) {
        grid.innerHTML = tours.map(t => `
            <article class="tour-card">
                <img src="${t.img}" alt="${t.title}" class="tour-card__img" loading="lazy">
                <div class="tour-card__overlay"></div>
                <div class="tour-card__content">
                    <h3 class="tour-card__title">${t.title}</h3>
                    <div class="tour-card__meta">${t.dates}</div>
                    <div class="tour-card__meta">${t.days}</div>
                    ${t.badge ? `<span class="tour-card__badge">${t.badge}</span>` : ''}
                </div>
            </article>
        `).join('');
    }

    /* ============ 2. ШАПКА ПРИ СКРОЛЛЕ ============ */
    const header = document.getElementById('header');
    const onScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    /* ============ 3. БУРГЕР-МЕНЮ ============ */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        // Закрытие при клике на ссылку
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    /* ============ 4. АНИМИРОВАННЫЕ СЧЕТЧИКИ ============ */
    const stats = document.querySelectorAll('.stat__number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            statsAnimated = true;
            stats.forEach(el => {
                const target = +el.dataset.target;
                const duration = 1800;
                const start = performance.now();

                const update = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    // Ease-out
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(update);
                    else el.textContent = target + (target >= 1000 ? '+' : '');
                };
                requestAnimationFrame(update);
            });
        }
    };
    window.addEventListener('scroll', animateStats);
    animateStats();

    /* ============ 5. ПЛАВНОЕ ПОЯВЛЕНИЕ СЕКЦИЙ ============ */
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.testimonial-card, .advantage, .tour-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });

    /* ============ 6. ФОРМА ОБРАТНОЙ СВЯЗИ ============ */
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.name.value.trim();
            const phone = form.phone.value.trim();
            const email = form.email.value.trim();

            if (!name || !phone || !email) {
                note.textContent = 'Пожалуйста, заполните все поля.';
                note.style.color = '#5E1219';
                return;
            }

            // Здесь можно добавить отправку на сервер (fetch / AJAX)
            note.textContent = `Спасибо, ${name}! Мы свяжемся с вами в ближайшее время.`;
            note.style.color = '#1A3B2B';
            form.reset();
        });
    }

    /* ============ 7. КУРСЫ ВАЛЮТ (ЦБ РФ + БИТКОИН) ============ */
    async function fetchRates() {
        const usdEl = document.getElementById('rate-usd');
        const eurEl = document.getElementById('rate-eur');
        const btcEl = document.getElementById('rate-btc');

        if (!usdEl || !eurEl || !btcEl) return;

        // Ставим состояние загрузки
        [usdEl, eurEl, btcEl].forEach(el => {
            el.textContent = 'загрузка...';
            el.classList.add('loading');
        });

        // --- 7.1 Курсы ЦБ РФ (USD и EUR) ---
        // Используем cbr-xml-daily.ru — это зеркало официальных данных ЦБ РФ в формате JSON.
        // Оно отдает заголовок Access-Control-Allow-Origin: *, поэтому работает из браузера.
        try {
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            if (!response.ok) throw new Error('CBR API error');
            const data = await response.json();

            // Структура ответа: { Valute: { USD: { Value: 85.03 }, EUR: { Value: 94.22 }, ... } }
            if (data && data.Valute) {
                if (data.Valute.USD) {
                    usdEl.textContent = `${data.Valute.USD.Value.toFixed(2)} ₽`;
                    usdEl.classList.remove('loading');
                }
                if (data.Valute.EUR) {
                    eurEl.textContent = `${data.Valute.EUR.Value.toFixed(2)} ₽`;
                    eurEl.classList.remove('loading');
                }
            } else {
                throw new Error('Invalid data structure');
            }
        } catch (error) {
            console.warn('Ошибка загрузки курсов ЦБ:', error);
            usdEl.textContent = '— ₽';
            eurEl.textContent = '— ₽';
            usdEl.classList.remove('loading');
            eurEl.classList.remove('loading');
        }

        // --- 7.2 Курс Биткоина ---
        // Используем публичный API Coinbase. Он отдает курсы криптовалют к фиату.
        // Запрос: 1 BTC = ? RUB
        try {
            const responseBtc = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC');
            if (!responseBtc.ok) throw new Error('BTC API error');
            const dataBtc = await responseBtc.json();

            // Структура: { data: { rates: { RUB: "6294045.12", ... } } }
            if (dataBtc && dataBtc.data && dataBtc.data.rates && dataBtc.data.rates.RUB) {
                const btcRate = parseFloat(dataBtc.data.rates.RUB);
                btcEl.textContent = `${btcRate.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽`;
                btcEl.classList.remove('loading');
            } else {
                throw new Error('Invalid BTC data');
            }
        } catch (error) {
            console.warn('Ошибка загрузки курса BTC:', error);
            btcEl.textContent = '— ₽';
            btcEl.classList.remove('loading');
        }
    }

    // Запускаем загрузку курсов
    fetchRates();
    // Опционально: обновлять курсы каждые 5 минут (300000 мс)
    setInterval(fetchRates, 300000);

    /* ============ 8. КНОПКА-БУРГЕР В КОНТАКТНОМ ВИДЖЕТЕ ============ */
    const widgetBurger = document.getElementById('widgetBurger');
    if (widgetBurger) {
        widgetBurger.addEventListener('click', () => {
            // Здесь можно повесить открытие модального меню или выдвижной панели.
            // Для примера, просто переключим класс у body для демонстрации.
            document.body.classList.toggle('widget-menu-open');

            // Если у вас есть основное меню в шапке (nav), можно синхронизировать:
            const mainNav = document.getElementById('nav');
            const mainBurger = document.getElementById('burger');
            if (mainNav && mainBurger) {
                mainNav.classList.toggle('active');
                mainBurger.classList.toggle('active');
            }
        });
    }


    /* ============ 9. МОДАЛЬНОЕ ОКНО ============ */
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalForm = document.getElementById('modalForm');

    // Функция открытия
    const openModal = (e) => {
        if (e) e.preventDefault();
        if (modalOverlay) modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл фона
    };

    // Функция закрытия
    const closeModal = () => {
        if (modalOverlay) modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Возвращаем скролл
    };

    // Находим кнопку "Поехали в путешествие" в шапке
    const openModalBtn = document.querySelector('.btn--white');

    // Вешаем события на кнопку в шапке
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }

    // Также ищем кнопку "Выбрать путешествие" в Hero, если нужно
    const openModalBtnHero = document.querySelector('.btn--accent');
    if (openModalBtnHero) {
        openModalBtnHero.addEventListener('click', openModal);
    }

    // Закрытие по крестику
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Закрытие по клику на затемненный фон
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Закрытие по клавише Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // --- Маска для телефона ---
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? '+7 ' + x[1] : '+7 ' + x[1] + ' ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
        });
    }

    // --- Отправка формы ---
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Здесь логика отправки данных на сервер
            alert('Форма успешно отправлена! (Заглушка)');
            closeModal();
            modalForm.reset();
        });
    }
    /* ============ 10. ЭФФЕКТ СТЕКА ДЛЯ КАРТОЧЕК ТУРОВ (МОБИЛЬНЫЕ) ============ */
    function initStackingCards() {
        // Работает только на мобильных устройствах
        if (window.innerWidth > 768) return;

        const cards = document.querySelectorAll('.tour-card');

        const updateCards = () => {
            cards.forEach((card, index) => {
                const nextCard = cards[index + 1];
                if (!nextCard) return;

                const cardRect = card.getBoundingClientRect();
                // Проверяем, насколько следующая карточка наехала на текущую
                const nextCardRect = nextCard.getBoundingClientRect();

                // Если верх следующей карточки находится близко к верху текущей
                const distance = cardRect.bottom - nextCardRect.top;

                if (distance > 0) {
                    // Рассчитываем прогресс наложения (от 0 до 1)
                    // 100 — это примерное расстояние, за которое происходит анимация
                    const progress = Math.min(distance / 100, 1);

                    // Уменьшаем масштаб и немного затемняем нижнюю карточку
                    const scale = 1 - (progress * 0.05); // Уменьшение до 0.95
                    const opacity = 1 - (progress * 0.3); // Затухание

                    card.style.transform = `scale(${scale})`;
                    card.style.opacity = opacity;
                } else {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                }
            });
        };

        // Слушаем скролл
        window.addEventListener('scroll', updateCards);

        // Инициализация при загрузке
        updateCards();
    }

    // Запускаем после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStackingCards);
    } else {
        initStackingCards();
    }

    // Перезапускаем при изменении размера окна
    window.addEventListener('resize', () => {
        // Сбрасываем стили, если вернулись на десктоп
        if (window.innerWidth > 768) {
            document.querySelectorAll('.tour-card').forEach(card => {
                card.style.transform = '';
                card.style.opacity = '';
            });
        }
        initStackingCards();
    });

});