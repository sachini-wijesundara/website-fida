const http = require("http");

const server = http.createServer((req, res) => {
  const options = {
    hostname: "127.0.0.1",
    port: 3000,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: "localhost:3000" },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Waiting for server on port 3000...");
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Port 3001 proxy forwarding to port 3000 successfully");
});
