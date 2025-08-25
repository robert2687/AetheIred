import { GoogleGenAI, Type } from '@google/genai';
import { DocumentTemplate } from '../types';

interface GeneratedDraft {
  title: string;
  content: string;
}

export const generateDraft = async (
  template: DocumentTemplate,
  inputs: Record<string, string>
): Promise<GeneratedDraft> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const inputDetails = Object.entries(inputs)
    .map(([key, value]) => {
      const label = template.inputs[key]?.label || key;
      return `- **${label}:** ${value}`;
    })
    .join('\n');

  const prompt = `
Please act as an expert legal drafting assistant. Your task is to generate a formal "${template.name}" document.

**Document Type:** ${template.name}
**Template Description:** ${template.description}

**User-Provided Information:**
${inputDetails}

Based on this request, generate a response in the specified JSON format. The title should be specific and professional, incorporating details from the provided information (e.g., party names). The content must be a complete, well-structured legal document in GitHub Flavored Markdown. Where information is missing, use standard boilerplate language or clear placeholders like "[Specify Details Here]".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an AI legal assistant named Aethelred. Your purpose is to draft clear, professional, and comprehensive legal documents. Your output must be in the requested JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A concise and professional document title, reflecting the provided details (e.g., party names)."
            },
            content: {
              type: Type.STRING,
              description: "The full legal document content in well-formatted GitHub Flavored Markdown."
            }
          },
          required: ["title", "content"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("Received an empty response from the AI.");
    }
    
    // To ensure robust parsing, trim whitespace and remove potential markdown code fences
    // that the model might occasionally add, even with the JSON mime type.
    const cleanedJsonString = text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const parsedResponse: GeneratedDraft = JSON.parse(cleanedJsonString);
    
    // Basic validation to ensure we got what we expected
    if (!parsedResponse.title || !parsedResponse.content) {
      throw new Error("AI response is missing title or content.");
    }

    return parsedResponse;

  } catch (error) {
    console.error("Error generating document with Gemini:", error);
    // Re-throw a more user-friendly error
    throw new Error("Failed to generate the document draft. The AI service may be unavailable or experienced an error.");
  }
};
