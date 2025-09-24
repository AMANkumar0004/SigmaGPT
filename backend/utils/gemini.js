import "dotenv/config";

const getGeminiAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    }),
  };

  try {
    // ✅ Base URL without exposing key
    const baseUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    // ✅ Use environment variable instead of hardcoded key
    const response = await fetch(`${baseUrl}?key=${process.env.GEMINI_API_KEY}`, options);

    const data = await response.json();
    console.log("Full Response:", data);

    // ✅ Extract the reply safely
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    let plainText = reply.replace(/\\n/g, "\n");
    plainText = plainText.replace(/\*\*/g, "").replace(/\*/g, "");

    return plainText;
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong while calling Gemini API");
  }
};

export default getGeminiAPIResponse;
