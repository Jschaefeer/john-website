// Groq API Integration for Diagnosis Chat
// This file should be used in a backend environment (Node.js/Express/Serverless)
// Never expose API keys in frontend JavaScript!

// For Node.js/Express backend implementation
class GroqDiagnosisAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.groq.com/openai/v1';
        this.model = 'llama-3.3-70b-versatile';
        
        // Medical disclaimer
        this.systemPrompt = `You are Dr. O'Hanlon's AI foot health assistant for Armonk-Somers Podiatry. You help patients understand their foot symptoms and recommend appropriate services.

IMPORTANT GUIDELINES:
- Always emphasize this is a preliminary assessment, not a medical diagnosis
- Recommend seeing Dr. O'Hanlon for proper evaluation
- Be supportive and professional
- Focus on the available services at the practice
- Ask follow-up questions to better understand symptoms
- Consider urgency levels (high, moderate, low)

AVAILABLE SERVICES:
- Custom Orthotics: Personalized orthotic devices for biomechanical issues
- Diabetic Foot Care: Specialized care for diabetic patients
- In-House X-Ray: Immediate diagnostic imaging
- Plantar Fasciitis: Treatment for heel pain and related conditions
- Fungal Infections: Treatment for athlete's foot and nail fungus
- Bunion Surgery: Surgical correction of bunions
- Arthritic Conditions: Treatment for foot arthritis
- Tendinitis: Treatment for tendon inflammation
- Hammertoe Straightening: Correction of toe deformities
- Foot Nerve Care: Treatment for nerve-related conditions
- Wound Care: Specialized wound treatment
- Pediatric & Geriatric Foot Care: Age-specific care

Respond in a conversational, caring manner. Always include:
1. Preliminary assessment
2. Recommended services
3. Urgency level
4. Next steps
5. Encouragement to book an appointment

Format responses in JSON with these fields:
{
  "message": "conversational response",
  "assessment": "preliminary diagnosis",
  "confidence": 0-100,
  "urgency": "high|moderate|low",
  "recommendedServices": ["service1", "service2"],
  "nextSteps": ["step1", "step2", "step3"],
  "followUpQuestions": ["question1", "question2"]
}`;
    }

    async getDiagnosis(userMessage, conversationHistory = []) {
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...conversationHistory,
                { role: 'user', content: userMessage }
            ];

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = JSON.parse(data.choices[0].message.content);
            
            return {
                success: true,
                data: aiResponse
            };

        } catch (error) {
            console.error('Groq API Error:', error);
            return {
                success: false,
                error: error.message,
                fallback: this.getFallbackResponse(userMessage)
            };
        }
    }

    getFallbackResponse(userMessage) {
        // Fallback diagnosis system when API is unavailable
        const symptoms = userMessage.toLowerCase();
        
        const patterns = {
            heel: {
                assessment: "Possible heel pain condition",
                services: ["Plantar Fasciitis", "Custom Orthotics"],
                urgency: "moderate"
            },
            diabetic: {
                assessment: "Diabetic foot concern",
                services: ["Diabetic Foot Care", "Wound Care"],
                urgency: "high"
            },
            swelling: {
                assessment: "Foot swelling concern",
                services: ["In-House X-Ray", "Wound Care"],
                urgency: "moderate"
            },
            nail: {
                assessment: "Nail condition",
                services: ["Fungal Infections"],
                urgency: "low"
            }
        };

        let match = null;
        for (const [key, value] of Object.entries(patterns)) {
            if (symptoms.includes(key)) {
                match = value;
                break;
            }
        }

        if (!match) {
            match = {
                assessment: "General foot concern",
                services: ["Custom Orthotics", "In-House X-Ray"],
                urgency: "moderate"
            };
        }

        return {
            message: `I understand you're experiencing foot symptoms. Based on your description, this appears to be a ${match.assessment}. I recommend scheduling an appointment with Dr. O'Hanlon for a proper evaluation.`,
            assessment: match.assessment,
            confidence: 60,
            urgency: match.urgency,
            recommendedServices: match.services,
            nextSteps: [
                "Schedule an appointment with Dr. O'Hanlon",
                "Document your symptoms and when they occur",
                "Note any activities that worsen symptoms",
                "Bring any previous medical records"
            ],
            followUpQuestions: [
                "How long have you been experiencing these symptoms?",
                "What activities make the symptoms worse or better?",
                "Are you currently taking any medications?"
            ]
        };
    }
}

// Express.js route example
function setupGroqRoutes(app, groqApiKey) {
    const groqAPI = new GroqDiagnosisAPI(groqApiKey);

    app.post('/api/diagnosis', async (req, res) => {
        try {
            const { message, history } = req.body;
            
            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }

            const result = await groqAPI.getDiagnosis(message, history);
            
            if (result.success) {
                res.json({ success: true, data: result.data });
            } else {
                res.json({ 
                    success: false, 
                    error: result.error,
                    fallback: result.fallback 
                });
            }

        } catch (error) {
            console.error('Diagnosis API Error:', error);
            res.status(500).json({ 
                error: 'Internal server error',
                fallback: groqAPI.getFallbackResponse(req.body.message || '')
            });
        }
    });
}

// Serverless function example (Vercel/Netlify)
async function handleDiagnosisRequest(event, context) {
    const groqAPI = new GroqDiagnosisAPI(process.env.GROQ_API_KEY);
    
    try {
        const { message, history } = JSON.parse(event.body);
        const result = await groqAPI.getDiagnosis(message, history);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify(result)
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: error.message,
                fallback: groqAPI.getFallbackResponse('')
            })
        };
    }
}

// Frontend integration update for diagnosis-chat.js
function updateDiagnosisChatForProduction() {
    // Replace the getAIResponse method in DiagnosisChat class
    return `
    async getAIResponse(userMessage) {
        try {
            const response = await fetch('/api/diagnosis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: this.conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    diagnosis: result.data.assessment,
                    explanation: result.data.message,
                    confidence: result.data.confidence,
                    urgency: result.data.urgency,
                    recommendations: result.data.recommendedServices,
                    nextSteps: result.data.nextSteps
                };
            } else {
                // Use fallback response
                const fallback = result.fallback;
                return {
                    diagnosis: fallback.assessment,
                    explanation: fallback.message,
                    confidence: fallback.confidence,
                    urgency: fallback.urgency,
                    recommendations: fallback.recommendedServices,
                    nextSteps: fallback.nextSteps
                };
            }

        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    `;
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        GroqDiagnosisAPI,
        setupGroqRoutes,
        handleDiagnosisRequest
    };
} else if (typeof window !== 'undefined') {
    // Browser environment - should not be used for API keys!
    window.GroqDiagnosisAPI = {
        updateDiagnosisChatForProduction
    };
} 