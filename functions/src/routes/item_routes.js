const express = require("express");
const router = express.Router();
const {
  addItem,
  getItems,
  uploadImage,
  editItem,
  getItemById,
} = require("../services/item_service");


router.post("/add", async (req, res) => {
  const { data } = req.body;

  // Check if item exists 
  if (!data) {
    return res
      .status(400)
      .json({ error: "Item details required" });
  }

  try {
    const addedItemId = await addItem(data);
    return res.status(200).json({ data: { id: addedItemId } });
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
      data: { url: uploadedImageUrl },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: error.message });
  }
});


// Edit a item
router.put("/edit/:id", async (req, res) => {
    const { id: itemId } = req.params;
    const { updatedFields } = req.body;

    const validationError = validateItemUpdate(itemId, updatedFields);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const result = await editItem(itemId, updatedFields);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update item" + error });
    }
});

// Get an item by ID
router.get("/get/:id", async (req, res) => {
  const { id: itemId } = req.params;

  if (!itemId) {
    return res.status(400).json({ error: "Item ID is required" });
  }

  try {
    const item = await getItemById(itemId);
    return res.status(200).json({ message: "Item retrieved successfully", item });
  } catch (error) {
    console.error("Error fetching item:", error);
    return res.status(500).json({ error: error.message || "Failed to retrieve item" });
  }
});



//validate Post Update
const validateItemUpdate = (itemId, updatedFields) => {
    if (!itemId) return "item ID is required";
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
        return "At least one field to update is required";
    }
    return null; // No errors
};



module.exports = router;