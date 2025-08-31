$(document).ready(function(){
    $(".chat_frm").submit(function(e){
        e.preventDefault();
        let incomingid = $("#incomingid").val();
        let outgoingid = userinfo()._id;
        let sendername = userinfo().fullname;
        let profilepic = userinfo().profilepic;
        let message = $("#message").val();
        let time = new Date().getHours()+":"+new Date().getMinutes();
        let obj = {outgoingid,incomingid,sendername,profilepic,Umessage:message,time};
        if(!message)
        {
            $("#message").val("😈");
            setTimeout(() => {
                $("#message").val("");
            },500);
        }
        else
        {
            $.ajax({
                type:"post",
                url:"http://localhost:8000/api/message",
                header:{
                    "Content-Type":"application/json"
                },
                data:obj,
                beforeSend:function(req){},
                success:function(res)
                {
                    if(res.status == 200)
                    {
                        new Audio("../ringtoon/sendmessage.mp3").play();
                        $("#message").val("");
                        let html = `<div class="outgoingmsg">
                                        <div class="d-flex">
                                            <img src="../../../server/profilepic/`+profilepic+`" alt="" id="imglogo" class="img-fluid img-thumbnail rounded">
                                            <span class="text-dark mt-2 ms-2">`+sendername+`</span>
                                        </div>
                                        <p>`+message+`</p>
                                        <span>`+time+`</span>
                                    </div>`
                        // $("#chatbox"+incomingid).removeClass("d-none");
                        $("#chatbox"+incomingid).append(html);
                        let chatbox = document.querySelector(".chatbox");
                        chatbox.scrollTop = chatbox.scrollHeight;
                        socket.emit("livemessage",obj);
                    }
                }
            })
        }
    })

//backbutton
$("#backbtn").click(function(){
    $("#chatboxcontainer").addClass("d-none");
    $(".mobilechat").removeClass("d-none");
})
//chatback
$("#back").click(function(){
    history.back();
})
$("#backmobile").click(function(){
    history.back();
})
//.listenerlogo
$("#message").on("input",function(){
    let incomingid = $("#incomingid").val();
    let length = $("#message").val().length;
    if(length >= 1)
    {
        socket.emit("listener",incomingid);
    }
    else
    {
        socket.emit("removelistener",incomingid);
    }
})
})


// socekt listener
socket.on("livemessage",(obj)=>{
    if(userinfo()._id == obj.incomingid)
    {
        $(".listenerlogo").addClass("d-none");
        new Audio("../ringtoon/recivermessage.mp3").play();
        let html = `<div class="incomingmsg">
                            <div class="d-flex">
                                <img src="../../../server/profilepic/`+obj.profilepic+`" alt="" id="imglogo" class="img-fluid img-thumbnail rounded">
                                <span class="text-dark mt-2 ms-2">`+obj.sendername+`</span>
                            </div>
                            <p>`+obj.Umessage+`</p>
                            <span>`+obj.time+`</span>
                        </div>`
            $("#chatbox"+obj.outgoingid).append(html);
            let chatbox = document.querySelector(".chatbox");
            chatbox.scrollTop = chatbox.scrollHeight;
    }
}) 

socket.on("online",(online)=>{
    sessionStorage.removeItem("offline"+online);
    sessionStorage.setItem("online"+online,online);
    $("#chatingstatus"+online).removeClass("text-danger");
    $("#chatingstatus"+online).addClass("text-success");
    $("#chatingstatus"+online).html("Online");
    $(".chatstatus").html("Online");
    $(".chatstatus").removeClass("text-danger");
    $(".chatstatus").addClass("text-success");
})
socket.on("offline",(offline)=>{
    sessionStorage.removeItem("online"+offline);
    sessionStorage.setItem("offline"+offline,offline);
    $("#chatingstatus"+offline).removeClass("text-success");
    $("#chatingstatus"+offline).addClass("text-danger");
    $("#chatingstatus"+offline).html("Offline");
    $(".chatstatus").html("Offline");
    $(".chatstatus").removeClass("text-success");
    $(".chatstatus").addClass("text-danger");
});
socket.on("listener",(uid)=>{
    if(userinfo()._id == uid)
    {
        //$("#chatbox")
        $(".listenerlogo").removeClass("d-none");
    }
})
socket.on("removelistener",(uid)=>{
    if(userinfo()._id == uid)
    {
        $(".listenerlogo").addClass("d-none");
    }
})