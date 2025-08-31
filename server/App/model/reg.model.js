const { default: mongoose } = require("mongoose");

let Users = mongoose.Schema({
    profilepic:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created:{
        type:String,
        required:true
    },
    updated:{
        type:String,
        required:true
    }
});

let users = mongoose.model("Naxivousers",Users);
module.exports = {users};