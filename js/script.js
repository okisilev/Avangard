document.addEventListener('DOMContentLoaded', () => {

    /* ============ 1. КАТАЛОГ ТУРОВ ============ */
    const tours = [
        {
            title: 'Мадагаскар',
            dates: '26 ноября — 02 декабря 2026',
            days: '7 дней',
            price: 'от 450 000 ₽',
            spots: 12,
            type: 'group',
            img: 'https://picsum.photos/id/1018/600/800',
            badge: 'NEW'
        },
        {
            title: 'Альпы на суперкарах',
            dates: '26 — 30 января 2027',
            days: '5 дней',
            price: 'от 600 000 ₽',
            spots: 8,
            type: 'group',
            img: 'https://picsum.photos/id/1036/600/800',
            badge: ''
        },
        {
            title: 'Антарктида 2027',
            dates: '12 — 22 февраля 2027',
            days: '11 дней',
            price: 'от 1 500 000 ₽',
            spots: 15,
            type: 'group',
            img: 'https://picsum.photos/id/1039/600/800',
            badge: 'ХИТ'
        },
        {
            title: 'Патагония: Аргентина и Чили',
            dates: '17 — 25 февраля 2027',
            days: '9 дней',
            price: 'от 800 000 ₽',
            spots: 10,
            type: 'group',
            img: 'https://picsum.photos/id/1043/600/800',
            badge: ''
        },
        {
            title: 'Байкал',
            dates: '24 — 28 февраля 2027',
            days: '5 дней',
            price: 'от 250 000 ₽',
            spots: 14,
            type: 'group',
            img: 'https://picsum.photos/id/1040/600/800',
            badge: ''
        },
        {
            title: 'Япония',
            dates: '19 — 26 апреля 2027',
            days: '8 дней',
            price: 'от 2 032 000 ₽',
            spots: 18,
            type: 'individual',
            img: 'https://picsum.photos/id/1044/600/800',
            badge: ''
        },
        {
            title: 'Исландия',
            dates: '10 — 17 августа 2027',
            days: '8 дней',
            price: 'от 550 000 ₽',
            spots: 12,
            type: 'individual',
            img: 'https://picsum.photos/id/1050/600/800',
            badge: ''
        },
        {
            title: 'Камчатка',
            dates: '05 — 11 сентября 2027',
            days: '7 дней',
            price: 'от 350 000 ₽',
            spots: 10,
            type: 'individual',
            img: 'https://picsum.photos/id/1051/600/800',
            badge: ''
        }
    ];

    const grid = document.getElementById('toursGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderTours(filter = 'group') {
        if (!grid) return;

        // Фильтруем туры
        const filteredTours = tours.filter(t => t.type === filter);

        grid.innerHTML = filteredTours.map(t => `
                <article class="tour-card">
                    <img src="${t.img}" alt="${t.title}" class="tour-card__img" loading="lazy">
                    <div class="tour-card__overlay"></div>
                    
                    <!-- Заголовок (виден всегда, даже в стеке) -->
                    <div class="tour-card__header">
                        <h3 class="tour-card__title">${t.title}</h3>
                    </div>
    
                    <!-- Контент (скрыт в неактивных карточках) -->
                    <div class="tour-card__body">
                        <div class="tour-card__meta">${t.dates} • ${t.days}</div>
                        <div class="tour-card__price">${t.price}</div>
                        
                        <div class="tour-card__footer">
                            ${t.badge ? `<span class="tour-card__badge">${t.badge}</span>` : '<span></span>'}
                            <div class="tour-card__spots">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                ${t.spots} мест
                            </div>
                        </div>
                    </div>
                </article>
            `).join('');

        // После рендера применяем логику стека (только на мобильных)
        if (window.innerWidth <= 768) {
            initStackingCards();
        }
    }

    // Обработка кликов по фильтрам
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTours(btn.dataset.filter);
            });
        });
    }

    // Инициализация при загрузке
    if (grid) {
        renderTours('group');
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

    /* ============ 3. БУРГЕР-МЕНЮ В ШАПКЕ ============ */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });
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

        [usdEl, eurEl, btcEl].forEach(el => {
            el.textContent = 'загрузка...';
            el.classList.add('loading');
        });

        try {
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            if (!response.ok) throw new Error('CBR API error');
            const data = await response.json();

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

        try {
            const responseBtc = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC');
            if (!responseBtc.ok) throw new Error('BTC API error');
            const dataBtc = await responseBtc.json();

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

    fetchRates();
    setInterval(fetchRates, 300000);

    /* ============ 8. КНОПКА-БУРГЕР В КОНТАКТНОМ ВИДЖЕТЕ ============ */
    const widgetBurger = document.getElementById('widgetBurger');
    if (widgetBurger) {
        widgetBurger.addEventListener('click', () => {
            document.body.classList.toggle('widget-menu-open');
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

    const openModal = (e) => {
        if (e) e.preventDefault();
        if (modalOverlay) modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (modalOverlay) modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Привязка кнопок к модальному окну
    const openModalBtn = document.getElementById('openModalBtn');
    const openModalBtnHero = document.getElementById('openModalBtnHero');

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);
    if (openModalBtnHero) openModalBtnHero.addEventListener('click', openModal);

    if (modalClose) modalClose.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
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

    // --- Отправка формы модального окна ---
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Форма успешно отправлена! (Заглушка)');
            closeModal();
            modalForm.reset();
        });
    }

    /* ============ 10. ЭФФЕКТ СТЕКА ДЛЯ КАРТОЧЕК ТУРОВ (МОБИЛЬНЫЕ) ============ */
    function initStackingCards() {
        const cards = document.querySelectorAll('.tour-card');

        // Сбрасываем все классы активности при новой инициализации (например, при смене фильтра)
        cards.forEach(c => c.classList.remove('is-active'));

        if (window.innerWidth > 768) return;

        cards.forEach(card => {
            // По клику раскрываем карточку и сворачиваем остальные
            card.addEventListener('click', function (e) {
                // Предотвращаем всплытие, чтобы клик не срабатывал на вложенных элементах
                e.stopPropagation();

                const isAlreadyActive = this.classList.contains('is-active');

                // Сворачиваем все карточки
                cards.forEach(c => c.classList.remove('is-active'));

                // Если карточка не была активна, делаем её активной
                if (!isAlreadyActive) {
                    this.classList.add('is-active');
                }
            });
        });
    }

    // Инициализация при первой загрузке
    if (window.innerWidth <= 768) {
        initStackingCards();
    }

    // Перезапуск при изменении размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Сбрасываем стили, если вернулись на десктоп
            document.querySelectorAll('.tour-card').forEach(card => {
                card.classList.remove('is-active');
            });
        } else {
            initStackingCards();
        }
    });

});