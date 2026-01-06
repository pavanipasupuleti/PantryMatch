
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: String,
  category: String,   
  cuisine: String,    
  time: Number,       
  imageKey: String,   

  ingredients: [
    { name: String, quantity: String }
  ],

  steps: [
    { order: Number, title: String, description: String }
  ]
});
const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
