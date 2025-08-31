const { default: mongoose } = require("mongoose");
let setmessage = mongoose.Schema({
    profilepic:{
        type:String,
        required:true
    },
    outgoingid:{
        type:String,
        required:true
    },
    incomingid:{
        type:String,
        required:true,
    },
    sendername:{
        type:String,
        required:true
    },
    Umessage:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    created:{
        type:String,
        required:true
    }
});

let message = mongoose.model("NaxivoMessage",setmessage);
module.exports = {message};