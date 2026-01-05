const API_KEY = "WO7XL846PLVDPO1O"; // Alpha Vantage key
const BASE_URL = "https://www.alphavantage.co/query";

const form = document.getElementById("symbol-form");
const input = document.getElementById("symbol-input");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const symbol = input.value.trim().toUpperCase();
  if (!symbol) return;
  result.innerHTML = "Loading...";

  try {
    // Global Quote endpoint
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) throw new Error("No data found");

    const price = parseFloat(quote["05. price"]).toFixed(2);
    const change = parseFloat(quote["09. change"]).toFixed(2);
    const changePct = parseFloat(quote["10. change percent"]); // e.g., "1.25%"

    result.innerHTML = `
      <div class="price">${symbol}: $${price}</div>
      <div class="meta">
        <div><strong>Change:</strong> ${change}</div>
        <div><strong>Change %:</strong> ${changePct}</div>
        <div><strong>Updated:</strong> ${new Date().toLocaleTimeString()}</div>
      </div>
    `;
  } catch (err) {
    result.innerHTML = `<div class="error">Error: ${err.message}</div>`;
  }
});

// Optional: refresh every 60s
setInterval(() => {
  const symbol = input.value.trim();
  if (symbol) form.dispatchEvent(new Event("submit"));
}, 60000);
