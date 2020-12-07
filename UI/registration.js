function registerUser(){
    $("#formAlert").hide();
    $("#formAlertSuccess").hide();

    var newUser = {
        name : $("#userName").val(),
        surname : $("#userSurname").val(),
        email : $("#userEmail").val(),
        password : $("#userPassword").val(),
        confirmPassword : $("#userConfirmPassword").val()
    }

    $.ajax({
        url: "/api/v1/users",
        type : "POST",
        data: JSON.stringify(newUser),
        contentType: "application/json",
        dataType: "json"
    }).done((result) => {
        $("#formAlertSuccess").show();
    }).fail((jqXHR, textStatus, errorThrown) => {
        $("#formErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
        $("#formAlert").show();
    });
}