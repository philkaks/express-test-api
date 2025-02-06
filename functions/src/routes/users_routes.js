const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  updateUser,
} = require("../services/auth_service");


// Get a user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUser(id); // Fetch the user by UID
    return res.status(200).json({ user }); // Send the user data as a response
  } catch (error) {
    return res.status(404).json({ error: "User not found or invalid ID" }); // Handle errors
  }
});


// Create a user
//properties supported, check the update function below, in the comments
router.post("/create", async (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

  const newUser = await createUser(name, email, role);
  return res.status(200).json({ message: "User created successfully", user: newUser });
});


//update a user
/**
 * Firebase Update User Properties:
 * 
 * - email (string)          : New primary email (must be valid).
 * - emailVerified (boolean) : Whether email is verified (default: false).
 * - phoneNumber (string)    : New primary phone number (E.164 format). Set to null to remove.
 * - password (string)       : New password (min. 6 characters).
 * - displayName (string|null) : New display name. Set to null to remove.
 * - photoURL (string|null)  : New profile photo URL. Set to null to remove.
 * - disabled (boolean)      : true to disable the user, false to enable.
 */
router.put("/update/:id", async (req, res) => {
    // Get the user ID from the request path params
    //the {} means we are destructuring the id from the request.params
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await updateUser(id, updates);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(404).json({ error: "User not found or invalid ID" });
  }
});



module.exports = router;


//🔗 Reference:
//https://firebase.google.com/docs/auth/admin/manage-users#before_you_begin


//TODO
//? to implement on client side because the firebase Admin-SDK doesnt offer these.
//Login 
//Log-Out 
//Google-sign in.