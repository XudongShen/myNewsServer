function signup() {
    var reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    if (!reg.test($('#email').val())) {
        alert('请输入正确的邮箱');
        return;
    }
    if ($('#password').val().length < 6) {
        alert('密码长度不得小于六位');
        return;
    }
    if ($('#password').val() != $('#password2').val()) {
        alert('两次输入密码不同');
        return;
    }
    $.post("/signup.html", {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val()
    }, function(data) {
        if (data != '成功') {
            alert(data);
        } else {
            $(location).attr('href', '/homepage.html');
        }
    })
}