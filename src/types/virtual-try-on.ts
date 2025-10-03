
export interface ImageFile {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export interface EditImageResult {
  text: string | null;
  imageBase64: string | null;
  mimeType: string | null;
}

export type RingColor = 'yellow' | 'rose' | 'white';

export interface RingImageSet {
  yellow: string;
  rose: string;
  white: string;
}

export interface Ring {
  name: string;
  popularityScore: number;
  weight: number;
  images: RingImageSet;
}
