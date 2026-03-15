const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createItem, getAllItems,getItemById,resolveItem,deleteItem } = require("../controllers/itemController");
const upload = require("../middleware/uploadMiddleware");


router.post("/create", authMiddleware,upload.single("image"), createItem);
router.get("/all", getAllItems);
router.get("/:id", getItemById);
router.put("/:id/resolve", authMiddleware, resolveItem);
router.delete("/:id", authMiddleware, deleteItem);
module.exports = router;