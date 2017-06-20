function startup() {
    $.get("/cookies", function(data) {
        if (data != 'null') {
            $('#user').text(data.name);
        }
    });
}