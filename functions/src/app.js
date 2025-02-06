const express = require("express");
const usersRoutes = require("./routes/users_routes");
const itemsRoutes = require("./routes/item_routes");

const app = express();
app.use(express.json());

// Mount routes
app.use("/v1/users", usersRoutes);
app.use("/v1/items", itemsRoutes);

module.exports = app;


// App.js is responsible for:
// ✅ Initializing Express
// ✅ Middleware (e.g., JSON parsing, CORS, logging, authentication, etc.)
// ✅ Defining API routes
// ✅ Exporting the app instance for use in index.js (Firebase Functions, or another server setup)
