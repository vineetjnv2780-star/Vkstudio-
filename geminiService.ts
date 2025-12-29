import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const parseWorkEntry = async (text: string): Promise<{ title: string; description: string; category: string; amount?: number } | null> => {
  if (!apiKey) {
    console.warn("Gemini API Key not found");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract work entry details from this text: "${text}". If amount is money, extract number. If no category fits, use 'General'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            amount: { type: Type.NUMBER, nullable: true },
          },
          required: ["title", "category", "description"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) return null;
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini parse error:", error);
    return null;
  }
};
