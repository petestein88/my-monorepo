const http = require("http");

const PORT = process.env.PORT || 3000;

const devices = new Map();

function handleRequest(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/api/devices") {
    res.writeHead(200);
    res.end(JSON.stringify([...devices.values()]));
    return;
  }

  if (req.method === "POST" && req.url === "/api/devices") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const device = JSON.parse(body);
        device.id = device.id || `device-${Date.now()}`;
        device.createdAt = new Date().toISOString();
        devices.set(device.id, device);
        res.writeHead(201);
        res.end(JSON.stringify(device));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`IoT backend running on port ${PORT}`);
  });
}

module.exports = { handleRequest, devices, server };
