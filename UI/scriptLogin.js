
/**
 * function called by the click of the button 
 */

function login() {

    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;
    
    // Load the busStops and show them in the table
    $.ajax({
        url: "/api/v1/authentication",
        type: "POST",
        data: JSON.stringify({email: email, password: password}),
        contentType: "application/json",
        dataType: "json"
    })
        .done((result) => {
            sessionStorage.setItem("LoggedUserID", result.id);
            sessionStorage.setItem("LoggedUserType", result.type);
            
            if(result.type == "user"){
                window.location.href="/dashboardUser.html";
            }else if(result.type == "admin"){
                window.location.href="/dashboardAdmin.html";
            }
        })
        .fail((jqXHR) => {
                window.alert(jqXHR.responseJSON.message);
        });
}
