$(document).ready(function(){
    $(".menu").each(function(){
        $(this).click(function(){
            let page = $(this).attr("pageid");
            $.ajax({
                type:"post",
                url:"assets/pages/"+page+".html",
                beforeSend:function(req){$("#storepage").html("")},
                success:function(res)
                {
                    $("#storepage").html(res)
                }
            })
        })
    })
})