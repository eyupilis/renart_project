import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile, EditImageResult } from '../types/virtual-try-on';

// Make Gemini API optional for deployment
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
const model = 'gemini-2.5-flash-image-preview';

export const editImage = async (
  personImage: ImageFile,
  ringImage: ImageFile
): Promise<EditImageResult> => {
  // Check if Gemini API is available
  if (!ai || !GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY not configured. Virtual Try-On feature disabled.');
    
    // Return a demo response
    return {
      text: 'Virtual Try-On Feature Unavailable: Gemini API key not configured',
      imageBase64: null,
      mimeType: null,
    };
  }

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
    
    const response = await ai!.models.generateContent({
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

    const candidate = response.candidates[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.text) {
          result.text = (result.text || "") + part.text;
        } else if (part.inlineData?.data && part.inlineData?.mimeType) {
          result.imageBase64 = part.inlineData.data;
          result.mimeType = part.inlineData.mimeType;
        }
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

export async function analyzeRingImage(imageBase64: string): Promise<string> {
  // Check if Gemini API is available
  if (!ai || !GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY not configured. Virtual Try-On feature disabled.');
    return `Virtual Try-On Analysis (Demo Mode)
    
🔍 Ring Analysis:
- Style: Classic Engagement Ring Setting
- Estimated Characteristics: Premium quality with elegant design
- Metal: High-quality precious metal
- Design: Timeless and sophisticated
- Note: For full AI analysis, configure VITE_GEMINI_API_KEY in environment variables

This is a demo response since the Gemini API key is not configured.`;
  }

  try {
    const prompt = `Analyze this engagement ring image and provide a detailed description including:
    - Ring style and setting type
    - Estimated carat weight and diamond characteristics
    - Metal type (if visible)
    - Overall design elements
    - Estimated price range
    
    Please be specific and professional in your analysis.`;

    const response = await ai!.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: imageBase64,
              mimeType: "image/jpeg",
            },
          },
        ],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    const candidate = response.candidates[0];
    let resultText = '';
    
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.text) {
          resultText += part.text;
        }
      }
    }

    return resultText || 'Unable to analyze the ring image.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Failed to analyze ring image. Please check your API configuration.';
  }
}