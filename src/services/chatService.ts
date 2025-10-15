interface APIMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export const sendMessage = async (messages: APIMessage[]): Promise<string> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-goog-api-key", import.meta.env.example.VITE_GEMINI_API_KEY);

  // Format the conversation history correctly
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.parts[0].text }]
  }));

  const raw = JSON.stringify({
    contents: formattedMessages
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      requestOptions
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error("Failed to fetch response from Gemini API");
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't get a response. Could you try again?";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Sorry — I'm having trouble right now. Please try again later.";
  }
};