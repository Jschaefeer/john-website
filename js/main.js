/* Armonk-Somers Podiatry — shared behaviour */

document.addEventListener('DOMContentLoaded', () => {
    setCopyrightYear();
    initHeader();
    initMobileMenu();
    initTodayHours();
    initReviewTrack();
    initAccordions();
    initDisclosureLinks();
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

/* Highlight today's hours row in each office card and show open or closed */
function initTodayHours() {
    const today = String(new Date().getDay());
    document.querySelectorAll('.hours').forEach((list) => {
        const row = Array.from(list.querySelectorAll('[data-days]'))
            .find((li) => li.dataset.days.split(' ').includes(today));
        if (row) row.classList.add('is-today');
        const card = list.closest('.card');
        const status = card && card.querySelector('[data-open-status]');
        if (!status) return;
        status.textContent = row ? `Open today, ${row.lastElementChild.textContent.trim()}` : 'Closed today';
        status.classList.toggle('is-closed', !row);
        status.hidden = false;
    });
}

/* Review cards: arrow buttons scroll the track one card at a time */
function initReviewTrack() {
    const track = document.querySelector('[data-review-track]');
    if (!track) return;
    const prev = document.querySelector('[data-review-prev]');
    const next = document.querySelector('[data-review-next]');

    const step = () => {
        const card = track.firstElementChild;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    };
    const update = () => {
        const max = track.scrollWidth - track.clientWidth - 2;
        if (prev) prev.disabled = track.scrollLeft <= 2;
        if (next) next.disabled = track.scrollLeft >= max;
    };

    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
}

/* Expandable sections open and close by animating their height, so the
   content below is pushed down and pulled back up smoothly. */
function initAccordions() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.accordion details').forEach((d) => {
        const summary = d.querySelector('summary');
        if (!summary || typeof d.animate !== 'function') return;

        let anim = null;
        let target = d.open;
        // Keep in sync when opened from code (e.g. a #link)
        d.addEventListener('toggle', () => { if (!anim) target = d.open; });

        const closedHeight = () => summary.offsetHeight + (d.offsetHeight - d.clientHeight);

        summary.addEventListener('click', (e) => {
            if (reduce.matches) return;
            e.preventDefault();

            const from = d.offsetHeight;
            if (anim) anim.cancel();
            target = !target;

            d.classList.add('is-animating');
            d.classList.toggle('is-closing', !target);
            if (target) d.open = true;
            const to = target ? d.offsetHeight : closedHeight();

            anim = d.animate(
                { height: [`${from}px`, `${to}px`] },
                { duration: Math.min(520, 260 + Math.abs(to - from) * 0.25), easing: 'cubic-bezier(0.3, 0.7, 0.2, 1)' }
            );
            anim.onfinish = () => {
                anim = null;
                d.classList.remove('is-animating', 'is-closing');
                if (!target) d.open = false;
            };
        });
    });
}

/* Expandable sections with an id open from links like services.html#bunion-surgery,
   and keep the address bar in sync so an open section can be shared. */
function initDisclosureLinks() {
    const openFromHash = () => {
        const id = decodeURIComponent(location.hash.slice(1));
        const el = id && document.getElementById(id);
        if (!el || el.tagName !== 'DETAILS') return;
        el.open = true;
        requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
    };

    document.querySelectorAll('details[id]').forEach((d) => {
        d.addEventListener('toggle', () => {
            const hash = `#${d.id}`;
            if (d.open && location.hash !== hash) history.replaceState(null, '', hash);
            if (!d.open && location.hash === hash) history.replaceState(null, '', location.pathname + location.search);
        });
    });

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
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
