$(document).ready(function(){
    $(".login_frm").submit(function(e){
        e.preventDefault();
        let email = $("#lemail").val();
        let password = btoa($("#lpassword").val());
        let obj = {email,password};
        $.ajax({
            type:"post",
            url:"http://localhost:8000/api/logins",
            header:{
                "Content-Type":"application/json"
            },
            data:obj,
            beforeSend:function(req){$("#logInbtn").html("<i class='fa fa-spinner fa-spin'></i>")},
            success:function(res)
            {
                $("#logInbtn").html("Login");
                if(res.status == 200)
                {
                    sessionStorage.setItem("user",JSON.stringify(res.userinfo));
                    window.location.href="profile.html";
                }
                else
                {
                    $("#errormsg").addClass("alert alert-warning");
                    $("#errormsg").html(res.message);
                    setTimeout(() => {
                        $("#errormsg").removeClass("alert alert-warning");
                        $("#errormsg").html("");
                    }, 1000);
                }
            }
        })
    })
})