const express = require('express');
const app = express();
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/chat', async (req, res) => {
  const { message, player } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: `Kau adalah NPC bernama Zayn dalam game Roblox. Pemain yang cakap dengan ko namanya ${player}. Jawab pendek, friendly, dalam Bahasa Melayu. Max 2 ayat je.`,
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await response.json();
  
  if (data.content && data.content[0]) {
    res.json({ reply: data.content[0].text });
  } else {
    console.log("Claude error:", JSON.stringify(data));
    res.json({ reply: "Maaf, aku tak faham soalan tu!" });
  }
});

app.listen(3000, () => console.log('Server ON - port 3000'));