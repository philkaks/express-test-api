const db = require("../firebase");


//add an item.
const addItem = async (itemDetails) => {
  const collectionName = "Items";

  // Ensure the item has necessary properties and add a timestamp
  const itemToAdd = {
    ...itemDetails,
    createdAt: new Date().toISOString(), // Adds the current timestamp
  };

  try {
    const res = await db.collection(collectionName).add(itemToAdd);
    console.log("Added document with ID:", res.id);
    return res.id; // Return ID for further use if needed
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};


module.exports = { addItem };