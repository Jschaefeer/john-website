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

/* Home page reveals: masked rise (no fade). Items entering together are
   staggered; the hero headline is split into words that rise one by one. */
function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    document.querySelectorAll('[data-reveal="words"]').forEach(splitWords);

    const show = (el, delay) => {
        el.style.setProperty('--reveal-delay', `${delay}ms`);
        el.classList.add('is-visible');
        if (el.dataset.reveal !== 'words') {
            el.addEventListener('transitionend', function done(e) {
                if (e.target !== el || e.propertyName !== 'clip-path') return;
                el.classList.add('is-revealed');
                el.removeEventListener('transitionend', done);
            });
        }
        // Custom icons draw their ink once, then only redraw on hover
        if (el.querySelector('.draw')) setTimeout(() => el.classList.add('is-drawn'), delay + 2000);
    };

    // Position check rather than IntersectionObserver: a fully clipped element
    // counts as invisible to the observer, so it would never be revealed.
    const pending = new Set(items);
    let queued = false;
    const check = () => {
        queued = false;
        const line = window.innerHeight * 0.9;
        let batch = 0;
        pending.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top > line) return;
            // Already scrolled past (e.g. after a jump): show at once, no stagger
            const delay = rect.bottom < 0 ? 0 : parseInt(el.dataset.revealDelay || '0', 10) + batch++ * 120;
            show(el, delay);
            pending.delete(el);
        });
        if (!pending.size) {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        }
    };
    const onScroll = () => {
        if (!queued) { queued = true; requestAnimationFrame(check); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();
}

/* Wrap each word in a mask so it can slide up on its own */
function splitWords(el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    let index = 0;
    const walk = (node) => {
        Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) { walk(child); return; }
            if (child.nodeType !== Node.TEXT_NODE) return;
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
                if (!part) return;
                if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                const mask = document.createElement('span');
                mask.className = 'rw';
                mask.setAttribute('aria-hidden', 'true');
                const word = document.createElement('span');
                word.textContent = part;
                word.style.setProperty('--wi', index++);
                mask.appendChild(word);
                frag.appendChild(mask);
            });
            child.replaceWith(frag);
        });
    };
    walk(el);
}
