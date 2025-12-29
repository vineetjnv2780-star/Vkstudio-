import { GoogleGenAI, Type } from "@google/genai";
import { WorkEntry } from '../types';

// Lazy initialization of AI client
let aiInstance: GoogleGenAI | null = null;

const getAiClient = () => {
  if (aiInstance) return aiInstance;

  // As per guidelines, exclusively use process.env.API_KEY
  const apiKey = process.env.API_KEY;

  // If no key found, we can't initialize properly
  if (!apiKey) {
    console.warn("Gemini API Key not found. Ensure process.env.API_KEY is set.");
    return null;
  }

  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
};

export const parseWorkEntry = async (text: string): Promise<Partial<WorkEntry> | null> => {
  const ai = getAiClient();
  
  if (!ai) {
    console.warn("Gemini Client could not be initialized (Missing API Key)");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract vehicle, customer, and address details from this text: "${text}".
      Return a JSON object with keys matching the schema.
      For addresses, try to identify if it's permanent or correspondence.
      If a date is found, try to map it to insurance start/end if relevant.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customerName: { type: Type.STRING, nullable: true },
            fatherName: { type: Type.STRING, nullable: true },
            mobileNumber: { type: Type.STRING, nullable: true },
            bikeNumber: { type: Type.STRING, nullable: true },
            engineNumber: { type: Type.STRING, nullable: true },
            chassisNumber: { type: Type.STRING, nullable: true },
            permanentAddress: { type: Type.STRING, nullable: true },
            correspondenceAddress: { type: Type.STRING, nullable: true },
            bikeLocationAddress: { type: Type.STRING, nullable: true },
            insuranceStart: { type: Type.STRING, nullable: true },
            insuranceEnd: { type: Type.STRING, nullable: true },
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) return null;
    return JSON.parse(resultText) as Partial<WorkEntry>;
  } catch (error) {
    console.error("Gemini parse error:", error);
    return null;
  }
};