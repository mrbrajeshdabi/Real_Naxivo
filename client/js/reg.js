$(document).ready(function(){
    $(".signup_frm").submit(function(e){
        e.preventDefault();
        let fname = $("#fname").val();
        let lname = $("#lname").val();
        let email = $("#email").val();
        let phone = $("#phone").val();
        let password = $("#password").val();
        //check all input not empty
        if(fname != "" && lname != "" && email != "" && phone != "" && password != "")
        {
            let obj = new Object();
            obj.fullname = fname+" "+lname;
            obj.email= email;
            obj.phone = phone;
            obj.password = btoa(password);
            let userdata = obj;
            $.ajax({
                type:"post",
                url:"http://localhost:8000/api/register",
                header:{
                    "Content-Type":"application/json"
                },
                data:userdata,
                cache:false,
                beforeSend:function(req){$("#signinbtn").html("<i class='fa fa-spinner fa-spin'></i>");},
                success:function(res)
                {
                    if(res.status == 200)
                    {
                        $("#signinbtn").removeClass("btn btn-outline-primary");
                        $("#signinbtn").addClass("btn btn-success");
                        $("#signinbtn").html("<i class='fa fa-check-circle'></i>");
                        setTimeout(() => {
                        $("#signinbtn").removeClass("btn btn-success");
                        $("#signinbtn").addClass("btn btn-outline-primary");
                        $("#signinbtn").html("SignIn");
                        $(".signupbox").addClass("d-none");
                        $(".loginbox").removeClass("d-none");
                        $(".signup_frm")[0].reset();
                        }, 1000);
                    }
                }

            })
        }
        else
        {
            $("#errormsg").addClass("alert alert-warning");
            $("#errormsg").html("Please Filled All Input Value");
            setTimeout(() => {
                $("#errormsg").removeClass("alert alert-warning");
                $("#errormsg").html("");
            }, 1000);
        }
    })
})