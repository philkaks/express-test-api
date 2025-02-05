const functions = require("firebase-functions");
const express = require("express");
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");

initializeApp();
const db = getFirestore();

const app = express();
app.use(express.json());

const users = [
  {
    id: "001",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
  },
  {
    id: "002",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "editor",
  },
  {
    id: "003",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "viewer",
  },
];

app.get("/v1/users", (req, res) => {
  res.json(users);
});

app.get("/v1/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
});

app.post("/v1/createUser", async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const docRef = db.collection("users").doc();
  await docRef.set({
    name,
    email,
    role,
  });

  return res.status(200).json({ message: "User created successfully" });
});

// 🚀 Export as Firebase Cloud Function
exports.api = functions.https.onRequest(app);
