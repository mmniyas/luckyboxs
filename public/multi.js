let myPhone = localStorage.getItem("myPhone") || "";

async function askPhone() {
  while (!myPhone) {
    myPhone = prompt("📲 Enter your registered phone number:");
    if (!myPhone) continue;

    const res = await fetch(`/api/verify-phone?phone=${myPhone}`);
    const data = await res.json();

    if (data.allowed) {
      localStorage.setItem("myPhone", myPhone);
      break;
    } else {
      alert("❌ This phone number is not registered.");
      myPhone = "";
    }
  }
}

await askPhone();

fetch("/api/links")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("box-container");
    let userAlreadyClicked = data.some((link) => link.clickedBy === myPhone);

    data.slice(0, 9).forEach((link) => {
      const box = document.createElement("div");
      box.className = "box";

      if (link.used) {
        if (link.clickedBy === myPhone) {
          box.innerText = link.number;
          box.style.backgroundColor = "green";
        } else {
          box.innerText = "Used";
          box.style.backgroundColor = "red";
        }
        box.classList.add("clicked");
        box.onclick = null;
      } else {
        box.innerText = "Click Me!";
        box.onclick = () => {
          if (userAlreadyClicked) {
            alert("You already clicked one box.");
            return;
          }

          box.innerText = link.number;
          box.style.backgroundColor = "green";
          box.classList.add("clicked");
          box.onclick = null;
          userAlreadyClicked = true;

          fetch("/api/markUsed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: link.id, phone: myPhone }),
          });

          const adminNumber = "94773122900"; // Change to your WhatsApp number
          const msg = `📦 Phone ${myPhone} clicked box ${link.id} and got number ${link.number}`;
          const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(
            msg
          )}`;
          window.open(url, "_blank");
        };
      }

      container.appendChild(box);
    });
  })
  .catch((err) => {
    console.error("Error loading boxes:", err);
    document.getElementById("message").innerText = "❌ Error loading boxes.";
  });
