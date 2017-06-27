var gloabal_type;
var gloabal_page;
var if_search;

function buildbody(data) {
    if (data == '服务器无响应') {
        alert('服务器无响应');
        retrun;
    }
    var i = 0;
    var dat = eval(data);
    var result = '';
    if ($(window).width() > 600) {
        for (i = 0; i < dat.length; i++) {
            if (i % 2 == 0) {
                result += '<div class="row">';
            }
            var tmp = '<div class="col-md-6">' +
                '<a href="' + dat[i].href + '">' +
                '<div class="mynews">' +
                '<div class="myimg">' +
                '<img src="' + dat[i].imgsrc + '" alt="' + dat[i].title + '" class="img-responsive">' +
                '</div>' +
                '<div class="myentry">' +
                '<h4>' + dat[i].title + '</h4>' +
                '<p>' + dat[i].digest + '</p>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '</div>';
            result += tmp;
            if (i % 2 == 1) {
                result += '</div>';
            }
        }
        if (i % 2 == 0) {
            result += '</div>';
        }
    } else {
        for (i = 0; i < dat.length; i++) {
            var tmp = '<div class="phone">' +
                '<a href="' + dat[i].href + '">' +
                '<div class="myimgphone">' +
                '<img src="' + dat[i].imgsrc + '" alt="' + dat[i].title + '" class="img-responsivephone">' +
                '</div>' +
                '<div class="myentryphone">' +
                '<h4>' + dat[i].title + '</h4>' +
                '<p>' + dat[i].digest + '</p>' +
                '</div>' +
                '</a>' +
                '</div>';
            result += tmp;
        }
    }
    $('#mybody').html(result);
}

function getbody(typename, pagenumber) {
    gloabal_type = typename;
    gloabal_page = 1;
    $.post("/content", {
        type: typename,
        page: pagenumber
    }, function(data) {
        buildbody(data);
    });
}

function homestartup() {
    if_search = 0;
    gloabal_type = 'home';
    $.get("/cookies", function(data) {
        if (data != 'null') {
            $('#user').text(data.name);
        }
    });
    $.get("/homepagecontent", function(data) {
        buildbody(data);
    });
}

function startup(typename) {
    if_search = 0;
    $.get("/cookies", function(data) {
        if (data != 'null') {
            $('#user').text(data.name);
        }
    });
    getbody(typename, 1);
}

function loadmore() {
    if (if_search == 0) {
        gloabal_page++;
        getbody(gloabal_type, gloabal_page);
    }
}

function count() {
    $.post("/count", {
        type: gloabal_type
    }, function() {});
}

function myGetKey(e) {
    var evt = window.event ? window.event : e;
    var keycode = evt.keyCode ? evt.keyCode : evt.which;

    if (keycode == 13) {
        if_search = 1;
        $.post("/search", {
            type: gloabal_type,
            substr: $('#search').val()
        }, function(data) {
            buildbody(data);
        });
    }
}