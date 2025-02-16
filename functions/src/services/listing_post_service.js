const {db, storage} = require("../firebase");

const collectionName = "Posts";
const postsRef = db.collection(collectionName);

//add an item.
const addPost = async (postDetails) => {
  const itemToAdd = {
    ...postDetails,
    createdAt: new Date().toISOString(), // Adds the current timestamp
  };

  try {
    const res = await postsRef.add(itemToAdd);
    console.log("Added Post with ID:", res.id);
    return res.id; // Return ID for further use if needed
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

//Edit Post
const editPost = async (postId, updatedFields) => {
  if (!postId || !updatedFields || Object.keys(updatedFields).length === 0) {
    throw new Error("Post ID and at least one field to update are required");
  }

  try {
    await postsRef.doc(postId).update({
      ...updatedFields,
      updatedAt: new Date().toISOString(), // Track the update time
    });

    console.log("Updated Post with ID:", postId);
    return { message: "Post updated successfully", id: postId };
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

//get all Post By User.
const getAllPostsByUser = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  
  try {
    const snapshot = await postsRef.where("createdBy", "==", userId).get();
    const posts = [];

    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return posts; // Return the filtered array of posts
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    throw error;
  }
};

// Get all posts (listings)
const getAllPosts = async () => {
  try {
    const snapshot = await postsRef.get();
    const posts = [];

    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return posts;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};



//Delete post
const deletePost = async (postId) => {
  if (!postId) {
    throw new Error("Post ID is required to delete a post");
  }

  try {
    const postRef = postsRef.doc(postId);
    const postSnapshot = await postRef.get();

    if (!postSnapshot.exists) {
      throw new Error("Post not found");
    }

    await postRef.delete();
    console.log("Deleted Post with ID:", postId);
    return { message: "Post deleted successfully", id: postId };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

//Get post by ID
const getPostById = async (postId) => {
  if (!postId) throw new Error("Post ID is required");

  try {
    const postSnapshot = await postsRef.doc(postId).get();

    if (!postSnapshot.exists) {
      throw new Error("Post not found");
    }

    return { id: postSnapshot.id, ...postSnapshot.data() };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};


module.exports = {
  addPost,
  editPost,
  getAllPostsByUser,
  getAllPosts,
  deletePost,
  getPostById,
};
