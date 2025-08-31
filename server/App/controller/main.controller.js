let {request} = require("../model/request.model");
let {users} = require("../model/reg.model");
let {message} = require("../model/message.model");

let testapi = (req,res)=>{
    res.send("ok working api");
}

let register = (req,res)=>{
    let {fullname,email,phone,password} = req.body;
    let inserted = new users({
        profilepic:"null",
        fullname,
        email,
        phone,
        password,
        created:new Date(),
        updated:new Date()
    })
    inserted.save().then(()=>{
        res.status(200).json({status:200,message:"Register Successfully",data:inserted})
    })
}

let login = async (req,res)=>{
    let {email,password} = req.body;
    let checkemail = await users.findOne({email:email});
    if(checkemail != null)
    {
        if(password == checkemail.password)
        {
            res.status(200).json({status:200,message:"login success",userinfo:checkemail});
        }
        else
        {
            res.send({status:500,message:"Wrong Email And Password",error:"...."});
        }
    }
    else
    {
        res.send({status:500,message:"Wrong Email And Password",error:"...."});
    }
}

let allusers = async (req,res)=>{
    let getusers =  await users.find();
    if(getusers != null)
    {
        res.status(200).json({status:200,message:"Get All Users",users:getusers});
    }
    else
    {
        res.send({status:200,message:"No Users"});
    }
}

let update = async (req,res)=>{
    let profilepic = req.file;
    let {fname,phone,uid} = req.body;
    let obj = {
        profilepic,
        fullname:fname,
        phone:phone,
        profilepic:profilepic.filename
    }
    let updatenow = await users.updateOne({_id:uid},obj);
    if(updatenow)
    {
        let data = await users.find({_id:uid});
        if(data != null)
        {
            res.status(200).json({status:200,message:"Update Success",info:updatenow,userinfo:data});
        }
    }
    else
    {
        res.send({status:500,message:"Anyithing else"});
    }
}

let Request = async (req,res)=>{
    let {type} = req.body;
    if(type == "request")
    {
        let {type,fullname,senderid,reciverid,profilepic} = req.body;
        let insertreq = new request({
            profilepic,type,fullname,senderid,reciverid,acceptname:"null",acceptprofilepic:"null",status:"offline",created:new Date()
        });
        insertreq.save();
        if(insertreq)
        {
            res.status(200).json({status:200,message:"request success",info:insertreq})
        }
    }
    else
    {
        let {type,delid} = req.body;
        let delreq = await request.deleteOne({_id:delid});
        res.status(200).json({status:200,message:"Delete Request",delinfo:delreq});
    }
}

let getrequest = async (req,res)=>{
    let fetchid = req.query.getuid;
    let fetchdata = await request.find({senderid:fetchid});
    res.status(200).json({status:200,message:"All userid request",requestid:fetchdata});
}

let notification = async (req,res)=>{
    let uid = req.query.uid;
    console.log(uid)
    let fetchnotification = await request.find({reciverid:uid});
    if(fetchnotification != null)
    {
        res.status(200).json({status:200,message:"Request Notification",notifications:fetchnotification});
    }
    else
    { 
        res.send({status:300,message:"No Notification"}); 
    }  
}

let notificationupdation = async (req,res)=>{
    let {type} = req.body;
    if(type == "accept")
    {
        let {type,aduid,reciverid,acceptname,acceptprofilepic,acceptid} = req.body;
        let updatenotifi = await request.updateOne({_id:aduid},{$set:{type,acceptname,acceptprofilepic}});
        if(updatenotifi)
        {
            res.status(200).json({status:200,message:"Request Accepted",notificationinfo:updatenotifi});
        }
    }
    else
    {
        let {type,aduid} = req.body;
        let deletenotifi = await request.deleteOne({_id:aduid});
        if(deletenotifi)
        {
            res.status(200).json({status:200,message:"Request Deleted",notificationinfo:deletenotifi});
        }
    }
}

let accepteduserlistshow = async (req,res)=>{
    let uid = req.query.uid;
    let fetchuserlist = await request.find();
    if(fetchuserlist)
    {
        res.status(200).json({status:200,message:"All Accepted Users",data:fetchuserlist});
    }
    
}

let setMessage = (req,res)=>{
    let {outgoingid,incomingid,sendername,profilepic,Umessage,time} = req.body;
    let insertedmessage = new message({
        outgoingid,incomingid,sendername,profilepic,Umessage,time,created:new Date()
    }).save();
    if(insertedmessage)
    {
        res.status(200).json({status:200,message:"Message Inserted",messageinfo:insertedmessage});
    }
    else
    {
        res.send({message:"Anything else"});
    }
}

let getmessage = async (req,res)=>{
    let {outgoingid,incomingid} = req.body;
    let fetchmessge = await message.find({$or:[{outgoingid:outgoingid,incomingid:incomingid},{outgoingid:incomingid,incomingid:outgoingid}]})
    if(fetchmessge)
    {
        res.status(200).json({data:fetchmessge});
    }
    
}

let deletemessage = async (req,res)=>{
    let {type,deleteid} = req.body;
    if(type == "delete")
    {
        let deleted = await message.deleteOne({_id:deleteid});
        if(deleted)
        {
            res.status(200).json({status:200,message:"Delete Message",deleteinfo:deleted,delid:deleteid});
        } 
    }
    else
    {
        //future updated message
    }
}


module.exports = {
    testapi,
    register,
    login,
    allusers,
    update,
    Request,
    getrequest,
    notification,
    notificationupdation,
    accepteduserlistshow,
    setMessage,
    getmessage,
    deletemessage
}