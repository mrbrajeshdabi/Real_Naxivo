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
                    let html = `<li class="list-group-item bg-dark text-light chatclicked" uid=`+index.senderid+` username="`+index.fullname+`" pic="`+index.profilepic+`">
                                    <div class="d-flex">
                                        <img src="../../../server/profilepic/`+index.profilepic+`" class="img-fluid img-thumbnail rounded ms-2" id="chatinglogo">
                                        <span class="chatingstatus  text-danger" id="chatingstatus`+index.senderid+`">`+index.status+`</span>
                                        <span class="username text-info">`+index.fullname+`</span>
                                    </div>
                                </li>`
                    $("#insertchatuserlist").append(html);
                    $("#insertchatuser").append(html);
                }
                else if(userinfo()._id == index.senderid)
                {
                    
                    let html = `<li class="list-group-item bg-dark text-light chatclicked" uid=`+index.reciverid+` username="`+index.acceptname+`" pic="`+index.acceptprofilepic+`">
                                    <div class="d-flex">
                                        <img src="../../../server/profilepic/`+index.acceptprofilepic+`" class="img-fluid img-thumbnail rounded ms-2" id="chatinglogo">
                                        <span class="chatingstatus text-danger" id="chatingstatus`+index.reciverid+`">`+index.status+`</span>
                                        <span class="username text-info">`+index.acceptname+`</span>
                                    </div>
                                </li>`
                    $("#insertchatuserlist").append(html);
                    $("#insertchatuser").append(html);
                }
            }
            });
            //chating user clicked
            $(".chatclicked").each(function(){
                $(this).click(function(){
                    let incomingid = $(this).attr("uid");
                    let username = $(this).attr("username");
                    let pic = $(this).attr("pic");
                    $(".chatbox").attr("id","chatbox"+incomingid);
                    $("#imglogo").attr("src","../../../server/profilepic/"+pic);
                    $(".chatusername").html(username);
                    $("#chatboxcontainer").removeClass("d-none");
                    $(".mobilechat").addClass("d-none");
                    $("#incomingid").val(incomingid);

                    $.ajax({
                        type:"post",
                        url:"http://localhost:8000/api/getmessage",
                        header:{
                            "Content-Type":"application/json"
                        },
                        data:{outgoingid:userinfo()._id,incomingid},
                        beforeSend:function(req){$(".chatbox").html("");},
                        success:function(res)
                        {
                            res.data.forEach(index =>{
                                if(userinfo()._id == index.outgoingid) //incomingid == index.incomingid
                                {
                                    let html = `
                                    <div class="tools animate__animated animate__fadeIn d-none" id="del`+index._id+`"><i class="fa fa-trash deletemessage" type="delete" delid=`+index._id+`></i></div>
                                    <div class="outgoingmsg animate__animated animate__fadeIn" delid=`+index._id+` id="delmsg`+index._id+`">
                                                    <div class="d-flex">
                                                        <img src="../../../server/profilepic/`+index.profilepic+`" alt="" id="imglogo" class="img-fluid img-thumbnail rounded">
                                                        <span class="text-dark mt-2 ms-2">`+index.sendername+`</span>
                                                    </div>
                                                    <p>`+index.Umessage+`</p>
                                                    <span>`+index.time+`</span>
                                                </div>`
                                    $(".chatbox").append(html);
                                    let chatbox = document.querySelector(".chatbox");
                                    chatbox.scrollTop = chatbox.scrollHeight;
                                }
                                else
                                {
                                    let html = `<div class="incomingmsg animate__animated animate__fadeIn">
                                                    <div class="d-flex">
                                                        <img src="../../../server/profilepic/`+index.profilepic+`" alt="" id="imglogo" class="img-fluid img-thumbnail rounded">
                                                        <span class="mt-2 ms-2">`+index.sendername+`</span>
                                                    </div>
                                                    <p>`+index.Umessage+`</p>
                                                    <span>`+index.time+`</span>
                                                </div>`
                                    $(".chatbox").append(html);
                                    let chatbox = document.querySelector(".chatbox");
                                    chatbox.scrollTop = chatbox.scrollHeight;
                                }
                            });

                            //show and hide del btn
                             $(".outgoingmsg").each(function(){
                                $(this).click(function(){
                                    let delid = $(this).attr("delid");
                                    if($("#del"+delid).hasClass("d-none"))
                                    {
                                        $("#del"+delid).removeClass("d-none")
                                    }
                                    else
                                    {
                                        $("#del"+delid).addClass("d-none")
                                    }
                                })
                             })
                            //end del show and hide btn

                            //delete message
                             $(".deletemessage").each(function(){
                                $(this).click(function(){
                                    let deleteid = $(this).attr("delid");
                                    let type = $(this).attr("type");
                                    if(type == "delete")
                                    {
                                        $.ajax({
                                            type:"delete",
                                            url:"http://localhost:8000/api/deletemessage",
                                            header:{
                                                "Content-Type":"application/json"
                                            },
                                            data:{type,deleteid},
                                            beforeSend:function(req){},
                                            success:function(res)
                                            {
                                                if(res.status == 200)
                                                {
                                                    new Audio("../ringtoon/message-send-292621.mp3").play();
                                                    $("#delmsg"+res.delid).addClass("d-none");
                                                    $("#del"+res.delid).addClass("d-none");
                                                }
                                            }
                                        })
                                    }
                                    else
                                    {
                                        //future updated message
                                    }
                                })
                             })
                            //end delete message
                        }
                    })
                })
            })
            //end chating user clicked

            //for loop with online and offline
            let i;
            for(i=0; i<sessionStorage.length; i++)
            {
                let key = sessionStorage.key(i);
                if(key != "user")
                {
                    if(key.match("online"))
                    {
                        let onid = sessionStorage.getItem(key);
                        $("#chatingstatus"+onid).removeClass("text-danger");
                        $("#chatingstatus"+onid).addClass("text-success");
                        $("#chatingstatus"+onid).html("Online");
                        $(".chatstatus").html("Online");
                        $(".chatstatus").removeClass("text-danger");
                        $(".chatstatus").addClass("text-success");
                    }
                    else
                    {
                        let onid = sessionStorage.getItem(key);
                        $("#chatingstatus"+onid).removeClass("text-success");
                        $("#chatingstatus"+onid).addClass("text-danger");
                        $("#chatingstatus"+onid).html("Offline");
                        $(".chatstatus").html("Offline");
                        $(".chatstatus").removeClass("text-success");
                        $(".chatstatus").addClass("text-danger");
                    }
                }
            }
        }
    });
});

