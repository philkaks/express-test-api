const express = require("express");
const router = express.Router();
const { addItem } = require("../services/item_service");


router.post("/add", async (req, res) => {
  const { item } = req.body;

  if (!item) {
    return res.status(400).json({ error: "Item details are required" });
  }

  try {
    const addedItemId = await addItem(item);
    return res
      .status(200)
      .json({ message: "Item added successfully", id: addedItemId });
  } catch (error) {
    console.error("Error adding item:", error);
    return res.status(500).json({ error: "Failed to add item" });
  }
});

module.exports = router;