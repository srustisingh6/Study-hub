const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // make sure to install node-fetch

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Step 1: Supabase Data API setup
// Replace these with your actual project info from Supabase
const SUPABASE_URL = "https://dpetcduwmwhzctjtufgf.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwZXRjZHV3bXdoemN0anR1ZmdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM3MzUwOSwiZXhwIjoyMDg5OTQ5NTA5fQ.BBQQ0j2kkSO-o4xICBCFsG45ejXMC1r6yTUH7VBKMV0"; // Found in API → Service Key / Secret

const TABLE_NAME = "plans";

// 🔹 Step 2: POST endpoint to create a study plan
app.post("/plan", async (req, res) => {
  const { subjects, hours } = req.body;

  if (!subjects || !hours) {
    return res.status(400).send("Missing subjects or hours");
  }

  const count = subjects.length;
  const timePerSubject = (hours / count).toFixed(1);

  let result = "";
  subjects.forEach(sub => {
    result += `${sub.trim()} → ${timePerSubject} hrs\n`;
  });
  result += "\nTip: Take 10 min breaks every hour.";

  try {
    // Insert into Supabase table via Data API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_API_KEY,
        "Authorization": `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        subjects: subjects.join(","),
        hours,
        plan: result
      })
    });

    if (!response.ok) throw new Error(`Supabase insert failed: ${response.statusText}`);
    res.send(result);
  } catch (err) {
    console.error("Supabase Data API error:", err);
    res.status(500).send("Database error");
  }
});

// 🔹 Step 3: Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));