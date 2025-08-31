const { default: mongoose } = require("mongoose");

let Request = mongoose.Schema({
    profilepic:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    senderid:{
        type:String,
        required:true,
    },
    reciverid:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    acceptname:{
        type:String,
        required:true
    },
    acceptprofilepic:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    created:{
        type:String,
        required:true
    }
});

let request = mongoose.model("Naxivorequest",Request);
module.exports = {request};