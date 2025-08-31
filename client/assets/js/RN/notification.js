$(document).ready(function(){
    let session = JSON.parse(sessionStorage.getItem("user"));
    $.ajax({
        type:"get",
        url:"http://localhost:8000/api/notification?uid="+session._id,
        header:{
            "Content-Type":"application/json"
        },
        beforeSend:function(req){},
        success:function(res)
        {
            res.notifications.forEach(index => {
                setTimeout(() => {
                $("#request"+index.senderid).removeClass("btn btn-outline-warning");      
                $("#request"+index.senderid).addClass("btn btn-outline-primary disabled");
                $("#request"+index.senderid).html("<i class='fa fa-check-circle'></i>");
                $("#delrequest"+index.senderid).removeClass("btn btn-outline-light disabled");
                $("#delrequest"+index.senderid).addClass("btn btn-outline-danger");
                $("#delrequest"+index.senderid).html("<i class='fa fa-user-times'></i>");
                }, 100);
                if(index.type == "request")
                {
                let html = `<li class="list-group-item bg-dark text-light border-top-0" id="acceptedremove`+index.senderid+`">
                                <div class="d-flex">
                                    <img src="../server/profilepic/`+index.profilepic+`" alt="" id="imglogo" class="img-fluid img-thumbnail rounded">
                                    <button class="btn btn-outline-danger acceptanddelbtn"  type="delete" aduid=`+index._id+` userid=`+index.senderid+`><i class="fa fa-times"></i></button>
                                    <button class="btn btn-outline-success acceptanddelbtn" type="accept" aduid=`+index._id+` userid=`+index.senderid+`><i class="fa fa-check-circle"></i></button>
                                    <span class="usernamenoti" id="cusernameforupdate`+index.senderid+`">`+index.fullname+`</span>
                                </div>
                            </li>`
                $("#installnotification").append(html);
                }
                else
                {
                let html = `<li class="list-group-item bg-dark text-light">
                                <div class="d-flex">
                                    <img src="../server/profilepic/`+index.profilepic+`" alt="" id="imglogo" class="img-fluid img-thumbnail rounded">
                                    <span class="statusnoti text-success">Request Accepted</span>
                                    <span class="usernamenoti text-info">`+index.fullname+`</span>
                                </div>
                            </li>`
                $("#installnotification").append(html);
                }
            });
            //accept and del request
            $(".acceptanddelbtn").each(function(){
                $(this).click(function(){
                    let type = $(this).attr("type");
                    let aduid = $(this).attr("aduid");
                    //socket notfication
                    let reciverid = $(this).attr("userid");
                    let acceptname = session.fullname;
                    let acceptprofilepic = session.profilepic
                    let acceptid = session._id;
                    //
                    let obj = {type,aduid,reciverid,acceptname,acceptprofilepic,acceptid};
                    if(type == "accept")
                    {
                        $.ajax({
                            type:"put",
                            url:"http://localhost:8000/api/notificationupdation",
                            header:{
                                "Content-Type":"application/json"
                            },
                            data:obj,
                            beforeSend:function(req){},
                            success:function(res)
                            {
                                if(res.status == 200)
                                {
                                    socket.emit("notification",obj);
                                    $("#acceptedremove"+reciverid).addClass("d-none");
                                    //confirm("Are You Sure Request Accept");
                                }
                            }
                        })
                    }
                    else
                    {
                        $.ajax({
                            type:"put",
                            url:"http://localhost:8000/api/notificationupdation",
                            header:{
                                "Content-Type":"application/json"
                            },
                            data:{type,aduid},
                            beforeSend:function(req){},
                            success:function(res)
                            {
                                if(res.status == 200)
                                {
                                    $("#acceptedremove"+reciverid).addClass("d-none");
                                    confirm("Are You Sure Delete Request");
                                }
                            }
                        })
                    }
                })
            })
        }
    })
})