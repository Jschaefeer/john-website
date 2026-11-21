/* Armonk-Somers Podiatry — shared behaviour */

document.addEventListener('DOMContentLoaded', () => {
    setCopyrightYear();
    initHeader();
    initMobileMenu();
    initTodayHours();
    initCarousels();
    initReveal();
});

function setCopyrightYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('.copyright-year').forEach((el) => { el.textContent = year; });
}

/* Hairline under the header once the page scrolls */
function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menu.hidden = !open;
        document.body.classList.toggle('menu-open', open);
    };

    toggle.addEventListener('click', () => setOpen(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1001px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
}

/* Highlight today's row in each hours table and show "Open today" */
function initTodayHours() {
    const today = new Date().getDay();
    document.querySelectorAll('.hours').forEach((table) => {
        const row = table.querySelector(`tr[data-day="${today}"]`);
        if (!row) return;
        row.classList.add('is-today');
        const card = table.closest('.office-card');
        const status = card && card.querySelector('[data-open-status]');
        if (status) {
            status.textContent = `Open today · ${row.querySelector('td').textContent.trim()}`;
            status.hidden = false;
        }
    });
}

/* Fade carousel with counter, arrows, keyboard and swipe */
function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach((root) => {
        const slides = Array.from(root.querySelectorAll('.quote'));
        const prev = root.querySelector('[data-prev]');
        const next = root.querySelector('[data-next]');
        const current = root.querySelector('[data-current]');
        const total = root.querySelector('[data-total]');
        if (slides.length < 2) return;

        let index = 0;
        const pad = (n) => String(n).padStart(2, '0');
        if (total) total.textContent = pad(slides.length);

        const go = (i) => {
            index = (i + slides.length) % slides.length;
            slides.forEach((s, n) => {
                const active = n === index;
                s.classList.toggle('is-active', active);
                s.setAttribute('aria-hidden', String(!active));
            });
            if (current) current.textContent = pad(index + 1);
        };

        prev && prev.addEventListener('click', () => go(index - 1));
        next && next.addEventListener('click', () => go(index + 1));

        root.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') go(index - 1);
            if (e.key === 'ArrowRight') go(index + 1);
        });

        let startX = null;
        root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        root.addEventListener('touchend', (e) => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
            startX = null;
        });
    });
}

/* Gentle fade-up as sections enter the viewport */
function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach((el) => io.observe(el));
}
