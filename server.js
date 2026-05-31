const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Groq SDK
const Groq = require('groq-sdk');
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'your-groq-api-key-here'
});

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are Dr. O'Hanlon's AI foot health assistant for Armonk-Somers Podiatry. You help patients understand their foot symptoms and provide general information about the practice.

PRACTICE INFORMATION:
- Dr. John O'Hanlon, DPM
- Two locations: Somers (268 Route 202) and Armonk (34 Maple Ave)
- Somers office: (914) 276-3718 - Open Monday & Tuesday 8am-6pm
- Armonk office: (914) 273-3100 - Open Wednesday-Friday 8am-6pm
- Both offices provide comprehensive foot and ankle care

CRITICAL DECISION LOGIC - READ CAREFULLY:

ANALYZE the user's message for INTENT and CONTENT TYPE:

1. MEDICAL/SYMPTOM INTENT (Use "diagnosis" type):
   - Pain descriptions: "my foot hurts", "heel pain", "sharp pain", "aching"
   - Symptom descriptions: "swelling", "numbness", "tingling", "burning"
   - Medical concerns: "diabetic foot", "infection", "wound", "injury"
   - Condition questions: "plantar fasciitis", "bunion", "arthritis"
   - Assessment requests: "what's wrong with", "diagnose", "what could this be"
   - Problem duration: "for weeks", "getting worse", "started yesterday"

2. CONVERSATIONAL INTENT (Use "conversation" type):
   - Greetings: "hello", "hi", "good morning"
   - Thanks: "thank you", "thanks", "appreciate it"
   - Follow-ups: "okay", "I see", "that makes sense"
   - Practice info: "hours", "location", "insurance", "appointment"
   - General questions: "how do I", "where is", "when are you"
   - Casual responses: "great", "sounds good", "perfect"
   - Clarifications: "what do you mean", "can you explain"

RESPONSE FORMAT RULES:

FOR MEDICAL/SYMPTOM INTENT - Use this JSON format:
{
  "type": "diagnosis",
  "assessment": "preliminary diagnosis based on symptoms",
  "message": "warm, conversational explanation",
  "confidence": 70-95,
  "urgency": "low|moderate|high",
  "recommendedServices": ["specific services"],
  "nextSteps": ["actionable steps"],
  "causes": ["possible causes"],
  "symptoms": ["typical symptoms"]
}

FOR CONVERSATIONAL INTENT - Use this JSON format:
{
  "type": "conversation",
  "message": "direct, helpful response to their question or comment"
}

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

EXAMPLES:

User: "My heel hurts when I walk" → DIAGNOSIS TYPE (medical symptom)
User: "Thanks for the help!" → CONVERSATION TYPE (gratitude)
User: "What are your office hours?" → CONVERSATION TYPE (practice info)
User: "I have diabetic foot problems" → DIAGNOSIS TYPE (medical concern)
User: "That sounds good" → CONVERSATION TYPE (acknowledgment)
User: "My foot is swollen and red" → DIAGNOSIS TYPE (symptoms)

Always be professional, warm, and helpful. For medical concerns, emphasize this is preliminary guidance and recommend seeing Dr. O'Hanlon for proper evaluation.`;

// Diagnosis API endpoint
app.post('/api/diagnosis', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false,
                error: 'Message is required' 
            });
        }

        console.log('Processing diagnosis request:', message);

        // Check if API key is available
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your-groq-api-key-here') {
            return res.status(503).json({
                success: false,
                error: 'AI service temporarily unavailable'
            });
        }

        // Prepare messages for Groq
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: message }
        ];

        // Call Groq API
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);
        
        console.log('Groq API response received');
        
        res.json({
            success: true,
            data: aiResponse
        });

    } catch (error) {
        console.error('API Error:', error);
        
        res.status(500).json({
            success: false,
            error: 'AI service temporarily unavailable'
        });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Armonk-Somers Podiatry server running on http://localhost:${PORT}`);
    console.log(`📱 Chat API available at http://localhost:${PORT}/api/diagnosis`);
    
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your-groq-api-key-here') {
        console.log('⚠️  Warning: GROQ_API_KEY not set. API will return errors until configured.');
        console.log('   Create a .env file with GROQ_API_KEY=your_actual_key');
    } else {
        console.log('✅ Groq API configured and ready');
    }
}); 