let userinfo = ()=>{
    return JSON.parse(sessionStorage.getItem("user"));
}

let updateuserprofile = ()=>{
    if(userinfo().profilepic != "null")
    {
        let html =  `<img src="../server/profilepic/`+userinfo().profilepic+`"  class="img-fluid img-thumbnail rounded" id="profilepicmain">
                <span class="mt-2">`+userinfo().fullname+`</span>
                <span class="mt-2">`+userinfo().email+`</span>
                <button class="btn btn-outline-primary w-100 mt-3 updateinfobtn" id="laptop" type="button" data-bs-toggle="modal" data-bs-target="#myModal">Update Profile</button>
                <button class="btn btn-outline-primary w-100 mt-3 updateinfobtn" id="mobile" type="button" data-bs-toggle="modal" data-bs-target="#myModal"><i class='fa fa-pencil-square'></i></button>`;
        $(".profilebox").html(html);    
    }
    else
    {
    let html =  `<img src="assets/images/man-user-circle-black-icon.png" class="img-fluid img-thumbnail rounded" id="profilepicmain">
                <span class="mt-2">`+userinfo().fullname+`</span>
                <span class="mt-2">`+userinfo().email+`</span>
                <button class="btn btn-outline-primary w-100 mt-3 updateinfobtn" type="button" data-bs-toggle="modal" data-bs-target="#myModal">Update Profile</button>`;
    $(".profilebox").html(html);
    }
}
updateuserprofile();