var http = require('http');
var url = require('url');
var mysql = require('mysql');
var cheerio = require('cheerio');
var request = require('request');
var async = require('async');
var sd = require('silly-datetime');
var tecentTarget = "http://xw.qq.com/m/";

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sxd1005',
    database: 'bs'
});

connection.connect();

var tencentType = [
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

function insertNews(addNewsParams) {
    var title = addNewsParams[0];
    var href = addNewsParams[1];
    var check = "SELECT * FROM news WHERE title = '" + title + "' OR href = '" + href + "'";
    var addNews = 'INSERT INTO news(title,href,imgsrc,digest,type) VALUES(?,?,?,?,?)';
    connection.query(check, function(err, data) {
        if (err) {
            console.log('mysql error4: ' + err.message);
        } else if (data.length > 0) {
            console.log('title: ' + title + " exists");
        } else {
            connection.query(addNews, addNewsParams, function(err, data) {
                if (err) {
                    console.log('mysql error5: ' + err.message);
                }
                console.log('Add news ' + title + ' success');
            });
        }
    });
}

function tencentParser() {
    async.forEach(tencentType, function(t) {
        http.get(tecentTarget + t + '/', function(res) {
            var html = '';
            res.on('data', function(chunk) {
                html += chunk;
            });
            res.on('end', function() {
                var lis = cheerio.load(html);
                var $ = cheerio.load(lis('div.list').eq(0).html());
                var news = $('li.full a');
                var type = t;
                for (var i = 0; i < news.length; i++) {
                    var href = news.eq(i).attr('href');
                    console.log(href);
                    var tmp = href.split('/');
                    if (tmp[tmp.length - 1].indexOf('.') > 0) {
                        continue;
                    }
                    var sub = cheerio.load(news.eq(i).html());
                    var img = sub('div.thumb img');
                    var imgsrc = img.attr('data-src');
                    var title = img.attr('alt');
                    var digest = sub('p').contents().filter(function() {
                        return this.nodeType == 3;
                    }).text().trim();
                    console.log(imgsrc);
                    console.log(title);
                    console.log(digest);
                    console.log();

                    var addNewsParams = [title, href, imgsrc, digest, type];
                    insertNews(addNewsParams);
                }
            });
        });
    });
}

var duration = 1000 * 60 * 10;
tencentParser();
setInterval(tencentParser, duration);