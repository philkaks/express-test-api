const express = require("express");
const usersRoutes = require("./routes/users_routes");
const itemsRoutes = require("./routes/item_routes");
const listingPostRoutes = require("./routes/listing_post_routes");
const cors = require("cors");
const fileParser = require("express-multipart-file-parser");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(fileParser);
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Mount routes
app.use("/v1/users", usersRoutes);
app.use("/v1/items", itemsRoutes);
app.use("/v1/listing", listingPostRoutes);

module.exports = app;


// App.js is responsible for:
// ✅ Initializing Express
// ✅ Middleware (e.g., JSON parsing, CORS, logging, authentication, etc.)
// ✅ Defining API routes
// ✅ Exporting the app instance for use in index.js (Firebase Functions, or another server setup)
