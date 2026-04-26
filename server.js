const express = require('express');
const app = express();
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/chat', async (req, res) => {
  const { message, system, messages } = req.body;

  // Support dua mod:
  // 1. messages array (conversation history) — dari ZoneManager baru
  // 2. message string (single) — dari sistem lama
  
  let messageArray;
  if (messages && Array.isArray(messages)) {
    messageArray = messages;
  } else {
    messageArray = [{ role: "user", content: message || "hello" }];
  }

  const systemPrompt = system || "Kau adalah pemandu pelancong warisan Melaka. Jawab dalam Bahasa Melayu yang sopan dan menarik.";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: messageArray
      })
    });

    const data = await response.json();
    
    if (data.content && data.content[0]) {
      res.json({ reply: data.content[0].text });
    } else {
      console.log("Claude error:", JSON.stringify(data));
      res.status(500).json({ reply: "Maaf, sistem sedang bermasalah." });
    }
  } catch (err) {
    console.log("Server error:", err);
    res.status(500).json({ reply: "Maaf, terdapat ralat teknikal." });
  }
});

app.listen(3000, () => console.log('NPC Proxy Server ON - port 3000'));