function startup() {
    $.get("/cookies", function(data) {
        if (data != 'null') {
            $('#user').text(data.name);
        }
    });
}

function confirm() {
    $.post("/center", {
        news: $('#news').prop('checked'),
        shehui: $('#shehui').prop('checked'),
        stock: $('#stock').prop('checked'),
        fashion: $('#fashion').prop('checked'),
        astro: $('#astro').prop('checked'),
        tech: $('#tech').prop('checked'),
        ent: $('#ent').prop('checked'),
        sports: $('#sports').prop('checked'),
        finance: $('#finance').prop('checked'),
        mil: $('#mil').prop('checked'),
        digi: $('#digi').prop('checked'),
        games: $('#games').prop('checked')
    }, function(data) {
        alert(data);
    });
}