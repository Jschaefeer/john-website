/* Insurance — live search over accepted plans */

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('plan-search');
    const list = document.querySelector('[data-plan-list]');
    if (!input || !list) return;

    const items = Array.from(list.children).map((li) => {
        const nameEl = li.querySelector('.plan-name');
        const name = nameEl.textContent;
        const tag = li.querySelector('.plan-tag');
        const haystack = [name, li.dataset.alias || '', tag ? tag.textContent : ''].join(' ').toLowerCase();
        return { li, nameEl, name, haystack };
    });

    const count = document.querySelector('[data-plan-count]');
    const empty = document.querySelector('[data-plan-empty]');
    const queryEl = document.querySelector('[data-plan-query]');

    const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

    const render = () => {
        const raw = input.value.trim();
        const q = normalize(raw);
        let shown = 0;

        items.forEach(({ li, nameEl, name, haystack }) => {
            const match = !q || q.split(' ').every((word) => normalize(haystack).includes(word));
            li.hidden = !match;
            if (match) shown += 1;

            // Highlight the query inside the plan name
            const at = q ? name.toLowerCase().indexOf(raw.toLowerCase()) : -1;
            nameEl.innerHTML = at > -1
                ? escape(name.slice(0, at)) + '<mark>' + escape(name.slice(at, at + raw.length)) + '</mark>' + escape(name.slice(at + raw.length))
                : escape(name);
        });

        count.textContent = q
            ? `${shown} of ${items.length} plans`
            : `${items.length} plans`;
        empty.hidden = shown > 0;
        list.hidden = shown === 0;
        if (queryEl) queryEl.textContent = raw;

        // While searching, show every match; otherwise respect the collapsed state (mobile)
        list.classList.toggle('is-collapsed', !q && !expanded);
        if (toggle) toggle.hidden = Boolean(q) || expanded;
    };

    const toggle = document.querySelector('[data-plan-toggle]');
    let expanded = false;
    if (toggle) {
        toggle.firstChild.textContent = `Show all ${items.length} plans `;
        toggle.addEventListener('click', () => { expanded = true; render(); });
    }

    input.addEventListener('input', render);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { input.value = ''; render(); }
    });
    render();
});
