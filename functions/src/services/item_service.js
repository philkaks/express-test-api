const db = require("../firebase");

const collectionName = "Items";
const itemsRef = db.collection(collectionName);

//add an item.
const addItem = async (itemDetails) => {
  
  const itemToAdd = {
    ...itemDetails,
    createdAt: new Date().toISOString(), // Adds the current timestamp
  };

  try {
    const res = await itemsRef.add(itemToAdd);
    console.log("Added document with ID:", res.id);
    return res.id; // Return ID for further use if needed
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

//get all items.
const getItems = async () => {
  try {
    const snapshot = await itemsRef.get();
    const items = [];

    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return items; // Return the array of items
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};





module.exports = { addItem, getItems };