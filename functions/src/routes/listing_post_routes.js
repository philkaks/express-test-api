const express = require("express");
const router = express.Router();
const {
  addPost,
  editPost,
  getAllPostsByUser,
  deletePost,
  getPostById,
} = require("../services/listing_post_service");

// Add a new post
router.post("/add", async (req, res) => {
    const { post } = req.body;
    const validationError = validatePost(post);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const postId = await addPost(post);
        return res
            .status(201)
            .json({ message: "Post added successfully", id: postId });
    } catch (error) {
        return res.status(500).json({ error: "Failed to add post" + error });
    }
});

// Edit a post
router.put("/edit/:id", async (req, res) => {
    const { id: postId } = req.params;
    const { updatedFields } = req.body;

    const validationError = validatePostUpdate(postId, updatedFields);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const result = await editPost(postId, updatedFields);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update post" + error });
    }
});

//Get all posts by user
router.get("/getAll/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await getAllPostsByUser(userId);
        return res
            .status(200)
            .json({ message: "All posts retrieved successfully", posts });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

//Delete a post
router.delete("/delete/:postId", async (req, res) => {
    const { postId } = req.params;

    if (!postId) return res.status(400).json({ error: "Post ID is required" });

    try {
        const result = await deletePost(postId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

// Get a specific post by ID
router.get("/get/:postId", async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ error: "Post ID is required" });
    }

    try {
        const post = await getPostById(postId);
        return res.status(200).json({ message: "Post retrieved successfully", post });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


//validate adding post
const validatePost = (post) => {
    if (!post) return "Post details are required";
    const { itemId, createdBy } = post;
    if (!itemId) return "itemId is required";
    if (!createdBy) return "createdBy id is required";
    return null; // No errors
};

//validate Post Update
const validatePostUpdate = (postId, updatedFields) => {
    if (!postId) return "Post ID is required";
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
        return "At least one field to update is required";
    }
    return null; // No errors
};

module.exports = router;
