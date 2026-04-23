const express = require('express');
const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
  const { message, player } = req.body;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: `Kau adalah NPC bernama Zayn dalam game Roblox. Pemain yang cakap dengan ko namanya ${player}. Jawab pendek, friendly, dalam Bahasa Melayu. Max 2 ayat je.` }]
        },
        contents: [{ parts: [{ text: message }] }]
      })
    }
  );

  const data = await response.json();
  const reply = data.candidates[0].content.parts[0].text;
  res.json({ reply });
});

app.listen(3000, () => console.log('Server ON - port 3000'));