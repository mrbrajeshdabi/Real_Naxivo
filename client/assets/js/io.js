let socket  = io("http://localhost:8000",{
    auth:{
        tokan:userinfo()._id
    }
});

socket.on("connect",()=>{
    let logo = `
░███    ░██                       ░██                      
░████   ░██                                                
░██░██  ░██  ░██████   ░██    ░██ ░██░██    ░██  ░███████  
░██ ░██ ░██       ░██   ░██  ░██  ░██░██    ░██ ░██    ░██ 
░██  ░██░██  ░███████    ░█████   ░██ ░██  ░██  ░██    ░██ 
░██   ░████ ░██   ░██   ░██  ░██  ░██  ░██░██   ░██    ░██ 
░██    ░███  ░█████░██ ░██    ░██ ░██   ░███     ░███████  
    Now Connected`;
    console.log(logo)
})
// history.pushState(null,null,"Naxivo");


Notification.requestPermission().then(permission =>{
    if(permission == "granted")
    {
        // let notification = new Notification("Welcome",{
        //     body:"Hii",
        //     icon:"assets/images/logo.jpeg",
            
        // });
        // notification.onclick = ()=>{
        //     window.location.href = "assets/pages/chating.html";
        // }
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

//reciver offer
socket.on("offer", async ({fromname,from,to,offer,type})=>{
    if(userinfo()._id == to)
    {
        document.querySelector("#caller").setAttribute("src","assets/ringtoon/reciver.mp3");
        document.querySelector("#caller").play();
        document.querySelector("#caller").loop = true;
        if(type == "video")
        {
            $(".voicecall").addClass("d-none");
            $(".videotool").removeClass("d-none");
            $("#rejectvideocall").attr("from",from);
            $("#rejectvideocall").attr("to",to);
            $("#muteandunmutevideo").attr("from",from);
            $("#muteandunmutevideo").attr("to",to);
            let stream =  await navigator.mediaDevices.getUserMedia({video:true,audio:true});
            document.querySelector("#outgoingvideo").srcObject = stream;
            localstreaam = stream;
            let html = `<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-dark text-light">
                <img src="assets/images/man-user-circle-black-icon.png" class="img-fluid img-thumbnail rounded ms-2" id="chatinglogo">
                <small class="me-auto ms-4">`+fromname+`</small>
                <strong class="me-auto">Incoming Call</strong>
                <button type="button" class="btn-close bg-warning" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body bg-dark text-light">
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-outline-danger animate__animated animate__pulse animate__infinite" id="cancelvideocall"><i class="fa fa-times" id="rejectcallicon"></i></button>
                    <button class="btn btn-outline-success ms-5 animate__animated animate__pulse animate__infinite" id="answervideocall" data-bs-toggle="modal" data-bs-target="#myvideos"><i class="fa fa-video-camera"></i></button>
                </div>
            </div>
            </div>`;
            $(".callnow").append(html);
            //cancelvideo call
            $("#cancelvideocall").attr("from",from);
            $("#cancelvideocall").attr("to",to);
            //disconnect call
            $("#cancelvideocall").click(function(){
                let from = $(this).attr("from");
                let to =  $(this).attr("to");
                socket.emit("end-call",{from,to});
            })
            // answer this call
            $("#answervideocall").click(async function(){
                document.querySelector("#caller").pause();
                let pc = await PC.getInstance();
                await pc.setRemoteDescription(offer);
                let answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("answer",{fromname,from,to,answer:pc.localDescription});
                $("#rejectcall").attr("from",from);
                $("#rejectcall").attr("to",to);
                $("#muteandunmute").attr("from",from);
                $("#muteandunmute").attr("to",to);
                $("#videoonoff").attr("from",from);
                $("#videoonoff").attr("to",to);
            });

        }
        else
        {
            let stream =  await navigator.mediaDevices.getUserMedia({video:false,audio:true});
            document.querySelector("#outgoingvideo").srcObject = stream;
            localstreaam = stream;
            $("#muteandunmuteaudio").attr("from",from);
            $("#muteandunmuteaudio").attr("to",to);
            let html = `<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-dark text-light">
                <img src="assets/images/man-user-circle-black-icon.png" class="img-fluid img-thumbnail rounded ms-2" id="chatinglogo">
                <small class="me-auto ms-4">`+fromname+`</small>
                <strong class="me-auto">Incoming Call</strong>
                <button type="button" class="btn-close bg-warning" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body bg-dark text-light">
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-outline-danger animate__animated animate__pulse animate__infinite" id="cancelaudiocall"><i class="fa fa-times" id="rejectcallicon"></i></button>
                    <button class="btn btn-outline-success ms-5 animate__animated animate__pulse animate__infinite" id="answeraudiocall" data-bs-toggle="modal" data-bs-target="#myvideos"><i class="fa fa-phone"></i></button>
                </div>
            </div>
            </div>`;
            $(".callnow").append(html);
            // //calling time start
            let time = document.querySelector(".stiming");
            let i = 1;
            setInterval(() => {
                time.innerHTML = i++;
            }, 1000);
            // //calling end
            //add id call decline
            $("#cancelaudiocall").attr("from",from);
            $("#cancelaudiocall").attr("to",to);
            //disconnect call
            $("#cancelaudiocall").click(function(){
                let from = $(this).attr("from");
                let to =  $(this).attr("to");
                console.log(from,to);
                socket.emit("end-call",{from,to});
            })
            //answer call
            $("#answeraudiocall").click(async function(){
                $("#hiddenvideobox").removeClass("d-flex");
                $("#hiddenvideobox").addClass("d-none");
                document.querySelector("#caller").pause();
                document.querySelector("#callingsnameaudio").innerHTML = fromname;
                let pc = await PC.getInstance();
                await pc.setRemoteDescription(offer);
                let answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("answer",{fromname,from,to,answer:pc.localDescription});
                $("#rejectcall").attr("from",from);
                $("#rejectcall").attr("to",to);
                $("#muteandunmute").attr("from",from);
                $("#muteandunmute").attr("to",to);
                $("#videoonoff").attr("from",from);
                $("#videoonoff").attr("to",to);
            })
        }
    }
})

//answer
socket.on("answer",async({fromname,from,to,answer,type})=>{
    if(userinfo()._id == from)
    {
        document.querySelector("#caller").pause();
        let pc = await PC.getInstance();
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        let time = document.querySelector(".rtiming");
        let i = 1;
        setInterval(() => {
           time.innerHTML = i++;
        }, 1000);
        
    }
})
//candidate
socket.on("candidate",async(candidate)=>{
    let pc = await PC.getInstance();
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
})


socket.on("muted",({from,to})=>{
if(userinfo()._id == to)
{
    $("#incomingvideo").prop('muted', true);
}
else if(userinfo()._id == from)
{
    $("#incomingvideo").prop('muted', true);
}


})

//endcall
socket.on("end-calls",({from,to})=>{
    if(userinfo()._id == from || userinfo()._id == to)
    {
        endcall();
        history.go();
    }
})

//close video call
socket.on("closevcall",({from,to})=>{
    if(userinfo()._id == to)
    {
        $("#incomingvideo")[0].play();
        $("#incomingvideo").prop('hidden', true);
        //$("#videoonoff").html(`<i class="fas fa-video"></i>`);
    }
    if(userinfo()._id == from);
    {
        $("#incomingvideo")[0].play();
        $("#incomingvideo").prop('hidden', true);
    }
})
socket.on("openvcall",({from,to})=>{
    if(userinfo()._id == to)
    {
        $("#incomingvideo")[0].play();
        $("#incomingvideo").prop('hidden', false);
        //$("#videoonoff").html(`<i class="fas fa-video"></i>`);
    }
    if(userinfo()._id == from);
    {
        $("#incomingvideo")[0].play();
        $("#incomingvideo").prop('hidden', false);
    }
})

//open video call
async function endcall() {
    let pc = await PC.getInstance();
    if(pc)
    {
        pc.close();
    } 
}



//notification accepted
socket.on("notification",({type,aduid,reciverid,acceptname,acceptprofilepic,acceptid})=>{
    console.log(userinfo()._id == reciverid);
    if(userinfo()._id == reciverid)
    {
        Notification.requestPermission().then(()=>{
             new Notification('Naxivo', {
             body: 'Request Accepted -'+acceptname,
             icon: '../server/profilepic/'+acceptprofilepic
         });
        })
    }
})
//sendrequest notfication
socket.on("sendrequest",({type,fullname,senderid,reciverid,profilepic})=>{
    if(userinfo()._id == reciverid)
    {
        Notification.requestPermission().then(()=>{
             new Notification('Naxivo', {
             body: 'New Request -'+fullname,
             icon: '../server/profilepic/'+profilepic
         });
        })

    }
})
//removerequst notifiction
socket.on("removerequest",({type,fullname,senderid,reciverid,profilepic})=>{
    if(userinfo()._id == reciverid)
    {
        Notification.requestPermission().then(()=>{
             new Notification('Naxivo', {
             body: 'Remove Request -'+fullname,
             icon: '../server/profilepic/'+profilepic
         });
        })

    }
})
