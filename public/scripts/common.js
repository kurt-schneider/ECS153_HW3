function login(){
    var nam = $("#usernameentry").val();
    var pw = $("#passwordentry").val();
    $.post("/validate",
        {'Username': nam, 'Password': pw},
        function(resp){
            console.log(JSON.stringify(resp));
            if(resp.hasOwnProperty("error")){
                showNotification(JSON.stringify(resp.error));
            }
            else{
                location.reload();
            }
        })
        .fail(function(err){
            showNotification(err.responseText);
        });
}