/**
 * Practice Assistant — deterministic routing for Armonk-Somers Podiatry.
 * Handles logistics, hours, services, insurance, visits, billing, and new patients.
 * Does not diagnose or give medical advice.
 */

class PracticeAssistant {
    constructor() {
        this.modal = document.getElementById('practiceChatModal');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.quickSuggestions = document.getElementById('quickSuggestions');
        this.isTyping = false;
        this.initialized = false;

        if (!this.modal || !this.chatMessages || !this.chatInput || !this.sendBtn) {
            return;
        }

        this.setupEventListeners();
        this.autoResizeTextarea();
    }

    setupEventListeners() {
        document.getElementById('openPracticeChatBtn')?.addEventListener('click', () => this.openChat());
        document.getElementById('closeChatBtn')?.addEventListener('click', () => this.closeChat());
        document.getElementById('chatOverlay')?.addEventListener('click', () => this.closeChat());

        this.sendBtn.addEventListener('click', () => this.sendMessage());

        this.chatInput.addEventListener('input', () => {
            this.updateSendButton();
            this.autoResizeTextarea();
        });

        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.quickSuggestions?.addEventListener('click', (e) => {
            const pill = e.target.closest('.suggestion-pill');
            if (!pill) return;
            this.chatInput.value = pill.dataset.suggestion || '';
            this.updateSendButton();
            this.autoResizeTextarea();
            this.sendMessage();
        });

        this.chatMessages.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (!action) return;
            const prompt = action.dataset.action;
            if (prompt) {
                this.chatInput.value = prompt;
                this.updateSendButton();
                this.sendMessage();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeChat();
            }
        });
    }

    openChat() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (!this.initialized) {
            this.initialized = true;
            setTimeout(() => this.loadWelcomeMessage(), 200);
        }

        setTimeout(() => this.chatInput.focus(), 400);
    }

    closeChat() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
    }

    updateSendButton() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isTyping;
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.updateSendButton();
        this.autoResizeTextarea();

        this.showTyping();

        const delay = 400 + Math.min(message.length * 8, 600);
        setTimeout(() => {
            const response = this.routeMessage(message);
            this.hideTyping();
            this.addMessage(response.html, 'assistant', response.followUps);
        }, delay);
    }

    normalize(text) {
        return text
            .toLowerCase()
            .replace(/['']/g, "'")
            .replace(/[^a-z0-9'\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    containsAny(text, terms) {
        return terms.some((term) => {
            if (term instanceof RegExp) return term.test(text);
            return text.includes(term);
        });
    }

    scoreIntent(text, intent) {
        let score = 0;
        for (const pattern of intent.patterns) {
            if (pattern instanceof RegExp) {
                if (pattern.test(text)) score += pattern.source.length > 20 ? 12 : 8;
            } else if (text.includes(pattern)) {
                score += pattern.split(' ').length >= 2 ? 10 : 6;
            }
        }
        if (intent.requireAll) {
            const allMatch = intent.requireAll.every((p) => text.includes(p));
            if (!allMatch) return 0;
            score += 15;
        }
        return score;
    }

    isMedicalAdviceRequest(text) {
        const medicalPatterns = [
            /\b(diagnos|symptom|what('s| is) wrong|what could (this|it) be|do i have|should i take|prescri|medication|medicine|dosage|dose|treatment for|how to treat|cure for|is it (serious|broken|fractured|infected))\b/,
            /\b(my|i have|i'm|im) (foot|heel|ankle|toe|nail|arch|ball of foot).*(hurt|pain|ache|swollen|numb|tingl|burn|bleed|bruised|broken)\b/,
            /\b(foot|heel|ankle|toe).*(hurt|pain|ache|swollen|numb|tingl|burn|bleed|bruised|broken)\b/,
            /\b(plantar fasciitis|bunion|neuroma|fracture|sprain|infection|fungus|wart|corn|callus|ingrown)\b.*\b(have|think|worried|what|how|should|help me)\b/,
            /\b(hurt|pain|ache|swollen|numb|tingl|burn)\b.*\b(foot|heel|ankle|toe|nail)\b/,
            /\b(mri|x ?ray result|lab result|blood test|what does .+ mean)\b/,
            /\b(is it safe|can i run|can i walk|can i exercise|when will it heal|how long will it take to heal)\b/
        ];
        return medicalPatterns.some((p) => p.test(text));
    }

    isEmergency(text) {
        return this.containsAny(text, [
            'emergency', 'urgent', 'can\'t walk', 'cannot walk', 'severe bleeding',
            'open wound', '911', 'go to er', 'emergency room', 'right now'
        ]);
    }

    routeMessage(rawMessage) {
        const text = this.normalize(rawMessage);

        if (!text) {
            return this.buildResponse(
                '<p>Please type a question about our offices, services, insurance, appointments, or billing.</p>'
            );
        }

        if (this.isEmergency(text)) {
            return this.buildResponse(`
                <p><strong>If this is a medical emergency, call 911 or go to the nearest emergency room.</strong></p>
                <p>For urgent foot concerns during office hours, call the office closest to you:</p>
                <ul>
                    <li><strong>Somers:</strong> <a href="tel:9142763718">(914) 276-3718</a></li>
                    <li><strong>Armonk:</strong> <a href="tel:9142733100">(914) 273-3100</a></li>
                </ul>
                <p class="chat-note">Our assistant cannot evaluate urgent medical situations — the office or emergency services can help right away.</p>
            `, ['Office hours', 'Schedule appointment']);
        }

        if (this.isMedicalAdviceRequest(text)) {
            return this.buildResponse(`
                <p>I can help with <strong>office logistics</strong> — hours, locations, insurance, what to bring, and how to schedule — but I can't diagnose conditions or recommend treatments.</p>
                <p>Dr. O'Hanlon needs to examine you to give medical guidance. Please call to schedule an evaluation:</p>
                <ul>
                    <li><strong>Somers:</strong> <a href="tel:9142763718">(914) 276-3718</a></li>
                    <li><strong>Armonk:</strong> <a href="tel:9142733100">(914) 273-3100</a></li>
                </ul>
                <p class="chat-note">For non-urgent questions, you can also use our <a href="contact.html">contact form</a>.</p>
            `, ['What services do you offer?', 'New patient process', 'What to expect at a visit']);
        }

        const intents = this.getIntents();
        let best = null;
        let bestScore = 0;

        for (const intent of intents) {
            const score = this.scoreIntent(text, intent);
            if (score > bestScore) {
                bestScore = score;
                best = intent;
            }
        }

        if (best && bestScore >= 6) {
            return typeof best.response === 'function' ? best.response(text) : best.response;
        }

        return this.buildResponse(`
            <p>I'm not sure I can answer that from our practice information.</p>
            <p>For anything beyond hours, locations, services, insurance, visits, billing, or new-patient paperwork, please contact the office directly — our staff (or Dr. O'Hanlon) can help:</p>
            <ul>
                <li><strong>Somers:</strong> <a href="tel:9142763718">(914) 276-3718</a></li>
                <li><strong>Armonk:</strong> <a href="tel:9142733100">(914) 273-3100</a></li>
            </ul>
            <p class="chat-note">Try asking about office hours, accepted insurance, services, what to bring, or paying a bill.</p>
        `, ['What can you help with?', 'Office hours', 'Insurance accepted']);
    }

    buildResponse(html, followUps = []) {
        return { html, followUps };
    }

    link(href, label, external = false) {
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${href}" class="chat-link"${attrs}>${label}</a>`;
    }

    getIntents() {
        const offices = `
            <p><strong>Somers Office</strong><br>
            268 Route 202, Somers, NY<br>
            <a href="tel:9142763718">(914) 276-3718</a></p>
            <p><strong>Armonk Office</strong><br>
            34 Maple Ave, Armonk, NY<br>
            <a href="tel:9142733100">(914) 273-3100</a></p>
        `;

        return [
            {
                patterns: ['hello', 'hi there', 'hey', 'good morning', 'good afternoon', 'good evening'],
                response: this.buildResponse(`
                    <p>Hello! I'm the Armonk-Somers Podiatry practice assistant.</p>
                    <p>I can help with office hours, locations, services we offer, insurance and billing questions, what to expect at a visit, and getting started as a new patient.</p>
                    <p class="chat-note">I don't provide medical advice or diagnoses — for clinical questions, the office will connect you with Dr. O'Hanlon.</p>
                `, ['Office hours', 'What services do you offer?', 'New patient process'])
            },
            {
                patterns: ['thank', 'thanks', 'appreciate', 'helpful', 'got it', 'perfect', 'great'],
                response: this.buildResponse(`
                    <p>You're welcome! If you need anything else about the practice, just ask.</p>
                    <p>Ready to schedule? Call Somers at <a href="tel:9142763718">(914) 276-3718</a> or Armonk at <a href="tel:9142733100">(914) 273-3100</a>.</p>
                `, ['Schedule appointment', 'Office locations', 'Pay a bill'])
            },
            {
                patterns: ['what can you', 'what do you do', 'help me with', 'what questions', 'menu', 'options', 'capabilities'],
                response: this.buildResponse(`
                    <p>Here's what I can help with:</p>
                    <ul>
                        <li><strong>Hours & locations</strong> — Somers and Armonk schedules and directions</li>
                        <li><strong>Services</strong> — treatments and care we provide</li>
                        <li><strong>Insurance</strong> — accepted plans, referrals, co-pays, and self-pay</li>
                        <li><strong>Visits</strong> — what to expect and how to prepare</li>
                        <li><strong>New patients</strong> — forms, first visit, and what to bring</li>
                        <li><strong>Billing</strong> — paying a bill online or in the office</li>
                        <li><strong>Appointments</strong> — scheduling, rescheduling, and cancellations</li>
                    </ul>
                    <p class="chat-note">For symptoms, diagnoses, or treatment advice, I'll direct you to schedule with Dr. O'Hanlon.</p>
                `, ['Office hours', 'Insurance accepted', 'New patient process'])
            },
            {
                patterns: ['hour', 'open', 'close', 'schedule', 'when are you', 'office hours', 'what time'],
                requireAll: ['armonk'],
                response: this.buildResponse(`
                    <p><strong>Armonk office hours:</strong></p>
                    <ul>
                        <li>Tuesday — 8:00 AM to 12:00 PM</li>
                        <li>Thursday — 8:00 AM to 6:00 PM</li>
                    </ul>
                    <p>34 Maple Ave, Armonk, NY · <a href="tel:9142733100">(914) 273-3100</a></p>
                    <p class="chat-note">Hours may change on holidays — call the office to confirm.</p>
                `, ['Somers office hours', 'Office locations', 'Schedule appointment'])
            },
            {
                patterns: ['hour', 'open', 'close', 'schedule', 'when are you', 'office hours', 'what time'],
                requireAll: ['somers'],
                response: this.buildResponse(`
                    <p><strong>Somers office hours:</strong></p>
                    <ul>
                        <li>Monday — 8:00 AM to 6:00 PM</li>
                        <li>Tuesday — 1:00 PM to 6:00 PM</li>
                        <li>Wednesday — 8:00 AM to 6:00 PM</li>
                        <li>Friday — 8:00 AM to 6:00 PM</li>
                        <li>Saturday — 8:00 AM to 12:00 PM</li>
                    </ul>
                    <p>268 Route 202, Somers, NY · <a href="tel:9142763718">(914) 276-3718</a></p>
                    <p class="chat-note">Hours may change on holidays — call the office to confirm.</p>
                `, ['Armonk office hours', 'Office locations', 'Schedule appointment'])
            },
            {
                patterns: ['hour', 'open', 'close', 'schedule', 'when are you', 'office hours', 'what time', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'weekend'],
                response: this.buildResponse(`
                    <p><strong>Somers</strong> — 268 Route 202 · <a href="tel:9142763718">(914) 276-3718</a></p>
                    <ul>
                        <li>Mon, Wed, Fri — 8:00 AM – 6:00 PM</li>
                        <li>Tue — 1:00 PM – 6:00 PM</li>
                        <li>Sat — 8:00 AM – 12:00 PM</li>
                    </ul>
                    <p><strong>Armonk</strong> — 34 Maple Ave · <a href="tel:9142733100">(914) 273-3100</a></p>
                    <ul>
                        <li>Tue — 8:00 AM – 12:00 PM</li>
                        <li>Thu — 8:00 AM – 6:00 PM</li>
                    </ul>
                    <p class="chat-note">Which location works best for you? Call that office directly to book.</p>
                `, ['Somers office hours', 'Armonk office hours', 'Schedule appointment'])
            },
            {
                patterns: ['location', 'address', 'direction', 'where are you', 'find you', 'map', 'parking', 'office'],
                response: this.buildResponse(`
                    <p>We have two offices in Westchester County:</p>
                    ${offices}
                    <p class="chat-note">Call the location you'd like to visit — they'll confirm availability and directions.</p>
                `, ['Office hours', 'Schedule appointment', 'Which office should I call?'])
            },
            {
                patterns: ['which office', 'somers or armonk', 'pick a location', 'closest office', 'both offices'],
                response: this.buildResponse(`
                    <p>Either office can help you get scheduled — choose whichever is more convenient:</p>
                    <ul>
                        <li><strong>Somers</strong> — more weekday and Saturday hours · <a href="tel:9142763718">(914) 276-3718</a></li>
                        <li><strong>Armonk</strong> — Tuesday morning and Thursday · <a href="tel:9142733100">(914) 273-3100</a></li>
                    </ul>
                    <p>When you call, mention whether you're a new or returning patient and your insurance plan.</p>
                `, ['Office hours', 'New patient process', 'Insurance accepted'])
            },
            {
                patterns: ['service', 'treat', 'offer', 'provide', 'specialt', 'what do you do', 'conditions', 'care for'],
                response: this.buildResponse(`
                    <p>Dr. O'Hanlon provides comprehensive foot and ankle care for all ages. Services include:</p>
                    <ul>
                        <li>Custom orthotics</li>
                        <li>Diabetic foot care</li>
                        <li>In-house X-ray</li>
                        <li>Pediatric & geriatric foot care</li>
                        <li>Plantar fasciitis & heel pain</li>
                        <li>Arthritic conditions</li>
                        <li>Fungal infections</li>
                        <li>Wound care</li>
                        <li>Tendinitis</li>
                        <li>Foot nerve care</li>
                        <li>Bunion surgery</li>
                        <li>Hammertoe straightening</li>
                    </ul>
                    <p>See full descriptions on our ${this.link('services.html', 'Services page')}.</p>
                    <p class="chat-note">To discuss which service fits your needs, schedule an exam with Dr. O'Hanlon.</p>
                `, ['Schedule appointment', 'In-house X-ray', 'Diabetic foot care'])
            },
            {
                patterns: ['orthotic', 'custom insert', 'arch support', 'shoe insert'],
                response: this.buildResponse(`
                    <p><strong>Custom orthotics</strong> are personalized devices designed for your foot structure to correct biomechanical issues, improve support, and relieve pain.</p>
                    <p>They begin with a thorough foot and gait assessment in the office. ${this.link('services.html', 'Learn more on our Services page')}.</p>
                    <p class="chat-note">Whether orthotics are right for you is a clinical decision — call to schedule an evaluation.</p>
                `, ['Schedule appointment', 'What services do you offer?', 'Insurance accepted'])
            },
            {
                patterns: ['diabetic', 'diabetes foot', 'neuropathy', 'diabetic shoe'],
                response: this.buildResponse(`
                    <p>We offer <strong>diabetic foot care</strong> including comprehensive exams, neuropathy screening, wound care, nail care, and education on daily foot protection.</p>
                    <p>Regular checkups every 2–3 months are often recommended for diabetic patients.</p>
                    <p class="chat-note">Call to schedule — mention diabetes when booking so we allow adequate time.</p>
                `, ['Schedule appointment', 'What to expect at a visit', 'Insurance accepted'])
            },
            {
                patterns: ['x ray', 'xray', 'imaging', 'radiograph'],
                response: this.buildResponse(`
                    <p>We offer <strong>in-house X-ray</strong> at the office, so many patients can be evaluated and imaged in one visit without a separate imaging referral.</p>
                    <p>Coverage depends on your insurance plan — co-pays or coinsurance may apply.</p>
                `, ['Insurance accepted', 'Schedule appointment', 'What to bring to my visit'])
            },
            {
                patterns: ['pediatric', 'child', 'children', 'kid', 'geriatric', 'senior', 'elderly'],
                response: this.buildResponse(`
                    <p>We provide <strong>pediatric and geriatric foot care</strong> tailored to each age group — from developmental concerns in children to balance, arthritis, and circulation issues in seniors.</p>
                    <p>Family members of all ages are welcome at both locations.</p>
                `, ['Schedule appointment', 'What services do you offer?', 'Office hours'])
            },
            {
                patterns: ['surgery', 'surgical', 'bunion', 'hammertoe', 'operation', 'procedure'],
                response: this.buildResponse(`
                    <p>We provide both conservative care and surgical options when needed, including <strong>bunion surgery</strong> and <strong>hammertoe correction</strong>.</p>
                    <p>Surgical candidacy, technique, and recovery are determined only after an in-office evaluation with Dr. O'Hanlon.</p>
                    <p class="chat-note">I can't advise whether surgery is appropriate — please schedule a consultation.</p>
                `, ['Schedule appointment', 'What to expect at a visit', 'Insurance accepted'])
            },
            {
                patterns: ['insurance', 'cover', 'accept', 'plan', 'network', 'in network', 'out of network', 'participate'],
                response: this.buildResponse(`
                    <p>We work with most major insurance plans, including Aetna, Blue Cross Blue Shield, Cigna, United Healthcare, Oxford, Empire, Medicare, Medicaid, and many HMO/PPO plans.</p>
                    <p>Our full list is on the ${this.link('insurance.html', 'Insurance page')}. If you don't see your plan, call the office to verify — we'll confirm before your visit when possible.</p>
                    <p><strong>NPI:</strong> 1609846534</p>
                `, ['Medicare coverage', 'HMO referral requirements', 'Self-pay options'])
            },
            {
                patterns: ['medicare', 'medicaid', 'part b', 'advantage', 'supplement'],
                response: this.buildResponse(`
                    <p>We participate in <strong>Medicare Part B</strong> for physician visits and in-office X-ray services.</p>
                    <p>Patient responsibility typically includes the annual Medicare deductible (when applicable) and 20% coinsurance. Medicare Advantage and supplemental plans vary — bring all insurance cards to your visit.</p>
                    <p>Details are on our ${this.link('insurance.html', 'Insurance page')}.</p>
                `, ['Insurance accepted', 'What to bring to my visit', 'Schedule appointment'])
            },
            {
                patterns: ['hmo', 'ppo', 'referral', 'primary care referral', 'authorization'],
                response: this.buildResponse(`
                    <p><strong>HMO patients</strong> must bring a valid referral at the time of visit, along with insurance card(s).</p>
                    <p>If a referral isn't available at your appointment, payment may be required at the time of service. Reimbursement may be available once a valid referral is provided (minus co-pay, coinsurance, and/or deductible).</p>
                    <p><strong>Co-payments</strong> are collected at each visit.</p>
                    <p>See our ${this.link('insurance.html', 'Insurance page')} for full policy details.</p>
                `, ['Insurance accepted', 'What to bring to my visit', 'Schedule appointment'])
            },
            {
                patterns: ['workers comp', 'worker comp', 'work injury', 'no fault', 'no-fault', 'work related'],
                response: this.buildResponse(`
                    <p>We accept <strong>New York State Workers' Compensation</strong> and <strong>No-Fault</strong> cases.</p>
                    <p><strong>Important:</strong> Bring all Workers' Comp / No-Fault insurance and attorney information to your <em>initial</em> visit.</p>
                    <p>Call the office before your appointment so we can confirm required documentation.</p>
                `, ['Schedule appointment', 'New patient process', 'Office locations'])
            },
            {
                patterns: ['copay', 'co pay', 'co-pay', 'deductible', 'coinsurance', 'co insurance', 'out of pocket', 'cost', 'price', 'fee', 'self pay', 'self-pay', 'no insurance', 'uninsured', 'private pay'],
                response: this.buildResponse(`
                    <p><strong>Co-payments</strong> are due at each visit. You're also responsible for deductibles, coinsurance, and any services your plan doesn't cover.</p>
                    <p>If we're not in-network with your plan — or you don't have insurance — payment for the visit, X-rays, supplies, and services is generally required on the day of appointment. We can provide an itemized receipt for you to submit for reimbursement.</p>
                    <p>We accept cash, money order, personal checks, Visa, MasterCard, and Discover. Returned checks incur a $25 fee.</p>
                    <p>Full details: ${this.link('insurance.html', 'Insurance & payment policy')}.</p>
                `, ['Pay a bill', 'Insurance accepted', 'Schedule appointment'])
            },
            {
                patterns: ['pay', 'bill', 'balance', 'invoice', 'payment', 'online pay', 'pay online', 'statement'],
                response: this.buildResponse(`
                    <p>You can <strong>pay a bill online</strong> through our secure payment portal:</p>
                    <p>${this.link('https://somerspodiatry.ema.md/ema/pay/onlinepayments#/pm/payfac/pay', 'Pay your bill online', true)}</p>
                    <p>In-office payments (co-pays, balances, self-pay) are accepted at the time of service by cash, check, money order, Visa, MasterCard, or Discover.</p>
                    <p>Questions about a specific statement? Call Somers <a href="tel:9142763718">(914) 276-3718</a> or Armonk <a href="tel:9142733100">(914) 273-3100</a>.</p>
                `, ['Insurance accepted', 'Self-pay options', 'Office hours'])
            },
            {
                patterns: ['new patient', 'first visit', 'first time', 'getting started', 'register', 'paperwork', 'forms', 'patient form', 'intake'],
                response: this.buildResponse(`
                    <p><strong>New patient steps:</strong></p>
                    <ol>
                        <li>Call Somers <a href="tel:9142763718">(914) 276-3718</a> or Armonk <a href="tel:9142733100">(914) 273-3100</a> to schedule.</li>
                        <li>Complete our ${this.link('patient-form.html', 'new patient form')} and bring it to your first appointment.</li>
                        <li>Bring photo ID, insurance card(s), referral (if HMO), medication list, and any relevant prior records or imaging.</li>
                    </ol>
                    <p class="chat-note">Arrive a few minutes early if you haven't completed paperwork in advance.</p>
                `, ['What to bring to my visit', 'What to expect at a visit', 'Insurance accepted'])
            },
            {
                patterns: ['bring', 'what should i have', 'documents', 'id', 'card', 'prepare', 'preparation', 'before my appointment', 'before visit'],
                response: this.buildResponse(`
                    <p><strong>Please bring to your visit:</strong></p>
                    <ul>
                        <li>Photo ID</li>
                        <li>Insurance card(s) — front and back if possible</li>
                        <li>HMO referral, if required by your plan</li>
                        <li>Completed ${this.link('patient-form.html', 'new patient form')} (new patients)</li>
                        <li>List of current medications</li>
                        <li>Prior podiatry records, X-rays, or test results (if you have them)</li>
                        <li>Workers' Comp / No-Fault documentation (if applicable)</li>
                        <li>Co-payment, if required by your plan</li>
                    </ul>
                    <p>Wear or bring the shoes you use most often — they're helpful for evaluation.</p>
                `, ['New patient process', 'HMO referral requirements', 'Insurance accepted'])
            },
            {
                patterns: ['expect', 'first appointment', 'visit like', 'what happens', 'during appointment', 'at my visit', 'checkup'],
                response: this.buildResponse(`
                    <p><strong>What to expect at your visit:</strong></p>
                    <ul>
                        <li>Check-in and insurance verification</li>
                        <li>Review of your history, symptoms, and goals (discussed with Dr. O'Hanlon — not with this assistant)</li>
                        <li>Foot and ankle examination</li>
                        <li>In-office X-ray when clinically indicated</li>
                        <li>Discussion of findings and recommended next steps</li>
                        <li>Co-pay or required payment collected at checkout</li>
                    </ul>
                    <p>You'll receive our HIPAA Notice of Privacy Practices. Plan for roughly 30–45 minutes for a new patient visit.</p>
                `, ['How to prepare for a visit', 'New patient process', 'Schedule appointment'])
            },
            {
                patterns: ['appointment', 'schedule', 'book', 'reschedule', 'cancel', 'cancellation', 'make an appointment'],
                response: this.buildResponse(`
                    <p>To <strong>schedule, reschedule, or cancel</strong>, call the office directly:</p>
                    <ul>
                        <li><strong>Somers:</strong> <a href="tel:9142763718">(914) 276-3718</a></li>
                        <li><strong>Armonk:</strong> <a href="tel:9142733100">(914) 273-3100</a></li>
                    </ul>
                    <p>Please call as early as possible if you need to cancel — that time can be offered to another patient.</p>
                    <p>Non-urgent general messages can also go through our ${this.link('contact.html', 'contact form')}.</p>
                `, ['Office hours', 'New patient process', 'Which office should I call?'])
            },
            {
                patterns: ['contact', 'phone', 'call', 'email', 'reach', 'speak to', 'talk to', 'staff', 'front desk'],
                response: this.buildResponse(`
                    <p><strong>Contact the office:</strong></p>
                    ${offices}
                    <p>For non-urgent inquiries, you may use our ${this.link('contact.html', 'contact form')}. For appointments or time-sensitive matters, calling is best.</p>
                `, ['Office hours', 'Schedule appointment', 'Insurance questions'])
            },
            {
                patterns: ['doctor', 'dr o', 'ohanlon', 'who is the doctor', 'podiatrist', 'credentials', 'about dr'],
                response: this.buildResponse(`
                    <p><strong>Dr. John M. O'Hanlon, DPM</strong> is a board-certified podiatrist serving Westchester County since 1991 from our Somers and Armonk offices.</p>
                    <p>He provides comprehensive foot and ankle care for patients of all ages. Read his full bio on our ${this.link('about.html', 'About page')}.</p>
                    <p class="chat-note">Clinical questions should be discussed directly with Dr. O'Hanlon during an appointment.</p>
                `, ['Schedule appointment', 'What services do you offer?', 'Office locations'])
            },
            {
                patterns: ['hipaa', 'privacy', 'records', 'medical records', 'release of information'],
                response: this.buildResponse(`
                    <p>We follow HIPAA privacy practices. You'll receive a copy of our Notice of Privacy Practices explaining how health information is used for treatment, payment, and healthcare operations.</p>
                    <p>For medical records requests or authorization questions, contact the office directly — staff can guide you through the process.</p>
                `, ['Contact the office', 'New patient process', 'Insurance accepted'])
            },
            {
                patterns: ['parking', 'wheelchair', 'access', 'disability', 'ada'],
                response: this.buildResponse(`
                    <p>For specific questions about parking, building access, or accommodations at either location, please call the office — our staff can give you the most accurate directions and assistance:</p>
                    <ul>
                        <li><strong>Somers:</strong> <a href="tel:9142763718">(914) 276-3718</a></li>
                        <li><strong>Armonk:</strong> <a href="tel:9142733100">(914) 273-3100</a></li>
                    </ul>
                `, ['Office locations', 'Office hours', 'Schedule appointment'])
            }
        ];
    }

    addMessage(content, role, followUps = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = content;
        messageDiv.appendChild(bubble);

        if (followUps.length && role === 'assistant') {
            const actions = document.createElement('div');
            actions.className = 'chat-follow-ups';
            followUps.forEach((label) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'follow-up-pill';
                btn.dataset.action = label;
                btn.textContent = label;
                actions.appendChild(btn);
            });
            messageDiv.appendChild(actions);
        }

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        requestAnimationFrame(() => {
            messageDiv.classList.add('chat-message--visible');
        });
    }

    showTyping() {
        this.isTyping = true;
        this.updateSendButton();

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant typing-message';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span>One moment...</span>
                <div class="typing-dots">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        this.updateSendButton();
        this.chatMessages.querySelector('.typing-message')?.remove();
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        });
    }

    loadWelcomeMessage() {
        this.addMessage(`
            <p><strong>Practice Assistant</strong></p>
            <p>I help with office hours, locations, services, insurance, visit preparation, billing, and new-patient paperwork.</p>
            <p class="chat-note">I'm not a doctor and can't diagnose or give medical advice — for clinical questions, I'll connect you with the office or Dr. O'Hanlon.</p>
        `, 'assistant', [
            'Office hours',
            'What services do you offer?',
            'New patient process',
            'Pay a bill'
        ]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('practiceChatModal')) {
        window.practiceAssistant = new PracticeAssistant();
    }
});
