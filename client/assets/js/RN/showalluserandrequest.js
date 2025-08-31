$(document).ready(function(){
    $.ajax({
        type:"get",
        url:"http://localhost:8000/api/users",
        header:{
            "Content-Type":"application/json"
        },
        beforeSend:function(req){console.log("Please Wait..")},
        success:function(res)
        {
            res.users.forEach(index =>{
                if(userinfo()._id != index._id)
                {
                    if(index.profilepic == "null")
                    {
                        let html =  `<li class="list-group-item bg-dark text-light" id="outborder">
                                        <div class="d-flex">
                                            <img src="assets/images/man-user-circle-black-icon.png" alt="" id="imglogo" class="img-fluid img-thumbnail rounded">
                                            <button class="btn btn-outline-warning requestbtn" id="request`+index._id+`" type="request" incomingid=`+index._id+`><i class="fa fa-user-plus"></i></button>
                                            <button class="btn btn-outline-light disabled requestbtn" id="delrequest`+index._id+`" type="delrequest" incomingid=`+index._id+`></button>
                                            <span class="username">`+index.fullname+`</span>
                                        </div>
                                    </li>`;
                        $("#storeusers").append(html);
                    }
                    else
                    {
                        let html =  `<li class="list-group-item bg-dark text-light" id="outborder">
                                        <div class="d-flex">
                                            <img src="../server/profilepic/`+index.profilepic+`" alt="" id="imglogo" class="img-fluid img-thumbnail rounded">
                                            <button class="btn btn-outline-warning requestbtn" id="request`+index._id+`" type="request" incomingid=`+index._id+`><i class="fa fa-user-plus"></i></button>
                                            <button class="btn btn-outline-light disabled requestbtn" id="delrequest`+index._id+`" type="delrequest" incomingid=`+index._id+`></button>    
                                            <span class="username">`+index.fullname+`</span>
                                        </div>
                                    </li>`;
                        $("#storeusers").append(html);
                    }
                }
            })
            // end foreach
            //send request
            $(".requestbtn").each(function(){
                $(this).click(async function(){
                    let type = $(this).attr("type");
                    let reciverid = $(this).attr("incomingid");
                    let senderid = userinfo()._id;
                    let profilepic = userinfo().profilepic;
                    let fullname = userinfo().fullname;
                    let delid = $(this).attr("delid");
                    if(userinfo().profilepic == "null")
                    {
                        alert("Please Update Profile")
                    }
                    else
                    {
                        if(type == "request")
                        {
                            new Audio("assets/ringtoon/happy-pop-3-185288.mp3").play();
                            await $.ajax({
                                type:"post",
                                url:"http://localhost:8000/api/request",
                                header:{
                                    "Content-Type":"application/json"
                                },
                                data:{
                                    type,fullname,senderid,reciverid,profilepic
                                },
                                beforeSend:function(req){},
                                success:function(res)
                                {
                                    if(res.status == 200)
                                    {
                                        $("#request"+reciverid).removeClass("btn btn-outline-warning");
                                        $("#request"+reciverid).addClass("btn btn-outline-primary disabled");
                                        $("#request"+reciverid).html("<i class='fa fa-check-circle'></i>");
                                        $("#delrequest"+reciverid).attr("delid",res._id);
                                        $("#delrequest"+reciverid).attr("type","delete");
                                        $("#delrequest"+reciverid).removeClass("btn btn-outline-light disabled");
                                        $("#delrequest"+reciverid).addClass("btn btn-outline-danger");
                                        $("#delrequest"+reciverid).html("<i class='fa fa-user-times'></i>");
                                        socket.emit("sendrequest",{type,fullname,senderid,reciverid,profilepic});
                                    }
                                }
                            })
                        }
                        else
                        {
                            new Audio("assets/ringtoon/happy-pop-3-185288.mp3").play();
                           await $.ajax({
                                type:"post",
                                url:"http://localhost:8000/api/request",
                                header:{
                                    "Content-Type":"application/json"
                                },
                                data:{
                                    type,delid
                                },
                                beforeSend:function(req){},
                                success:function(res)
                                {
                                    if(res.status == 200)
                                    {
                                        $("#request"+reciverid).removeClass("btn btn-outline-primary disabled");
                                        $("#request"+reciverid).addClass("btn btn-outline-warning");
                                        $("#request"+reciverid).html("<i class='fa fa-user-plus'></i>");
                                        $("#delrequest"+reciverid).removeClass("btn btn-outline-danger");
                                        $("#delrequest"+reciverid).addClass("btn btn-outline-light disabled");
                                        socket.emit("removerequest",{type,fullname,senderid,reciverid,profilepic});
                                     }
                                }
                            })
                        }
                    }
                })
            })
        }
    })
    // //request send fetch data
    $.ajax({
        type:"get",
        url:"http://localhost:8000/api/get-request?getuid="+userinfo()._id,
        header:{
            "Content-Type":"application/json"
        },
        beforeSend:function(req){},
        success: async function(res)
        {
            await res.requestid.forEach(index =>{
                setTimeout(() => {
                $("#request"+index.reciverid).removeClass("btn btn-outline-warning");
                $("#request"+index.reciverid).addClass("btn btn-outline-primary disabled");
                $("#request"+index.reciverid).html("<i class='fa fa-check-circle'></i>");
                $("#delrequest"+index.reciverid).removeClass("btn btn-outline-light disabled");
                $("#delrequest"+index.reciverid).addClass("btn btn-outline-danger");
                $("#delrequest"+index.reciverid).html("<i class='fa fa-user-times'></i>");
                $("#delrequest"+index.reciverid).attr("delid",index._id);
                },100);
            });
        }
    })
})