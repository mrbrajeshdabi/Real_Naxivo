$(document).ready(function(){
    $(".createaccount").click(function(){
        $(".loginbox").addClass("d-none");
        $(".signupbox").removeClass("d-none");
    });
    $(".loginaccount").click(function(){
        $(".signupbox").addClass("d-none");
        $(".loginbox").removeClass("d-none");
    });
    //check all input valid
    $("#email").on("change",function(){
        let email = $(this).val();
        if(email == "")
        {
            alert("please Filled Value")         
        }
    });
});