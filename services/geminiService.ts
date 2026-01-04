
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, FreshnessStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFoodImage = async (base64Image: string): Promise<AnalysisResult> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            text: `Analyze this food image and determine its freshness level. 
            Focus on visible signs of decay, mold, bruising, or dehydration.
            Classify it into one of three statuses:
            - 'Fresh': Excellent condition, ready to eat.
            - 'Okay': Showing some signs of age but still safe to consume (perhaps best for cooking).
            - 'Avoid': Spoiled, moldy, or unsafe to eat.
            
            Provide a detailed reasoning, category of food, and storage tips to maximize longevity.`
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1],
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: {
            type: Type.STRING,
            description: "One of: 'Fresh', 'Okay', 'Avoid'",
          },
          category: {
            type: Type.STRING,
            description: "The type of food detected (e.g., Apple, Chicken, Bread)",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence level between 0 and 1",
          },
          reasoning: {
            type: Type.STRING,
            description: "Detailed explanation of the visual findings",
          },
          shelfLife: {
            type: Type.STRING,
            description: "Estimated remaining shelf life (e.g., '3-4 days')",
          },
          storageTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of actionable tips to store this food better",
          },
        },
        required: ["status", "category", "confidence", "reasoning", "shelfLife", "storageTips"],
      },
    },
  });

  const response = await model;
  const resultText = response.text;
  
  if (!resultText) {
    throw new Error("Failed to get a response from the AI model.");
  }

  const parsed = JSON.parse(resultText);
  
  // Map string to Enum
  let status = FreshnessStatus.OKAY;
  if (parsed.status.toLowerCase() === 'fresh') status = FreshnessStatus.FRESH;
  if (parsed.status.toLowerCase() === 'avoid') status = FreshnessStatus.AVOID;

  return {
    ...parsed,
    status
  };
};
