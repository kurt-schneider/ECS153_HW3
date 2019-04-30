function removeClient(id){
    if(id){
        let name = $("#" + id + "ClientName")[0].innerText;
        $.post("/remove_client",
            {'id': id},
            function(resp){
                if(resp.error){
                    return showNotification(resp.error);
                }
                else {
                    $("#client" + id).remove();
                    return showNotification("Successfully removed " + name);
                }
            })
            .fail(function(err){
                showNotification(err.responseText);
            });
    }
}

function addBug(){
    var des = $("#bug_entry").val();
    if(des) {
        var aTags = $("td");
        var duplicate = false;
        if(!duplicate){
            $.post("/add_bug",
                {'description': des},
                function(resp){
                    if(resp.error){
                        showNotification(resp.error);
                    }
                    else {
                        showNotification("Successfully added bug report!");
                    }
                })
                .fail(function(err){
                    showNotification(err.responseText);
                });
        }
    }
}
