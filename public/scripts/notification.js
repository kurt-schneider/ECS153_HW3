function showNotification(message){
    $("#notification-message").html(message);
    if($("#notification").css("top") === "-300px"){
        $("#notification").animate({
            top: "+=300px"
        }, 300, "swing", function() {
            $("#notification").css("top", 0);
        });
    }
}

function closeNotification(){
    if($("#notification").css("top") === "0px"){
            $("#notification").animate({
            top: "-=300px"
        }, 300, "swing", function() {
            $("#notification").css("top", "-300px");
            location.reload();
        });
    }
}




