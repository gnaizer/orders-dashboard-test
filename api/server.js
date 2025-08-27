const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Simulate delay + random 500 errors
server.use(async (req, res, next) => {
    const delay = Math.floor(Math.random() * 900) + 300; // 300–1200 ms
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (Math.random() < 0.1) {
        return res.status(500).jsonp({ error: "Random simulated server error" });
    }
    next();
});

server.use(router);

server.listen(3001, () => {
    console.log("🚀 JSON Server running at http://localhost:3001");
});