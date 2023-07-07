const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  cookingTime: Number,
  ingredients: {
    type: [{ type: String, trim: true }],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy peasy', 'mid level', 'pro'],
  },
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
