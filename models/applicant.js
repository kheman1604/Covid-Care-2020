var mongoose = require("mongoose");
 
var applicantSchema = new mongoose.Schema({
    name: String,
location: String,
 bloodgroup:String,
    contact:String,
    email:String
});
 
module.exports = mongoose.model("Applicant", applicantSchema);