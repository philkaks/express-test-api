const express = require("express");
const router = express.Router();
const { addItem, getItems, uploadImage } = require("../services/item_service");


router.post("/add", async (req, res) => {
  const { item } = req.body;

  // Check if item exists and if createdBy is present and not empty
  if (!item || !item.createdBy || item.createdBy.trim() === "") {
    return res
      .status(400)
      .json({ error: "Item details and a valid createdBy ID are required" });
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


router.get("/getAll", async (req, res) => {
  try {
    const items = await getItems();
    return res
      .status(200)
      .json({ message: "Available items Returned", allItems: items });
  } catch (error) {
    console.error("Error getting items:", error);
    return res.status(500).json({ error: "Failed to add item" });
  }
});


// Upload an image
router.post("/upload", async (req, res) => {
  try {
    const file = req.files[0]; // Extract the file from request

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedImageUrl = await uploadImage(file);
    res.status(200).send({
      fileUrl: uploadedImageUrl,
      message: "Image uploaded successfully"
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;