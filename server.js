var mysql = require('mysql');
var express = require('express');
var http = require('http');
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookiesParser = require('cookie-parser');
var crypto = require('crypto');
var GeTui = require('./getui/GT.push');
var NotificationTemplate = require('./getui/getui/template/NotificationTemplate');
var AppMessage = require('./getui/getui/message/AppMessage');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
app.use(express.static('public'));
app.use(cookiesParser());

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sxd1005',
    database: 'bs'
});

connection.connect();

app.get('/', function(req, res) {
    console.log("login.html requst received");
    if (typeof(req.cookies.user) != 'undefined') {
        console.log('get a cookies')
        console.log('name     : ' + req.cookies.user.name);
        console.log('password : ' + req.cookies.user.password);
        console.log('rem      : ' + req.cookies.user.rem);
    }
    res.sendFile(__dirname + "/html/login.html");
});

app.get('/signup.html', function(req, res) {
    console.log("signup.html requst received");
    res.sendFile(__dirname + "/html/signup.html");
});

app.get('/homepage.html', function(req, res) {
    console.log("homepage.html requst received");
    res.sendFile(__dirname + "/html/homepage.html");
});

app.get('/cookies', function(req, res) {
    if (typeof(req.cookies.user) != 'undefined') {
        res.json(req.cookies.user);
    } else {
        res.end('null');
    }
});

var newsType = [
    'news',
    'shehui',
    'stock',
    'fashion',
    'astro',
    'tech',
    'ent',
    'sports',
    'finance',
    'mil',
    'digi',
    'games'
];

function getRandom(data) {
    var result = [];
    var all = [];
    all.push(data.news);
    all.push(data.shehui);
    all.push(data.stock);
    all.push(data.fashion);
    all.push(data.astro);
    all.push(data.tech);
    all.push(data.ent);
    all.push(data.sports);
    all.push(data.finance);
    all.push(data.mil);
    all.push(data.digi);
    all.push(data.games);
    var i = 0;
    var j = 0;
    var total = 0;
    for (i = 0; i < 12; i++) {
        total += all[i];
    }
    for (i = 0; i < 12; i++) {
        var tmp = Math.floor(Math.random() * total);
        for (j = 0; j < 12; j++) {
            tmp -= all[j];
            if (tmp < 0)
                break;
        }
        result.push(j);
    }
    var re = [];
    for (i = 0; i < 12; i++) {
        var tmp = 0;
        for (j = 0; j < 12; j++) {
            if (result[j] == i)
                tmp++;
        }
        re.push(tmp);
    }
    return re;
}

app.post('/count', urlencodedParser, function(req, res) {
    if (req.body.type == 'home')
        return;
    var findPrefer = "SELECT * FROM record WHERE name = '" + req.cookies.user.name + "'";
    connection.query(findPrefer, function(err, data) {
        if (err) {
            console.log('mysql error7: ' + err.message);
        } else {
            var type = req.body.type;
            var name = data[0].name;
            var updatePrefer = "UPDATE record SET " + type + " = ? WHERE name = '" + name + "'";
            var i = 0;
            for (i = 0; i < 12; i++) {
                if (type == newsType[i])
                    break;
            }
            if (i == 12)
                i = 0;
            var all = [];
            all.push(data[0].news);
            all.push(data[0].shehui);
            all.push(data[0].stock);
            all.push(data[0].fashion);
            all.push(data[0].astro);
            all.push(data[0].tech);
            all.push(data[0].ent);
            all.push(data[0].sports);
            all.push(data[0].finance);
            all.push(data[0].mil);
            all.push(data[0].digi);
            all.push(data[0].games);
            var tmp = all[i];
            tmp++;
            var updatePreferParams = [tmp];
            connection.query(updatePrefer, updatePreferParams, function(err, result) {
                if (err) {
                    console.log('mysql error8: ' + err.message);
                } else {
                    console.log('User ' + name + ' click ' + type + ', change to ' + tmp);
                }
            });
        }
    });
});

app.post('/center', urlencodedParser, function(req, res) {
    var name = req.cookies.user.name;
    var update = [];
    update.push(req.body.news == 'true' ? 10 : 1);
    update.push(req.body.shehui == 'true' ? 10 : 1);
    update.push(req.body.stock == 'true' ? 10 : 1);
    update.push(req.body.fashion == 'true' ? 10 : 1);
    update.push(req.body.astro == 'true' ? 10 : 1);
    update.push(req.body.tech == 'true' ? 10 : 1);
    update.push(req.body.ent == 'true' ? 10 : 1);
    update.push(req.body.sports == 'true' ? 10 : 1);
    update.push(req.body.finance == 'true' ? 10 : 1);
    update.push(req.body.mil == 'true' ? 10 : 1);
    update.push(req.body.digi == 'true' ? 10 : 1);
    update.push(req.body.games == 'true' ? 10 : 1);
    console.log(update);
    var updatePrefer = "UPDATE record SET ";
    for (var i = 0; i < 11; i++) {
        updatePrefer += newsType[i];
        updatePrefer += " = ?,"
    }
    updatePrefer += newsType[i];
    updatePrefer += " = ? WHERE name = '" + name + "'";
    connection.query(updatePrefer, update, function(err, result) {
        if (err) {
            console.log('mysql error9: ' + err.message);
            res.end('设置失败');
        } else {
            res.end('设置成功');
        }
    });

});

app.get('/homepagecontent', function(req, res) {
    var findPrefer;
    if (typeof(req.cookies.user) != 'undefined') {
        findPrefer = "SELECT * FROM record WHERE name = '" + req.cookies.user.name + "'";
    } else {
        findPrefer = "SELECT * FROM record WHERE name = 'default'";
    }
    connection.query(findPrefer, function(err, data) {
        if (err) {
            console.log('mysql error6: ' + err.message);
            ans = '服务器无响应';
            res.end(ans);
        } else {
            var result = [];
            var randomResult = getRandom(data[0]);
            console.log(randomResult);
            var i = 0;
            var count = randomResult[i];
            while (count == 0) {
                i++;
                count = randomResult[i];
            }
            var findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
            connection.query(findNews, function(err, data) {
                count--;
                result.push(data[count]);
                while (count == 0) {
                    i++;
                    count = randomResult[i];
                }
                findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                connection.query(findNews, function(err, data) {
                    count--;
                    result.push(data[count]);
                    while (count == 0) {
                        i++;
                        count = randomResult[i];
                    }
                    findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                    connection.query(findNews, function(err, data) {
                        count--;
                        result.push(data[count]);
                        while (count == 0) {
                            i++;
                            count = randomResult[i];
                        }
                        findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                        connection.query(findNews, function(err, data) {
                            count--;
                            result.push(data[count]);
                            while (count == 0) {
                                i++;
                                count = randomResult[i];
                            }
                            findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                            connection.query(findNews, function(err, data) {
                                count--;
                                result.push(data[count]);
                                while (count == 0) {
                                    i++;
                                    count = randomResult[i];
                                }
                                findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                                connection.query(findNews, function(err, data) {
                                    count--;
                                    result.push(data[count]);
                                    while (count == 0) {
                                        i++;
                                        count = randomResult[i];
                                    }
                                    findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                                    connection.query(findNews, function(err, data) {
                                        count--;
                                        result.push(data[count]);
                                        while (count == 0) {
                                            i++;
                                            count = randomResult[i];
                                        }
                                        findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                                        connection.query(findNews, function(err, data) {
                                            count--;
                                            result.push(data[count]);
                                            while (count == 0) {
                                                i++;
                                                count = randomResult[i];
                                            }
                                            findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                                            connection.query(findNews, function(err, data) {
                                                count--;
                                                result.push(data[count]);
                                                while (count == 0) {
                                                    i++;
                                                    count = randomResult[i];
                                                }
                                                findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                                                connection.query(findNews, function(err, data) {
                                                    count--;
                                                    result.push(data[count]);
                                                    while (count == 0) {
                                                        i++;
                                                        count = randomResult[i];
                                                    }
                                                    findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                                                    connection.query(findNews, function(err, data) {
                                                        count--;
                                                        result.push(data[count]);
                                                        while (count == 0) {
                                                            i++;
                                                            count = randomResult[i];
                                                        }
                                                        findNews = "SELECT * FROM news WHERE type = '" + newsType[i] + "' ORDER BY id DESC LIMIT " + count;
                                                        connection.query(findNews, function(err, data) {
                                                            result.push(data[0]);
                                                            res.json(JSON.stringify(result));
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    });
});

app.post('/content', urlencodedParser, function(req, res) {
    var typename = req.body.type;
    var page = req.body.page * 12;
    var findNews = "SELECT * FROM news WHERE type = '" + typename + "' ORDER BY id DESC LIMIT " + page;
    connection.query(findNews, function(err, data) {
        res.json(JSON.stringify(data));
    });
});

app.post('/search', urlencodedParser, function(req, res) {
    var typename = req.body.type;
    var substr = req.body.substr;
    var findNews = "SELECT * FROM news WHERE title like '%" + substr + "%' ORDER BY id DESC LIMIT 12";
    if (typename == 'home') {
        connection.query(findNews, function(err, data) {
            res.json(JSON.stringify(data));
        });
    } else {
        findNews = "SELECT * FROM news WHERE type = '" + typename + "' AND title like '%" + substr + "%' ORDER BY id DESC LIMIT 12";
        connection.query(findNews, function(err, data) {
            res.json(JSON.stringify(data));
        });
    }
});

app.post('/', urlencodedParser, function(req, res) {
    console.log("login requst received");
    var response = {
        "name": req.body.name,
        "password": req.body.password,
        "rem": req.body.rem
    };
    console.log(response);
    var check = "SELECT * FROM user WHERE name = '" + req.body.name + "'";
    connection.query(check, function(err, data) {
        if (err) {
            console.log('mysql error1: ' + err.message);
            ans = '服务器无响应';
            res.end(ans);
        } else if (data.length == 0) {
            console.log('User ' + req.body.name + " doesn't exist");
            ans = "用户不存在";
            res.end(ans);
        } else {
            if (data[0].password == req.body.password) {
                console.log('User ' + req.body.name + " log in");
                ans = "成功";
                res.cookie('user', { name: req.body.name, password: req.body.password, rem: req.body.rem }, { httpOnly: true });
                res.end(ans);
            } else {
                console.log('User ' + req.body.name + " write wrong password");
                ans = "用户名或密码错误";
                res.end(ans);
            }
        }
    });
});

app.post('/signup.html', urlencodedParser, function(req, res) {
    var response = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password
    };
    console.log(response);

    var addUser = 'INSERT INTO user(name,password,email,prefer) VALUES(?,?,?,?)';
    var check = "SELECT * FROM user WHERE name = '" + req.body.name + "' OR email = '" + req.body.email + "'";
    var addUserParams = [req.body.name, req.body.password, req.body.email, 0];
    var ans = 'test';

    connection.query(check, function(err, data) {
        if (err) {
            console.log('mysql error2: ' + err.message);
            ans = '服务器无响应';
            res.end(ans);
        } else if (data.length > 0) {
            console.log('User name or e-mail exist!');
            ans = '用户名或邮箱已被注册';
            res.end(ans);
        } else {
            connection.query(addUser, addUserParams, function(err, data) {
                if (err) {
                    console.log('mysql error3: ' + err.message);
                    ans = '服务器无响应';
                    res.end(ans);
                    return;
                }
                console.log('Add user ' + req.body.name + ' success');
                ans = '成功';
                res.cookie('user', { name: req.body.name, password: req.body.password, rem: 'false' }, { httpOnly: true });
                var addHabbit = 'INSERT INTO record(name,news,shehui,stock,fashion,astro,tech,ent,sports,finance,mil,digi,games) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)';
                var addHabbitParams = [req.body.name, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
                connection.query(addHabbit, addHabbitParams, function(err, data) {
                    if (err) {
                        console.log('mysql error3: ' + err.message);
                    }
                });
                res.end(ans);
            });
        }
    });

});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("server run at %s:%s", host, port);
});

var duration = 1000 * 60 * 60;
var HOST = 'http://sdk.open.api.igexin.com/apiex.htm';
var APPID = '6BA3m3awmB8gL8UMs37ql6';
var APPKEY = 'PWhdjAMI7H802Hb0GLYSz9';
var MASTERSECRET = 'pU9JP1c33f52eZWK2OE3P3';
var gt = new GeTui(HOST, APPKEY, MASTERSECRET);

function pushService(title, digest) {
    var taskGroupName = null;
    var template = new NotificationTemplate({
        appId: APPID,
        appKey: APPKEY,
        title: title,
        text: digest,
        logo: "logo.png",
        isRing: true,
        isVibrate: true,
        transmissionType: 1,
        transmissionContent: '测试离线'
    });

    var message = new AppMessage({
        isOffline: false,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template,
        appIdList: [APPID]
    });

    gt.pushMessageToApp(message, taskGroupName, function(err, res) {
        console.log(res);
    });
}

function pacPush() {
    var findNews = "SELECT * FROM news ORDER BY id DESC LIMIT 1";
    connection.query(findNews, function(err, data) {
        if (err) {
            console.log('推送失败1');
        } else {
            pushService(data[0].title, data[0].digest);
        }
    });
}

pacPush();
setInterval(pacPush, duration);