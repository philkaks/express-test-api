const { db, storage } = require("../firebase");
const { Readable } = require("stream");
const { v4: uuidv4 } = require("uuid");

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



// Upload image to Firebase Storage
const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const fileStream = Readable.from(file.buffer);
      const fileUpload = storage.file(`Items/${uuidv4()}_${file.originalname}`);

      const writeStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      fileStream
        .pipe(writeStream)
        .on("error", (error) => {
          console.error("Error:", error);
          reject(error); // Reject the promise on error
        })
        .on("finish", async () => {
          try {
            await fileUpload.makePublic(); // Make file public
            const publicUrl = fileUpload.publicUrl(); // Get public URL
            resolve(publicUrl); // Resolve the promise with the URL
          } catch (error) {
            console.error("Error making file public:", error);
            reject(error);
          }
        });
    } catch (error) {
      console.error("Error:", error);
      reject(error);
    }
  });
};


//Edit Item
const editItem = async (postId, updatedFields) => {
  if (!postId || !updatedFields || Object.keys(updatedFields).length === 0) {
    throw new Error("Item ID and at least one field to update are required");
  }

  try {
    await itemsRef.doc(postId).update({
      ...updatedFields,
      updatedAt: new Date().toISOString(), // Track the update time
    });

    console.log("Updated Item with ID:", postId);
    return { message: "Item updated successfully", id: postId };
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};


// Get a single item by ID
const getItemById = async (itemId) => {
  if (!itemId) {
    throw new Error("Item ID is required");
  }

  try {
    const doc = await itemsRef.doc(itemId).get();

    if (!doc.exists) {
      throw new Error("Item not found");
    }

    return { id: doc.id, ...doc.data() }; // Return the item data with the ID
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error;
  }
};




module.exports = { addItem, getItems, uploadImage, editItem, getItemById };
