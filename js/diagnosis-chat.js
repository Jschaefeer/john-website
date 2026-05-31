// Modern Diagnosis Chat - Armonk-Somers Podiatry
// Mobile-first AI-powered foot diagnosis with advanced pattern matching

class ModernDiagnosisChat {
    constructor() {
        this.modal = null;
        this.chatMessages = null;
        this.chatInput = null;
        this.sendBtn = null;
        this.quickSuggestions = null;
        this.isTyping = false;
        this.conversationHistory = [];
        this.currentAssessment = null;
        
        this.init();
    }

    init() {
        // Get DOM elements
        this.modal = document.getElementById('diagnosisChatModal');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.quickSuggestions = document.getElementById('quickSuggestions');
        
        if (!this.modal || !this.chatMessages || !this.chatInput || !this.sendBtn) {
            console.error('Required chat elements not found');
            return;
        }

        this.setupEventListeners();
        this.autoResizeTextarea();
    }

    setupEventListeners() {
        // Start diagnosis button
        const startBtn = document.getElementById('startDiagnosisBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.openChat());
        }

        // Close chat
        const closeBtn = document.getElementById('closeChatBtn');
        const overlay = document.getElementById('chatOverlay');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeChat());
        }
        if (overlay) {
            overlay.addEventListener('click', () => this.closeChat());
        }

        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Input handling
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

        // Quick suggestions
            this.quickSuggestions.addEventListener('click', (e) => {
            const pill = e.target.closest('.suggestion-pill');
            if (pill) {
                const suggestion = pill.dataset.suggestion;
                    this.chatInput.value = suggestion;
                this.updateSendButton();
                this.autoResizeTextarea();
                    this.sendMessage();
                }
            });

        // Escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeChat();
            }
        });
    }

    openChat() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load welcome message if first time
        if (this.conversationHistory.length === 0) {
            setTimeout(() => {
                this.loadWelcomeMessage();
            }, 300);
        }
        
        // Focus input
        setTimeout(() => {
            this.chatInput.focus();
        }, 500);
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

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.updateSendButton();
        this.autoResizeTextarea();
        
        // Hide quick suggestions after first message
        if (this.conversationHistory.length === 0) {
            this.quickSuggestions.style.display = 'none';
        }

        // Add to history
        this.conversationHistory.push({ role: 'user', content: message });

        // Show typing
        this.showTyping();

        try {
            const response = await this.getAIResponse(message);
            this.hideTyping();
            await this.processResponse(response);
        } catch (error) {
            console.error('Error:', error);
            this.hideTyping();
            this.addErrorMessage();
        }
    }

    addMessage(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = content;
        
        messageDiv.appendChild(bubble);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Add animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
    }

    showTyping() {
        this.isTyping = true;
        this.updateSendButton();
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant typing-message';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span>Analyzing symptoms...</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        this.updateSendButton();
        
        const typingMsg = this.chatMessages.querySelector('.typing-message');
        if (typingMsg) {
            typingMsg.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    async getAIResponse(message) {
        try {
            // Use serverless function endpoint for cPanel hosting
            const response = await fetch('https://john-vercel-silk.vercel.app/api/diagnosis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    history: this.conversationHistory.slice(-10) // Keep last 10 messages for context
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                // Check if this is a conversational response
                if (result.data.type === 'conversation') {
                    return {
                        type: 'conversation',
                        message: result.data.message
                    };
                }
                
                // This is a diagnostic response
                return {
                    type: 'diagnosis',
                    assessment: result.data.assessment,
                    description: result.data.message,
                    confidence: result.data.confidence,
                    urgency: result.data.urgency,
                    services: result.data.recommendedServices,
                    nextSteps: result.data.nextSteps,
                    causes: result.data.causes || null,
                    symptoms: result.data.symptoms || null
                };
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('API Error:', error);
            throw error; // Let the calling function handle the error
        }
    }

    async processResponse(response) {
        // Check if this is a simple conversational response
        if (response.type === 'conversation') {
            // Just add the message directly - no cards or special formatting
            this.addMessage(response.message, 'assistant');
            return;
        }

        // This is a diagnostic response - use the full assessment format
        
        // Main assessment
        const assessmentHTML = `
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 1rem; padding: 1rem; border-left: 4px solid var(--primary); margin: 0.5rem 0;">
                <div style="color: var(--primary); font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-stethoscope"></i>
                    Preliminary Assessment
                </div>
                <div style="font-size: 0.9rem; font-weight: 600; color: var(--primary); margin-bottom: 0.5rem;">
                    ${response.assessment}
                </div>
                <div style="font-size: 0.8rem; line-height: 1.4; margin-bottom: 0.75rem;">
                    ${response.description}
                </div>
                <div style="font-size: 0.7rem; color: var(--gray-dark); opacity: 0.8;">
                    <i class="fas fa-chart-line"></i> Assessment Confidence: ${response.confidence}%
                </div>
            </div>
        `;
        
        this.addMessage(assessmentHTML, 'assistant');
        
        // Add delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        // Detailed explanation if available
        if (response.causes || response.symptoms) {
            const detailsHTML = `
                <div style="background: linear-gradient(135deg, #f8fafe 0%, #f0f9ff 100%); border-radius: 1rem; padding: 1.5rem; border: 1px solid rgba(var(--primary-rgb), 0.15); margin: 0.5rem 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    ${response.causes ? `
                        <div style="margin-bottom: ${response.symptoms ? '1.25rem' : '0'};">
                            <div style="font-weight: 600; color: var(--primary); font-size: 0.85rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                <div style="width: 24px; height: 24px; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-question-circle" style="color: white; font-size: 0.7rem;"></i>
                                </div>
                                Common Causes
                            </div>
                            <div style="background: white; border-radius: 0.75rem; padding: 1rem; border: 1px solid rgba(var(--primary-rgb), 0.1);">
                                <ul style="font-size: 0.8rem; line-height: 1.5; margin: 0; padding-left: 0; list-style: none;">
                                    ${response.causes.map(cause => `
                                        <li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative;">
                                            <span style="position: absolute; left: 0; top: 0.1rem; color: var(--secondary); font-weight: 600;">•</span>
                                            ${cause}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${response.symptoms ? `
                        <div>
                            <div style="font-weight: 600; color: var(--primary); font-size: 0.85rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-exclamation-triangle" style="color: white; font-size: 0.7rem;"></i>
                                </div>
                                Typical Symptoms
                            </div>
                            <div style="background: white; border-radius: 0.75rem; padding: 1rem; border: 1px solid rgba(var(--primary-rgb), 0.1);">
                                <ul style="font-size: 0.8rem; line-height: 1.5; margin: 0; padding-left: 0; list-style: none;">
                                    ${response.symptoms.map(symptom => `
                                        <li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative;">
                                            <span style="position: absolute; left: 0; top: 0.1rem; color: #ef4444; font-weight: 600;">•</span>
                                            ${symptom}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            this.addMessage(detailsHTML, 'assistant');
            await new Promise(resolve => setTimeout(resolve, 600));
        }

        // Service recommendations
        if (response.services && response.services.length > 0) {
            this.showServiceRecommendations(response.services, response.confidence);
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // Next steps
        this.showNextSteps(response.nextSteps, response.urgency);
    }

    showServiceRecommendations(services, confidence) {
        const serviceDetails = {
            'Custom Orthotics': 'Personalized devices to correct foot mechanics and provide support',
            'Diabetic Foot Care': 'Specialized monitoring and care for diabetic complications',
            'In-House X-Ray': 'Immediate diagnostic imaging for accurate assessment',
            'Plantar Fasciitis': 'Comprehensive heel pain treatment protocols',
            'Fungal Infections': 'Effective antifungal treatments for nails and skin',
            'Bunion Surgery': 'Modern surgical correction techniques',
            'Arthritic Conditions': 'Pain management and mobility preservation',
            'Foot Nerve Care': 'Specialized treatment for nerve-related conditions',
            'Wound Care': 'Advanced healing protocols for chronic wounds'
        };

        let html = `
            <div class="service-recommendations">
                <h4><i class="fas fa-hand-holding-medical"></i> Recommended Services:</h4>
        `;
        
        services.forEach(service => {
            const description = serviceDetails[service] || 'Specialized care for your condition';
            const matchLevel = confidence > 85 ? 'Excellent Match' : confidence > 70 ? 'Good Match' : 'Recommended';
            
            html += `
                <div class="service-recommendation" onclick="modernDiagnosisChat.highlightService('${service}')">
                    <div class="service-title"><i class="fas fa-arrow-right"></i> ${service}</div>
                    <div class="service-description">${description}</div>
                    <div class="service-match"><i class="fas fa-check-circle"></i> ${matchLevel}</div>
                    </div>
                `;
        });
        
        html += '</div>';
        this.addMessage(html, 'assistant');
    }

    showNextSteps(steps, urgency) {
        const urgencyConfig = {
            'high': { color: '#dc2626', label: 'High Priority', icon: 'fas fa-exclamation-triangle' },
            'moderate': { color: '#f59e0b', label: 'Moderate Priority', icon: 'fas fa-clock' },
            'low-moderate': { color: '#10b981', label: 'Schedule Soon', icon: 'fas fa-info-circle' }
        };
        
        const config = urgencyConfig[urgency] || urgencyConfig['moderate'];

        let html = `
            <div class="next-steps">
                <h4 style="color: ${config.color};">
                    <i class="${config.icon}"></i> Next Steps - ${config.label}
                </h4>
                <ol>
        `;
        
        steps.forEach(step => {
            html += `<li>${step}</li>`;
        });
        
        html += `
                </ol>
                <a href="contact.html" class="book-appointment-btn">
                    <i class="fas fa-calendar-check"></i> 
                    Schedule with Dr. O'Hanlon
                </a>
            </div>
        `;
        
        this.addMessage(html, 'assistant');
    }

    highlightService(serviceName) {
        this.closeChat();
        
        setTimeout(() => {
            const servicesSection = document.querySelector('.services-list');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
                
                // Find and highlight the service card
        const serviceCards = document.querySelectorAll('.service-card h3');
        for (const cardTitle of serviceCards) {
            if (cardTitle.textContent.trim() === serviceName) {
                    const card = cardTitle.closest('.service-card');
                    if (card) {
                        setTimeout(() => {
                            card.style.transform = 'scale(1.05)';
                                card.style.boxShadow = '0 20px 40px rgba(92, 122, 52, 0.3)';
                                card.style.border = '2px solid var(--secondary)';
                                
                            setTimeout(() => {
                                    card.click();
                                setTimeout(() => {
                                    card.style.transform = '';
                                    card.style.boxShadow = '';
                                        card.style.border = '';
                            }, 500);
                        }, 800);
                            }, 1000);
                }
                break;
            }
        }
            }
        }, 300);
    }

    addErrorMessage() {
        const errorHTML = `
            <div style="background: #fee2e2; border: 1px solid #fecaca; border-radius: 1rem; padding: 1rem; color: #dc2626; margin: 0.5rem 0;">
                <div style="font-weight: 600; margin-bottom: 0.5rem;">
                    <i class="fas fa-exclamation-triangle"></i> Connection Issue
                </div>
                <div style="font-size: 0.8rem; margin-bottom: 0.75rem;">
                    Unable to process your request right now. Please contact our office directly for immediate assistance:
                </div>
                <div style="font-size: 0.8rem; font-weight: 600;">
                    📞 Somers: (914) 276-3718<br>
                    📞 Armonk: (914) 273-3100
                </div>
            </div>
        `;
        
        this.addMessage(errorHTML, 'assistant');
    }

    loadWelcomeMessage() {
        const welcomeHTML = `
            <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white; border-radius: 1rem; padding: 1rem; margin: 0.5rem 0;">
                <div style="font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-hand-holding-medical"></i>
                    Welcome! I'm Dr. O'Hanlon's AI Assistant
                </div>
                <div style="font-size: 0.8rem; line-height: 1.4; margin-bottom: 0.75rem;">
                    I'll help analyze your foot symptoms and recommend the best services from our practice. Please describe your symptoms in detail.
                </div>
                <div style="background: rgba(255, 255, 255, 0.15); border-radius: 0.5rem; padding: 0.75rem; font-size: 0.75rem; line-height: 1.3;">
                    <strong>💡 Tip:</strong> Be specific about pain location, timing (morning/evening), duration, and what makes it better or worse.
                </div>
            </div>
        `;
        
        this.addMessage(welcomeHTML, 'assistant');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('diagnosisChatModal')) {
        window.modernDiagnosisChat = new ModernDiagnosisChat();
    }
}); 