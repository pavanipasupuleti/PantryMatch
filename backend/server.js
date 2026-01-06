import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import recipeRoutes from "./routes/recipeRoutes.js";

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recipes", recipeRoutes);


// Server
const PORT = 5055;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
