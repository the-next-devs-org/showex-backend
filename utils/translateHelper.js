import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const translateText = async (text, targetLang) => {
  try {
    const apiKey = 'AIzaSyDjT0-ylLF5QPY0Gms7XwhtgxRM31PHQu0';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const response = await axios.post(url, {
      q: text,
      target: targetLang,
      format: "text",
    });

    return response.data.data.translations[0].translatedText;
  } catch (err) {
    console.error("Translation error:", err.message);
    return text;
  }
};
