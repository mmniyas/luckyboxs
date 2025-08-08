const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
console.log("Link ID received:", id); // Debug

const container = document.getElementById("box-container");
const message = document.getElementById("message");

if (!id) {
  message.innerText = "❌ No link ID provided!";
} else {
  fetch(`/api/lucky?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("API response:", data); // Debug
      if (data.used) {
        message.innerText = `❌ This link has already been used. Number: ${data.number}`;
      } else {
        const box = document.createElement("div");
        box.className = "box";
        box.innerText = "Click Me!";
        box.addEventListener("click", () => {
          box.innerText = data.number;
          box.classList.add("clicked");
          fetch("/api/markUsed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
        });
        container.appendChild(box);
      }
    })
    .catch((error) => {
      console.error("API error:", error); // Show error in browser
      message.innerText = "❌ Something went wrong fetching the link.";
    });
}
