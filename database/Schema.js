const mongoose = require("mongoose")

const recordSchema = new mongoose.Schema({
  date:String,
  attendance:Number,
  amount:Number
})

const empSchema = new mongoose.Schema({
  id:Number,
  name:String,
  salary:Number,
  records:[recordSchema]
},{collection:"employees"})

module.exports = mongoose.model("Employee",empSchema)