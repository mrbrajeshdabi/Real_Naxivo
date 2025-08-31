const { default: chalk } = require("chalk");
const { default: mongoose } = require("mongoose");
const { router } = require("./App/routes/main.route");
const {users} = require("./App/model/reg.model");
let {request} = require("./App/model/request.model");
require("dotenv").config();
const express = require("express"),
app = express(),
cors = require("cors"),
{createServer} = require("http"),
server = createServer(app),
{Server} = require("socket.io"),
io = new Server(server,{
    maxHttpBufferSize:1e8,
    cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use("/api",router);


//io start
io.on("connection", async (socket)=>{

    //offer
    socket.on("offer",({fromname,from,to,offer,type})=>{
        socket.broadcast.emit("offer",{fromname,from,to,offer,type})
    })

    //answer
    socket.on("answer",({fromname,from,to,answer,type})=>{
        socket.broadcast.emit("answer",{fromname,from,to,answer,type});
        //candidate
        socket.on("candidate",(candidate)=>{
            socket.broadcast.emit("candidate",candidate);
        })
    })

    // endcall
    socket.on("end-call",({from,to})=>{
        socket.emit("end-calls",{from,to});
        socket.broadcast.emit("end-calls",{from,to});
    })

    //muted video and audio
    socket.on("muted",({from,to})=>{
        socket.broadcast.emit("muted",{from,to});
    })

    //close video call
    socket.on("close-vcall",({from,to})=>{
        socket.broadcast.emit("closevcall",{from,to});
    })
    // open vcall
    socket.on("open-vcall",({from,to})=>{
        socket.broadcast.emit("openvcall",{from,to});
    })

    //notifiction accepted
    socket.on("notification",(obj)=>{
        socket.broadcast.emit("notification",obj);
    })

    //request send live
    socket.on("sendrequest",({type,fullname,senderid,reciverid,profilepic})=>{
        socket.broadcast.emit("sendrequest",{type,fullname,senderid,reciverid,profilepic});
    })

    //remove reqeust
    socket.on("removerequest",({type,fullname,senderid,reciverid,profilepic})=>{
        socket.broadcast.emit("removerequest",{type,fullname,senderid,reciverid,profilepic});
    })

    //listener chat 
    socket.on("listener",(uid)=>{
        socket.broadcast.emit("listener",uid);
    })
    socket.on("removelistener",(uid)=>{
        socket.broadcast.emit("removelistener",uid);
    })
    //end

    //liveonlineshow
    let onlineid = socket.handshake.auth.tokan;
    socket.broadcast.emit("online",onlineid);

    //offline
    socket.on("disconnect",()=>{
        socket.broadcast.emit("offline",onlineid);
    })

    //live message
    socket.on("livemessage",(obj)=>{
        socket.broadcast.emit("livemessage",obj);
    })
    
    //live image send but not store
    socket.on("liveimagesend",(obj)=>{
        socket.broadcast.emit("liveimagesend",obj);
    })
    
    //live video send but not store
    socket.on("livevideosend",(obj)=>{
        socket.broadcast.emit("livevideosend",obj);
    })
})


mongoose.connect(process.env.DBURL).then(()=>{
    server.listen(process.env.PORT || 3000 ,()=>{
        console.log(chalk.red(`Server Listen On Port ${process.env.PORT}`))
        console.log(chalk.green("Database Connected"));
    })
})