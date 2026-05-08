import Groq from "groq-sdk";

const GROQ_API_KEY = (import.meta.env.VITE_GROQ_API_KEY || "").trim();
const GROQ_API_KEY_STATE = !GROQ_API_KEY ? "missing" : GROQ_API_KEY.startsWith("gsk_") ? "valid" : "invalid";

const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const realAnalyzeCV = async (cvText) => {
  const prompt = `
You are a career advisor. Analyze the following CV text. Answer in language CV is written in. Suggest ways to improve it. Give link to relevant resources. Return a JSON object with exactly this structure (no extra text, just the JSON):
{
  "skillLevel": "Beginner / Intermediate / Advanced / Expert",
  "suggestedRoles": ["Role1", "Role2", "Role3"],
  "reasons": ["Reason1", "Reason2", "Reason3"],
  "overall": "Short paragraph summarizing strengths and recommended job search direction."
}
CV text:
${cvText}
`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a career advisor. Always respond with valid JSON." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
    response_format: { type: "json_object" }
  });
  const content = chatCompletion.choices[0].message.content;
  return JSON.parse(content);
};

export const analyzeCV = async (cvText) => {
  if (GROQ_API_KEY_STATE !== "valid") {
    throw new Error(
      GROQ_API_KEY_STATE === "missing"
        ? "Missing VITE_GROQ_API_KEY."
        : "VITE_GROQ_API_KEY is present but does not look like a Groq key."
    );
  }
  return await realAnalyzeCV(cvText);
};

// Fetch job description from URL using a CORS proxy
const fetchJobContent = async (url) => {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  // Simple extraction – you can improve with regex or DOMParser
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 6000);
  return text;
};

// Analyze match between CV text and job description
export const analyzeMatch = async (cvText, jobUrl) => {
  if (GROQ_API_KEY_STATE !== "valid") {
    throw new Error(GROQ_API_KEY_STATE === "missing" ? "Missing API key." : "Invalid API key.");
  }
  const jobContent = await fetchJobContent(jobUrl);
  const prompt = `
You are a career advisor. Compare the candidate's CV with the job description below.
Return a JSON object with exactly this structure:
{
  "matchScore": "Percentage 0-100",
  "analysis": "Short paragraph explaining strengths, gaps, and overall fit."
}
CV:
${cvText}

Job Description:
${jobContent}
`;
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a career advisor. Always respond with valid JSON." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
    response_format: { type: "json_object" }
  });
  const content = chatCompletion.choices[0].message.content;
  return JSON.parse(content);
};

export const generateNicknameWithGroq = async (seed) => {
  if (GROQ_API_KEY_STATE !== "valid") {
    throw new Error(GROQ_API_KEY_STATE === "missing" ? "Missing VITE_GROQ_API_KEY." : "Invalid API key.");
  }

  const prompt = `Generate a short, friendly nickname for the user with identifier: ${seed}. Return only the nickname as plain text.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a friendly nickname generator. Return a single short nickname string with no punctuation." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 12
  });

  const content = chatCompletion.choices[0].message.content;
  // Trim and remove any surrounding quotes/newlines
  return String(content).trim().replace(/^"|"$/g, '');
};