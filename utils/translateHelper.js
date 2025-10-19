// backend/utils/translateHelper.js
import { v2 as Translate } from "@google-cloud/translate";
import path from "path";

const keyFile = path.join(process.cwd(), "config", "google-translate-key.json");

const translate = new Translate.Translate({
  keyFilename: keyFile,
});

export const translateText = async (text, targetLang) => {
  if (!text || !targetLang) return text;
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (error) {
    console.error("Translation error:", error.message);
    return text; 
  }
};
