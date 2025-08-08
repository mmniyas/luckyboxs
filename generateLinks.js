// generateLinks.js
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const TOTAL_LINKS = 10;
const numbers = Array.from({ length: TOTAL_LINKS }, (_, i) => i + 1).sort(
  () => 0.5 - Math.random()
); // Shuffle

const links = numbers.map((num) => ({
  id: uuidv4(),
  number: num,
  used: false,
}));

fs.writeFileSync("links.json", JSON.stringify(links, null, 2));
console.log("✅ Fresh 10 links generated.");
