$(document).ready(function(){
    $("#uid").val(userinfo()._id);
    $("#phone").val(userinfo().phone);
    $("#email").val(userinfo().email);
    $("#fname").val(userinfo().fullname);
    $(".update_frm").submit(function(e){
        e.preventDefault();
    if($("#phone").val() != "" && $("#fname").val() != "" && $("#profilepic").val() != "")
    {
        $.ajax({
            type:"post",
            url:"http://localhost:8000/api/update",
            data:new FormData(this),
            processData:false,
            contentType:false,
            cache:false,
            beforeSend:function(req){},
            success:function(res)
            {
                if(res.status == 200)
                {
                    sessionStorage.setItem("user",JSON.stringify(res.userinfo[0]));
                    $("#updatein").removeClass("btn btn-outline-primary");
                    $("#updatein").addClass("btn btn-success");
                    $("#updatein").html("<i class='fa fa-check-circle'></i>");
                    setTimeout(() => {
                        history.go();
                    }, 1000);
                }
            }
        })
    }
    else
    {
        alert("Please Filled Value..");
    }
    })
})