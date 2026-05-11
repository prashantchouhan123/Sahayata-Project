import { GoogleGenerativeAI } from "@google/generative-ai";

// Vite environment variable se API Key access kar rahe hain
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

/**
 * 📸 FUNCTION 1: REPORT ANALYSIS (Existing)
 * ReportPage par image aur description ko analyze karne ke liye.
 */
export const analyzeIncident = async (imageFile, userText = "") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // 1. Photo ko base64 format mein badalna
    const base64Data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(imageFile);
    });

    // 2. Powerful Prompt (Bhopal context ke saath)
    const prompt = `Analyze this civic issue in Bhopal. 
    User comment: "${userText}". 
    Strictly return ONLY JSON: 
    {
      "category": "Garbage/Pothole/Water/Electricity/Roads", 
      "priority": "Critical/High/Medium/Low", 
      "summary": "10-word summary in Hinglish"
    }`;

    // 3. AI ko Image aur Prompt bhejna
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: imageFile.type } }
    ]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "");
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("AI Error (Incident):", error);
    // Backup Data (taki app crash na ho)
    return {
      category: "General",
      priority: "Medium",
      summary: "Manual: " + (userText ? userText.substring(0, 20) : "Issue reported")
    };
  }
};

/**
 * 💬 FUNCTION 2: CITIZEN FEEDBACK ANALYSIS (New)
 * User ke feedback text ko judge karne ke liye ki issue fix hua ya nahi.
 */
export const analyzeFeedback = async (feedbackText) => {
  try {
    // Fast analysis ke liye Flash model use kar rahe hain
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Analyze this citizen feedback for a civic issue in Bhopal: "${feedbackText}". 
    If the user is unsatisfied, complaining, says work is incomplete, or the problem still exists, return exactly 'REOPEN'. 
    If the user is happy, satisfied, thanks the team, or confirms resolution, return exactly 'RESOLVE'. 
    Answer in strictly one word only.`;

    const result = await model.generateContent(prompt);
    const decision = result.response.text().trim().toUpperCase();
    
    // Sirf 'REOPEN' ya 'RESOLVE' return hona chahiye
    return decision.includes('REOPEN') ? 'REOPEN' : 'RESOLVE';

  } catch (error) {
    console.error("AI Error (Feedback):", error);
    // Error hone par safe side ke liye reopen hi rakhenge
    return "REOPEN"; 
  }
};