import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey });
};

// SIMULATION: Since we cannot actually scrape Google Maps/Websites purely client-side due to CORS and technical limits,
// we use Gemini to "Hallucinate/Generate" realistic mock data based on the user's query.
export const simulateLeadScraping = async (keyword: string, location: string): Promise<Lead[]> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are a lead generation simulator. Generate a list of 5 realistic business leads for the search query: "${keyword}" in "${location}".
      For each business, invent a realistic business name, a plausible website URL, a generic contact email (or plausible CEO email), a contact person name, and a "websiteScore" (random integer 30-90) representing how good their current website is.
      The status should be "New".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              businessName: { type: Type.STRING },
              industry: { type: Type.STRING },
              location: { type: Type.STRING },
              website: { type: Type.STRING },
              email: { type: Type.STRING },
              contactPerson: { type: Type.STRING },
              websiteScore: { type: Type.INTEGER },
            },
            required: ["businessName", "industry", "location", "website", "email", "contactPerson", "websiteScore"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Enrich with client-side ID and defaults
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: `lead-${Date.now()}-${index}`,
      status: 'New',
      createdAt: new Date().toISOString(),
      aiAnalysis: '',
    }));

  } catch (error) {
    console.error("Error simulating scraping:", error);
    // Fallback data in case of API failure
    return [
      {
        id: 'fallback-1',
        businessName: 'Elite Fitness Center',
        industry: 'Gym',
        location: location,
        website: 'www.elitefitness-demo.com',
        email: 'info@elitefitness-demo.com',
        contactPerson: 'John Doe',
        status: 'New',
        createdAt: new Date().toISOString(),
        websiteScore: 45
      }
    ];
  }
};

export const analyzeLeadAndGeneratePitch = async (lead: Lead, myService: string): Promise<{ analysis: string, emailDraft: string }> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Act as an expert sales copywriter and technical analyst.
      
      Target Business: ${lead.businessName} (${lead.industry})
      Website Score: ${lead.websiteScore}/100
      My Service: ${myService}
      Contact Person: ${lead.contactPerson}

      1. Analyze why a business with a website score of ${lead.websiteScore} might need ${myService}. (Keep it brief, 2 sentences).
      2. Write a hyper-personalized cold email to ${lead.contactPerson}. The tone should be professional but conversational.
         Mention a specific (invented but plausible) flaw in their current setup and how I can fix it.
      
      Return JSON.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: { type: Type.STRING },
                    emailDraft: { type: Type.STRING }
                }
            }
        }
    });

    return JSON.parse(response.text || '{"analysis": "Could not analyze", "emailDraft": "Error generating draft."}');
  } catch (error) {
    console.error("Error generating pitch:", error);
    return {
        analysis: "AI Service Unavailable.",
        emailDraft: `Hi ${lead.contactPerson},\n\nI noticed some issues with your website that might be hurting your conversions. As a specialist in ${myService}, I'd love to help.\n\nBest,\n[Your Name]`
    };
  }
};

export const analyzeSentiment = async (replyText: string): Promise<{ sentiment: 'Positive' | 'Negative' | 'Question', suggestedReply: string }> => {
    try {
        const ai = getAiClient();
        const prompt = `
          Analyze the following email reply from a potential client:
          "${replyText}"

          1. Determine sentiment: "Positive", "Negative", or "Question".
          2. Draft a short, appropriate response based on the sentiment.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Question'] },
                        suggestedReply: { type: Type.STRING }
                    }
                }
            }
        });
        
        const res = JSON.parse(response.text || "{}");
        return {
            sentiment: res.sentiment || 'Question',
            suggestedReply: res.suggestedReply || 'Could not generate reply.'
        };
    } catch (e) {
        return { sentiment: 'Question', suggestedReply: 'Thank you for your reply. How would you like to proceed?' };
    }
}