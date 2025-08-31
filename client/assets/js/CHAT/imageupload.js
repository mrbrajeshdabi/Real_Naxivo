$(document).ready(function(){
    $("#image").click(function(){
        let incomingid = $("#incomingid").val();
        let outgoingid = userinfo()._id;
        let sendername = userinfo().fullname;
        let profilepic = userinfo().profilepic;
        let file = document.createElement("input");
        file.setAttribute("type","file");
        file.setAttribute("accept","image/*");
        file.click();
        file.onchange=function(){
        let reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload=function(e){
            console.log(e)
            let loaded = e.loaded;
            let total = e.total;
            let per = (loaded/total)*100;
            if(per == 100)
            {
                new Audio("../ringtoon/sendmessage.mp3").play();
                let url = reader.result;
                let html =`<div class="outgoingmsg mb-3">
                        <div class="d-flex">
                            <img src="../../../server/profilepic/`+profilepic+`"  id="imglogo" class="img-fluid img-thumbnail rounded mb-3">
                            <span class="mt-2 ms-2">`+sendername+`</span>
                        </div>
                        <img src="`+url+`" alt="" id="imageupload" class="img-fluid img-thumbnail rounded">
                    </div>`;
                $("#chatbox"+incomingid).append(html);
                let chatbox = document.querySelector(".chatbox");
                chatbox.scrollTop = chatbox.scrollHeight;
                let obj = {outgoingid,incomingid,sendername,profilepic,url};
                socket.emit("liveimagesend",obj);
            }
        }
        }
    })
})



//socket listener
socket.on("liveimagesend",(obj)=>{
    if(userinfo()._id == obj.incomingid)
    {
        let html =`<div class="incomingmsg mb-3">
                    <div class="d-flex">
                        <img src="../../../server/profilepic/`+obj.profilepic+`" alt="" id="imglogo" class="img-fluid img-thumbnail rounded mb-3">
                        <span class="mt-2 ms-2">`+obj.sendername+`</span>
                    </div>
                    <img src="`+obj.url+`" alt="" id="imageupload" class="img-fluid img-thumbnail rounded">
                </div>`;
            $("#chatbox"+obj.outgoingid).append(html);
            let chatbox = document.querySelector(".chatbox");
            chatbox.scrollTop = chatbox.scrollHeight;
            new Audio("../ringtoon/recivermessage.mp3").play();
    }
})