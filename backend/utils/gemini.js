import "dotenv/config";

const getGeminiAPIResponse = async(message)=>{
      

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    }),
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDCk8KQ0YDFOwnbBF2No9fv9MObfqys-sc",
      options
    );

    const data = await response.json();
    console.log("Full Response:", data);

    // ✅ Extract the reply safely
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

      let plainText = reply.replace(/\\n/g, "\n");
      plainText = plainText.replace(/\*\*/g, "").replace(/\*/g, "");

    return plainText ;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}


export default getGeminiAPIResponse;