import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile, EditImageResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

export const editImage = async (
  personImage: ImageFile,
  ringImage: ImageFile
): Promise<EditImageResult> => {
  try {
    const prompt = `
You are a master digital artist specializing in hyper-realistic jewelry photo compositing. Your goal is to edit the photo of the hand to show it wearing the provided ring. Follow these steps meticulously:

**Step 1: Analyze the Hand Image**
- Locate the hand in the primary image.
- Identify all the fingers.
- Pinpoint the exact location of the **ring finger**. The ring finger is the one located between the middle finger and the little finger (pinky). This is your ONLY target for ring placement.

**Step 2: Position the Ring**
- Take the ring from the secondary image.
- Place it precisely onto the identified **ring finger** of the hand.
- The ring should be positioned at the base of the finger, where a ring is naturally and comfortably worn.
- Ensure the ring fits snugly and the perspective and scale are perfectly matched to the finger.

**Step 3: Final Checks & Critical Rule**
- **ABSOLUTE RULE:** The final edited image must show the ring on **ONE AND ONLY ONE** finger.
- Under **NO CIRCUMSTANCES** should the ring touch, overlap, or span across multiple fingers. This is a critical failure condition.
- The final result must be photorealistic, with correct lighting, shadows, and reflections that match the original hand image.
`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: personImage.base64,
              mimeType: personImage.mimeType,
            },
          },
          {
            inlineData: {
              data: ringImage.base64,
              mimeType: ringImage.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response candidates from the model.");
    }

    const result: EditImageResult = {
      text: null,
      imageBase64: null,
      mimeType: null,
    };

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        result.text = (result.text || "") + part.text;
      } else if (part.inlineData) {
        result.imageBase64 = part.inlineData.data;
        result.mimeType = part.inlineData.mimeType;
      }
    }

    if (!result.imageBase64) {
        throw new Error("The model did not return an image. It might have refused the request.");
    }

    return result;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while calling the Gemini API.");
  }
};