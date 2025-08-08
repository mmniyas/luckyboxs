const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DB_FILE = "links.json";
const ALLOWED_FILE = "allowedPhones.json";
const CLICK_LOG = "clicks.json";

app.use(express.json());
app.use(express.static("public"));

// ✅ Serve game.html
app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "game.html"));
});

// ✅ Return all box data
app.get("/api/links", (req, res) => {
  if (!fs.existsSync(DB_FILE)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(data);
});

// ✅ Mark clicked box
app.post("/api/markUsed", (req, res) => {
  const { id, phone } = req.body;
  const data = JSON.parse(fs.readFileSync(DB_FILE));

  if (data.some((entry) => entry.clickedBy === phone)) {
    return res.status(403).json({ error: "You already clicked a box." });
  }

  const index = data.findIndex((l) => l.id === id);
  if (index !== -1) {
    data[index].used = true;
    data[index].clickedBy = phone;

    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

    // ✅ Save to clicks log
    let logs = [];
    if (fs.existsSync(CLICK_LOG)) {
      logs = JSON.parse(fs.readFileSync(CLICK_LOG));
    }
    logs.push({
      id,
      number: data[index].number,
      phone,
      time: new Date().toISOString(),
    });
    fs.writeFileSync(CLICK_LOG, JSON.stringify(logs, null, 2));

    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Box not found" });
  }
});

// ✅ Phone number validation
app.get("/api/verify-phone", (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: "Phone required" });

  const allowed = JSON.parse(fs.readFileSync(ALLOWED_FILE));
  const isAllowed = allowed.includes(phone);

  res.json({ allowed: isAllowed });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
