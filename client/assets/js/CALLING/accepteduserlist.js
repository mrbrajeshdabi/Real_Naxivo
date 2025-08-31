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
                                    <img src="../server/profilepic/`+index.profilepic+`" class="img-fluid img-thumbnail rounded ms-2" id="chatinglogo">
                                    <button class="btn btn-outline-primary calling" type="audio"   id="incomingcallaudio`+index.senderid+`" callingid=`+index.senderid+` callingname="`+index.fullname+`" data-bs-toggle="modal" data-bs-target="#myvideos"><i class="fa fa-phone"></i></button>
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
                                    <img src="../server/profilepic/`+index.acceptprofilepic+`" class="img-fluid img-thumbnail rounded ms-2" id="chatinglogo">
                                    <button class="btn btn-outline-primary calling" type="audio"  id="incomingcallaudio`+index.reciverid+`" callingid=`+index.reciverid+` callingname="`+index.acceptname+`" data-bs-toggle="modal" data-bs-target="#myvideos"><i class="fa fa-phone"></i></button>
                                    <button class="btn btn-outline-primary calling" type="video"  id="incomingcallvideo`+index.reciverid+`" callingid=`+index.reciverid+` callingname="`+index.acceptname+`" data-bs-toggle="modal" data-bs-target="#myvideos"><i class="fa fa-video-camera"></i></button>
                                    <button class="btn btn-outline-danger incomecall d-none"   type="button" id="incomingendcall`+index.reciverid+`"><i class="fa fa-phone"></i></button>
                                    <button class="btn btn-outline-success incomecall d-none"  type="button" id="incominganswercall`+index.reciverid+`"><i class="fa fa-video-camera"></i></button>
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



async function calling(type,callingname,callingid)
{
    if(type == "video")
    {
        $(".voicecall").addClass("d-none");
        $(".videotool").removeClass("d-none");
        document.querySelector("#caller").setAttribute("src","assets/ringtoon/caller.mp3");
        document.querySelector("#caller").play();
        document.querySelector("#caller").loop = true;
        let stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        document.querySelector("#outgoingvideo").srcObject = stream;
        localstreaam = stream;
        startcall(callingname,callingid,type);
    }
    else
    {
        $("#hiddenvideobox").removeClass("d-flex");
        $("#hiddenvideobox").addClass("d-none");
        document.querySelector("#caller").setAttribute("src","assets/ringtoon/caller.mp3");
        document.querySelector("#caller").play();
        document.querySelector("#caller").loop = true;
        document.querySelector("#callingrnameaudio").innerHTML = callingname;
        let stream = await navigator.mediaDevices.getUserMedia({video:false,audio:true});
        document.querySelector("#outgoingvideo").srcObject = stream;
        localstreaam = stream;
        startcall(callingname,callingid,type);
    }
}

//startcall
async function startcall(name,to,type) {
    let pc = await PC.getInstance();
    let from = userinfo()._id;
    let fromname = userinfo().fullname;
    let offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer",{fromname,from,to,offer:pc.localDescription,type});
    $("#callingnames").html(name);
    // $("#rejectcall").removeClass("d-none");
    $("#rejectcall").attr("from",from);
    $("#rejectcall").attr("to",to);
    $("#rejectvideocall").attr("from",from);
    $("#rejectvideocall").attr("to",to);
    // $("#muteandunmute").removeClass("d-none");
    $("#muteandunmutevideo").attr("from",from);
    $("#muteandunmutevideo").attr("to",to);
    $("#muteandunmuteaudio").attr("from",from);
    $("#muteandunmuteaudio").attr("to",to);
    // $("#videoonoff").removeClass("d-none");
    $("#videoonoff").attr("from",from);
    $("#videoonoff").attr("to",to);
}


//endcall
$("#rejectcall").click(function(){
    let from = $(this).attr("from");
    let to =  $(this).attr("to");
    socket.emit("end-call",{from,to});
})
$("#rejectvideocall").click(function(){
    let from = $(this).attr("from");
    let to =  $(this).attr("to");
    socket.emit("end-call",{from,to});
});


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

