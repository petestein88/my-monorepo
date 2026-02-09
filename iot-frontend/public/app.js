const API_BASE = "http://localhost:3000";

async function fetchDevices() {
  try {
    const res = await fetch(`${API_BASE}/api/devices`);
    const devices = await res.json();
    const list = document.getElementById("devices");
    list.innerHTML = "";
    devices.forEach((device) => {
      const li = document.createElement("li");
      li.textContent = `${device.name} (${device.type}) — ${device.id}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch devices:", err);
  }
}

document.getElementById("device-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("device-name").value;
  const type = document.getElementById("device-type").value;
  try {
    await fetch(`${API_BASE}/api/devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });
    document.getElementById("device-form").reset();
    fetchDevices();
  } catch (err) {
    console.error("Failed to add device:", err);
  }
});

fetchDevices();
