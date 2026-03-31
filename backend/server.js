const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const locationRoutes = require("./routes/locationRoutes");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
require("dotenv").config();

const app = express();

// Middleware
const corsOptions = {
    origin: [
        "https://vitmaps.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/locations", locationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
    res.send("VITMaps Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
