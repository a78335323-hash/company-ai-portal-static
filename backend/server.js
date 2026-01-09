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

// 🧠 End-point CHAT AI
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ success: false, error: "Nessun messaggio" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }]
    });

    res.json({
      success: true,
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// 🚀 avvio server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server avviato su porta " + port);
});
