function login() {
    $.post("/", {
        name: $('#name').val(),
        password: $('#password').val(),
        rem: $('#rem').prop('checked')
    }, function(data) {
        if (data != '成功') {
            alert(data);
        } else {
            $(location).attr('href', '/homepage.html');
        }
    })
}

function startup() {
    $.get("/cookies", function(data) {
        if (data != 'null') {
            $('#name').val(data.name);
            if (data.rem == 'true') {
                $('#password').val(data.password);
                $('#rem').prop("checked", true);
            }
        }
    });
}