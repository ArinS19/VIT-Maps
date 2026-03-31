const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel");

// ADD REVIEW
router.post("/", async (req, res) => {
    try {
        const { userId, locationId, rating, comment } = req.body;

        const review = new Review({
            userId,
            locationId,
            rating,
            comment
        });

        await review.save();

        res.status(201).json({ message: "Review added successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// GET reviews for a location
router.get("/:locationId", async (req, res) => {
    try {
        const reviews = await Review.find({
            locationId: req.params.locationId
        }).populate("userId", "name");

        res.json(reviews);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("userId", "name")
            .populate("locationId", "name");

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;