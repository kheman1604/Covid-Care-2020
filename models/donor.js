var mongoose = require("mongoose");
 
var donorSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone:String,
    location:String
});
 
module.exports = mongoose.model("Donor", donorSchema);