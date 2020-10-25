var mongoose = require("mongoose");
 
var returnSchema = new mongoose.Schema({
    mail: String,
    
    graph:String
});
 
module.exports = mongoose.model("Return", returnSchema);