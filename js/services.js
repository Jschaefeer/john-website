/* Services — filters and detail drawer. Service copy lives in SERVICES below. */

const SERVICES = {
    "custom-orthotics": {
        "title": "Custom orthotics",
        "category": "Preventative · Treatment",
        "body": "<p>Our custom orthotics are specially designed to address your unique foot structure and specific needs. These devices can make a significant difference in your daily comfort and mobility.</p>\n<h4>Benefits of Custom Orthotics</h4>\n<ul>\n<li>Correction of biomechanical foot issues</li>\n<li>Relief from foot, ankle, knee, hip, and back pain</li>\n<li>Improved balance and stability</li>\n<li>Enhanced athletic performance</li>\n<li>Prevention of further foot problems</li>\n</ul>\n<p>Each pair of custom orthotics begins with a thorough assessment of your feet, gait, and specific concerns. We use advanced technology to capture the exact contours of your feet, ensuring a perfect fit that provides optimal support where you need it most.</p>"
    },
    "diabetic-foot-care": {
        "title": "Diabetic foot care",
        "category": "Specialized · Preventative",
        "body": "<p>Diabetes can lead to serious foot complications due to reduced circulation and nerve damage. Our specialized diabetic foot care is designed to prevent problems before they start and address issues promptly when they arise.</p>\n<h4>Our Diabetic Foot Care Services Include</h4>\n<ul>\n<li>Comprehensive diabetic foot examinations</li>\n<li>Neurological testing for early detection of neuropathy</li>\n<li>Vascular assessments to monitor circulation</li>\n<li>Education on proper foot care techniques</li>\n<li>Custom diabetic footwear recommendations</li>\n<li>Regular nail care to prevent complications</li>\n<li>Prompt treatment of any injuries or ulcers</li>\n</ul>\n<p>Regular checkups are essential for diabetic patients. We recommend appointments every 2-3 months to ensure any potential issues are caught early.</p>"
    },
    "in-house-x-ray": {
        "title": "In-house X-ray",
        "category": "Treatment · Preventative",
        "body": "<p>Our state-of-the-art in-house X-ray capabilities allow us to provide immediate diagnostic imaging during your appointment, eliminating the need for referrals to outside facilities.</p>\n<h4>Advantages of Our In-House X-Ray Services</h4>\n<ul>\n<li>Immediate diagnosis of fractures, dislocations, and other bone abnormalities</li>\n<li>Real-time evaluation of foot and ankle alignment</li>\n<li>Assessment of arthritic changes</li>\n<li>Detection of bone spurs and other bony growths</li>\n<li>Monitoring of healing progress after injuries or surgery</li>\n</ul>\n<p>Having X-ray capabilities on-site means we can provide faster, more efficient care, often diagnosing and beginning treatment in a single visit.</p>"
    },
    "pediatric-geriatric-foot-care": {
        "title": "Pediatric & geriatric foot care",
        "category": "Specialized · Preventative",
        "body": "<p>We provide specialized foot care for patients of all ages, recognizing that foot health needs change throughout life.</p>\n<h4>Pediatric Foot Care</h4>\n<ul>\n<li>Assessment of developmental foot concerns</li>\n<li>Treatment for flat feet, toe walking, and in-toeing</li>\n<li>Sports injury prevention and treatment for young athletes</li>\n<li>Early intervention for congenital foot conditions</li>\n</ul>\n<h4>Geriatric Foot Care</h4>\n<ul>\n<li>Management of age-related foot changes</li>\n<li>Treatment for thinning foot pads and skin</li>\n<li>Balance assessment and fall prevention</li>\n<li>Arthritic foot care</li>\n<li>Circulation and neuropathy monitoring</li>\n</ul>\n<p>Our approach is tailored to each age group, ensuring appropriate and effective care for every patient.</p>"
    },
    "arthritic-conditions": {
        "title": "Arthritic conditions",
        "category": "Treatment",
        "body": "<p>Arthritis in the feet and ankles can be particularly debilitating, affecting mobility and quality of life. We offer comprehensive care for all types of arthritis affecting the lower extremities.</p>\n<h4>We Treat Various Arthritic Conditions Including</h4>\n<ul>\n<li>Osteoarthritis - wear and tear of joint cartilage</li>\n<li>Rheumatoid arthritis - inflammatory joint disease</li>\n<li>Psoriatic arthritis - associated with psoriasis</li>\n<li>Gout - painful crystal deposits in joints</li>\n<li>Post-traumatic arthritis - following injury</li>\n</ul>\n<h4>Our Treatment Approaches</h4>\n<ul>\n<li>Custom orthotics to improve joint alignment</li>\n<li>Medication management for pain and inflammation</li>\n<li>Physical therapy recommendations</li>\n<li>Joint protection strategies</li>\n<li>Surgical intervention when necessary</li>\n</ul>"
    },
    "plantar-fasciitis": {
        "title": "Plantar fasciitis",
        "category": "Treatment",
        "body": "<p>Plantar fasciitis is one of the most common causes of heel pain, resulting from inflammation of the band of tissue connecting the heel bone to the toes. Our comprehensive approach focuses on both relief and prevention.</p>\n<h4>Our Treatment Protocol Includes</h4>\n<ul>\n<li>Detailed biomechanical assessment</li>\n<li>Custom stretching and exercise programs</li>\n<li>Custom orthotics to address underlying causes</li>\n<li>Night splints when appropriate</li>\n<li>Anti-inflammatory treatments</li>\n<li>Advanced therapies for chronic cases</li>\n<li>Education on proper footwear and activity modification</li>\n</ul>\n<p>Most patients experience significant improvement within 6-8 weeks of beginning treatment, though chronic cases may require more extensive care.</p>"
    },
    "fungal-infections": {
        "title": "Fungal infections",
        "category": "Treatment",
        "body": "<p>Fungal infections of the feet and nails are common but require proper treatment to resolve completely. We offer effective solutions for all types of fungal conditions.</p>\n<h4>We Treat</h4>\n<ul>\n<li>Athlete's foot (tinea pedis)</li>\n<li>Fungal nail infections (onychomycosis)</li>\n<li>Chronic and resistant fungal conditions</li>\n</ul>\n<h4>Treatment Options Include</h4>\n<ul>\n<li>Prescription-strength topical medications</li>\n<li>Oral antifungal therapy when appropriate</li>\n<li>Nail debridement to improve medication penetration</li>\n<li>Prevention strategies to avoid recurrence</li>\n<li>Treatment of shoes and environment when necessary</li>\n</ul>\n<p>We emphasize both treatment and prevention to help you maintain healthy, fungus-free feet.</p>"
    },
    "wound-care": {
        "title": "Wound care",
        "category": "Specialized · Treatment",
        "body": "<p>Proper wound care is critical, especially for patients with diabetes or circulation issues. Our specialized wound care protocols focus on healing existing wounds and preventing future complications.</p>\n<h4>Our Wound Care Services Include</h4>\n<ul>\n<li>Assessment and classification of wounds</li>\n<li>Debridement of non-viable tissue</li>\n<li>Application of advanced wound dressings</li>\n<li>Management of infection</li>\n<li>Offloading techniques to reduce pressure</li>\n<li>Nutritional recommendations to support healing</li>\n<li>Prevention of recurrence</li>\n</ul>\n<p>Our approach is comprehensive, addressing not just the wound itself but also the underlying factors that contribute to poor healing.</p>"
    },
    "bunion-surgery": {
        "title": "Bunion surgery",
        "category": "Surgical",
        "body": "<p>When conservative treatments for bunions aren't effective, surgical intervention may be necessary. We offer modern surgical techniques with faster recovery times and excellent outcomes.</p>\n<h4>Our Bunion Surgery Approach</h4>\n<ul>\n<li>Thorough pre-surgical evaluation</li>\n<li>Selection of the most appropriate surgical technique</li>\n<li>Minimally invasive options when suitable</li>\n<li>Comprehensive post-operative care</li>\n<li>Physical therapy coordination</li>\n<li>Custom orthotics to prevent recurrence</li>\n</ul>\n<p>Recovery time varies depending on the specific procedure, but most patients can return to regular footwear within 6-8 weeks and resume normal activities within 3-4 months.</p>"
    },
    "tendinitis": {
        "title": "Tendinitis",
        "category": "Treatment",
        "body": "<p>Tendinitis is inflammation of a tendon, often resulting from overuse or improper biomechanics. We treat various forms of tendinitis affecting the foot and ankle.</p>\n<h4>Common Types of Tendinitis We Treat</h4>\n<ul>\n<li>Achilles tendinitis</li>\n<li>Posterior tibial tendinitis</li>\n<li>Peroneal tendinitis</li>\n<li>Extensor tendinitis</li>\n</ul>\n<h4>Our Treatment Approach</h4>\n<ul>\n<li>Rest and activity modification</li>\n<li>Anti-inflammatory measures</li>\n<li>Physical therapy and stretching protocols</li>\n<li>Custom orthotics to correct biomechanical issues</li>\n<li>Strengthening exercises</li>\n<li>Advanced treatments for chronic cases</li>\n</ul>\n<p>Early intervention leads to the best outcomes, so we encourage patients to seek treatment at the first signs of tendon pain.</p>"
    },
    "foot-nerve-care": {
        "title": "Foot nerve care",
        "category": "Specialized · Treatment",
        "body": "<p>Nerve-related foot conditions can cause significant pain, tingling, numbness, or burning sensations. We provide comprehensive care for various nerve disorders affecting the feet.</p>\n<h4>Conditions We Treat</h4>\n<ul>\n<li>Morton's neuroma</li>\n<li>Peripheral neuropathy</li>\n<li>Tarsal tunnel syndrome</li>\n<li>Nerve entrapment syndromes</li>\n<li>Nerve damage from injuries or surgery</li>\n</ul>\n<h4>Treatment Options</h4>\n<ul>\n<li>Conservative approaches (padding, footwear modifications)</li>\n<li>Custom orthotics to reduce nerve compression</li>\n<li>Medication management</li>\n<li>Injection therapy</li>\n<li>Surgical decompression or removal when necessary</li>\n</ul>\n<p>Our goal is to reduce pain and restore normal sensation through the most appropriate and least invasive treatments possible.</p>"
    },
    "hammertoe-straightening": {
        "title": "Hammertoe straightening",
        "category": "Surgical · Treatment",
        "body": "<p>Hammertoes are toe deformities that cause the toe to bend or curl downward instead of pointing forward. We offer both conservative and surgical approaches to correct these deformities.</p>\n<h4>Conservative Treatment Options</h4>\n<ul>\n<li>Padding and taping</li>\n<li>Custom orthotics</li>\n<li>Footwear recommendations</li>\n<li>Exercises to maintain joint flexibility</li>\n<li>Splinting devices</li>\n</ul>\n<h4>Surgical Approaches</h4>\n<ul>\n<li>Joint resection (arthroplasty)</li>\n<li>Joint fusion (arthrodesis)</li>\n<li>Tendon transfer procedures</li>\n<li>Minimally invasive techniques when appropriate</li>\n</ul>\n<p>Treatment is tailored to the severity of the deformity and whether the hammertoe is flexible or rigid, with the goal of restoring normal toe alignment and alleviating discomfort.</p>"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.service-card'));
    const filters = Array.from(document.querySelectorAll('.filter-btn'));
    const drawer = document.getElementById('service-drawer');

    /* Filters */
    const countFor = (f) => cards.filter((c) => f === 'all' || c.dataset.category.split(' ').includes(f)).length;
    filters.forEach((btn) => {
        const count = btn.querySelector('.count');
        if (count) count.textContent = countFor(btn.dataset.filter);
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter;
            filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
            cards.forEach((card) => {
                const show = f === 'all' || card.dataset.category.split(' ').includes(f);
                card.hidden = !show;
            });
        });
    });

    /* Drawer */
    if (!drawer || typeof drawer.showModal !== 'function') return;
    const title = drawer.querySelector('[data-drawer-title]');
    const category = drawer.querySelector('[data-drawer-category]');
    const content = drawer.querySelector('[data-drawer-content]');
    const body = drawer.querySelector('.drawer-body');
    let opener = null;

    const open = (slug, trigger) => {
        const data = SERVICES[slug];
        if (!data) return;
        opener = trigger || null;
        title.textContent = data.title;
        category.textContent = data.category;
        content.innerHTML = data.body;
        body.scrollTop = 0;
        if (!drawer.open) drawer.showModal();
        document.body.style.overflow = 'hidden';
        history.replaceState(null, '', `#${slug}`);
    };

    const close = () => { if (drawer.open) drawer.close(); };

    drawer.addEventListener('close', () => {
        document.body.style.overflow = '';
        history.replaceState(null, '', location.pathname + location.search);
        if (opener) opener.focus({ preventScroll: true });
    });

    drawer.querySelector('[data-drawer-close]').addEventListener('click', close);
    drawer.addEventListener('click', (e) => { if (e.target === drawer) close(); });

    cards.forEach((card) => {
        const btn = card.querySelector('[data-service]');
        btn.addEventListener('click', () => open(btn.dataset.service, btn));
    });

    const fromHash = () => {
        const slug = decodeURIComponent(location.hash.slice(1));
        if (SERVICES[slug]) {
            const btn = document.querySelector(`[data-service="${slug}"]`);
            open(slug, btn);
        }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
});
