$(document).ready(function(){
    $.ajax({
        type:"post",
        url:"http://localhost:8000/api/accepteduserlist?uid="+userinfo()._id,
        header:{
            "Content-Type":"application/json"
        },
        beforeSend:function(req){},
        success:function(res)
        {
         res.data.forEach(index =>{
            if(index.type == "accept")
            {
                if(userinfo()._id == index.reciverid)
                {
                    
                    let html = `<li class="list-group-item bg-dark text-light">
                                    <div class="d-flex">
                                    <img src="../../server/profilepic/`+index.profilepic+`" class="img-fluid img-thumbnail rounded ms-2" id="chatinglogo">
                                    <button class="btn btn-outline-primary calling" type="audio"   id="incomingcallaudio`+index.senderid+`" callingid=`+index.senderid+` callingname="`+index.fullname+`"><i class="fa fa-phone"></i></button>
                                    <button class="btn btn-outline-primary calling" type="video"   id="incomingcallvideo`+index.senderid+`" callingid=`+index.senderid+` callingname="`+index.fullname+`" data-bs-toggle="modal" data-bs-target="#myvideos"><i class="fa fa-video-camera"></i></button>
                                    <button class="btn btn-outline-danger incomecall d-none"   type="button"  id="incomingendcall`+index.senderid+`"><i class="fa fa-phone"></i></button>
                                    <button class="btn btn-outline-success incomecall d-none"  type="button"  id="incominganswercall`+index.senderid+`"><i class="fa fa-video-camera"></i></button>
                                    <span class="username text-light">`+index.fullname+`</span>
                                </div>
                            </li>`;
                    $("#callinguserlist").append(html);
                }
                else if(userinfo()._id == index.senderid)
                {
                    let html = `<li class="list-group-item bg-dark text-light">
                                <div class="d-flex">
                                    <img src="../../server/profilepic/`+index.acceptprofilepic+`" class="img-fluid img-thumbnail rounded ms-2" id="chatinglogo">
                                    <button class="btn btn-outline-primary calling" type="audio"  id="incomingcallaudio`+index.reciverid+`" callingid=`+index.reciverid+` callingname="`+index.acceptname+`"><i class="fa fa-phone"></i></button>
                                    <button class="btn btn-outline-primary calling" type="video"  id="incomingcallvideo`+index.reciverid+`" callingid=`+index.reciverid+` callingname="`+index.acceptname+`"><i class="fa fa-video-camera"></i></button>
                                    <button class="btn btn-outline-danger incomecall d-none"   type="button" id="incomingendcall`+index.reciverid+`"><i class="fa fa-phone"></i></button>
                                    <button class="btn btn-outline-success incomecall d-none"  type="button" id="incominganswercall`+index.reciverid+`" data-bs-toggle="modal" data-bs-target="#myvideos"><i class="fa fa-video-camera"></i></button>
                                    <span class="username text-light">`+index.acceptname+`</span>
                                </div>
                            </li>`;
                    $("#callinguserlist").append(html);
                }
            }
            });

            $(".calling").each(function(){
                $(this).click(function(){
                    let type = $(this).attr("type");
                    let callingname = $(this).attr("callingname");
                    let callingid = $(this).attr("callingid");
                    $("#callingid").val(callingid);
                    $("#callingname").val(callingname);
                    $("#type").val(type);
                    calling(type,callingname,callingid);
                })
            })
        }
    });

let localstreaam;
let PC = (function(){
    let peerconnection;

    let createPeerConnection = ()=>{
        let config = {iceServers:[{urls:"stun:stun4.l.google.com:19302"}]};
        peerconnection = new RTCPeerConnection(config);

        //addtrack
        localstreaam.getTracks().forEach(track =>{
            peerconnection.addTrack(track,localstreaam);
        })
        //ontrack
        peerconnection.ontrack= function(event)
        {
            document.querySelector("#incomingvideo").srcObject = event.streams[0];
        }
        //candidate
        peerconnection.onicecandidate=function(event)
        {
            if(event.candidate)
            {
                socket.emit("candidate",event.candidate);
            }
        }
        return peerconnection;
    }

    return {
        getInstance:()=>{
            if(!peerconnection)
            {
                peerconnection = createPeerConnection();
            }
            return peerconnection;
        }
    }
})();

async function calling(type,callingname,callingid)
{
    if(type == "video")
    {
        document.querySelector("#caller").setAttribute("src","../ringtoon/caller.mp3");
        document.querySelector("#caller").play();
        document.querySelector("#caller").loop = true;
        let stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        document.querySelector("#outgoingvideo").srcObject = stream;
        localstreaam = stream;
        startcall(callingname,callingid);
    }
    else
    {
        console.log("ok let`s audio call started");
    }
}

//startcall
async function startcall(name,to) {
    let pc = await PC.getInstance();
    let from = userinfo()._id;
    let fromname = userinfo().fullname;
    let offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer",{fromname,from,to,offer:pc.localDescription});
    $("#callingnames").html(name);
    $("#disconnectcall").removeClass("d-none");
    $("#disconnectcall").attr("from",from);
    $("#disconnectcall").attr("to",to);
    $("#muteandunmute").removeClass("d-none");
    $("#muteandunmute").attr("from",from);
    $("#muteandunmute").attr("to",to);
    
    $("#videoonoff").removeClass("d-none");
    $("#videoonoff").attr("from",from);
    $("#videoonoff").attr("to",to);
    //console.log(localstreaam.getAudioTracks().onmute = true);
}

//socket listener
//reciver offer
socket.on("offer", async ({fromname,from,to,offer})=>{
    if(userinfo()._id == to)
    {
        document.querySelector("#caller").setAttribute("src","../ringtoon/reciver.mp3");
        document.querySelector("#caller").play();
        document.querySelector("#caller").loop = true;
        let stream =  await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        document.querySelector("#outgoingvideo").srcObject = stream;
        localstreaam = stream;
        $("#callingnames").html(fromname);
        //id="incomingendcall`+in
        // id="incominganswercall
        $("#incomingcallvideo"+from).addClass("d-none");
        $("#incomingcallaudio"+from).addClass("d-none");
        $("#incomingendcall"+from).removeClass("d-none");
        $("#incominganswercall"+from).removeClass("d-none");
        $("#incomingendcall"+from).attr("from",from);
        $("#incomingendcall"+from).attr("to",to);
        $("#incominganswercall"+from).attr("data-bs-toggle","modal");
        $("#incominganswercall"+from).attr("data-bs-target","#myvideos");

        $("#incominganswercall"+from).click(async function(){
            document.querySelector("#caller").pause();
            let pc = await PC.getInstance();
            await pc.setRemoteDescription(offer);
            let answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer",{fromname,from,to,answer:pc.localDescription});
            $("#disconnectcall").removeClass("d-none");
            $("#disconnectcall").attr("from",from);
            $("#disconnectcall").attr("to",to);

            $("#muteandunmute").removeClass("d-none");
            $("#muteandunmute").attr("from",from);
            $("#muteandunmute").attr("to",to);

            $("#videoonoff").removeClass("d-none");
            $("#videoonoff").attr("from",from);
            $("#videoonoff").attr("to",to);
        })

        //end call
        $("#incomingendcall"+from).click(function(){
            let from = $(this).attr("from");
            let to =  $(this).attr("to");
            socket.emit("end-call",{from,to});
        })
    }
})

//jisne call kiya tha usi ke pass answer jayega
//answer
socket.on("answer",async({fromname,from,to,answer})=>{
    if(userinfo()._id == from)
    {
        document.querySelector("#caller").pause();
        let pc = await PC.getInstance();
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
})

//candidate
socket.on("candidate",async(candidate)=>{
    let pc = await PC.getInstance();
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
})


//endcall
$("#disconnectcall").click(function(){
    let from = $(this).attr("from");
    let to =  $(this).attr("to");
    socket.emit("end-call",{from,to});
})

socket.on("end-calls",({from,to})=>{
    if(userinfo()._id == from || userinfo()._id == to)
    {
        endcall();
        history.go();
    }
})

async function endcall() {
    let pc = await PC.getInstance();
    if(pc)
    {
        pc.close();
    } 
}

});

// endcall
    socket.on("end-call",({from,to})=>{
        socket.emit("end-calls",{from,to});
        socket.broadcast.emit("end-calls",{from,to});
    })

