const db = require("../firebase");
const { getAuth } = require("firebase-admin/auth");

const createUser = async (name, email, role) => {
  getAuth()
    .createUser({
      email: email,
      emailVerified: false,
      displayName: name,
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false,
      role: role,
    })
    .then((userRecord) => {
      console.log("Successfully created new user:", userRecord.uid);
    //store user data in firestore
    //No need to do this becausee the api returns the full user object as created, unlike the flutter package.
    //But if you want to store the user data in firestore, you can do so like this:
      const userRef = db.collection("users").doc(userRecord.uid);
      userRef.set({
        name: name,
        email: email,
        role: role,
      });
    })
    .catch((error) => {
      throw new Error("Error Creating A user: " + error.message); 
    });
};

const getUser = async (uid) => {
  try {
    const userRecord = await getAuth().getUser(uid); 
    return userRecord.toJSON(); 
  } catch (error) {
    throw new Error("Error fetching user data: " + error.message); // Throw error if not found
  }
};

const updateUser = async (uid, updates) => {
  try {
    const userRecord = await getAuth().updateUser(uid, updates);
    return {
      success: true,
      message: "User updated successfully",
      user: userRecord.toJSON(),
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message: "Failed to update user",
      error: error.message,
    };
  }
};





module.exports = { createUser, getUser, updateUser };