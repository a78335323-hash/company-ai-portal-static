const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 🔑 OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 💾 memoria chat temporanea per utente (molto semplice)
let conversations = {};

// 🧠 Endpoint CHAT AI
app.post("/chat", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!message) {
      return res.json({ success: false, error: "Nessun messaggio" });
    }

    // se non esiste la conversazione, creala
    if (!conversations[userId]) {
      conversations[userId] = [];
    }

    // aggiungi messaggio utente alla memoria
    conversations[userId].push({ role: "user", content: message });

    // chiama openai includendo memoria conversazione
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversations[userId]
    });

    const reply = completion.choices[0].message.content;

    // salva risposta AI in memoria
    conversations[userId].push({ role: "assistant", content: reply });

    return res.json({
      success: true,
      reply
    });

  } catch (err) {
    console.error(err);
    return res.json({ success: false, error: err.message });
  }
});

// 🚀 avvio server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server avviato su porta " + port);
});
