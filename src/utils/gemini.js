// import { GoogleGenerativeAI } from "@google/generative-ai";

// const getGeminiResponse = async (prompt) => {
//     try {
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         return response.text();
//     } catch (error) {
//         console.error("Gemini API Error:", error);
//         throw new Error("Failed to get response from Gemini");
//     }
// };

// export { getGeminiResponse }; 