// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Use axios for HTTP requests
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GROQ_API_KEY;
console.log("Loaded API Key:", apiKey); // Debug: Check if API key is loaded

app.post("/api/songs", async (req, res) => {
  const { mood } = req.body;
  try {
    const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";
    console.log(`Making request to: ${groqEndpoint}`); // Debug: Print endpoint

    // Make a request to Groq AI API for songs that could improve the user's mood
    const groqResponse = await axios.post(
      groqEndpoint,
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: `Based on the command "${mood}", suggest a unique set of telugu and tamil songs names which are only in spotify and give it in single list without any extra content and language mentioned. Please include a fresh list each time.`,
          },
        ],
        temperature: 0.9, // Increased temperature for more creative responses
        // Removed top_p to allow broader token selection range
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const songSuggestions =
      groqResponse.data?.choices?.[0]?.message?.content || "No songs available";
    res.json({ songs: songSuggestions.split("\n").filter(Boolean) });
  } catch (error) {
    console.error(
      "Error fetching songs:",
      error.response?.data || error.message
    ); // Log the detailed error message
    res.status(500).json({ error: "Error fetching songs with Groq AI" });
  }
});

const PORT = process.env.PORT || 5501;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
