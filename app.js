const Discord = require("discord.js");
const client = new Discord.Client();
const talk = new Set();

client.login("NDUyMDY2MjQ2NDQ4NTEzMDI1.DfK7HQ.C4aYWURnFvOruzKmGxI8Itvp1o8");

client.on("ready", () => {
    console.log("ready bot!");
});

client.on("message", message => {
    const args = message.content.split(/ +/g);
    const command = args.shift().toLowerCase();

    var userId = message.member.id;
    // if (command === '/join') {
    //     if (message.member.voiceChannel) {
    //         message.member.voiceChannel.join()
    //             .then(connection => {
    //                 connection.playFile('This game.mp3')
    //             })
    //             .catch(console.log);
    //         message.reply('통화방 입장');
    //     }
    //     else {
    //         ``
    //         message.reply('통화방이 존재하지 않습니다.')
    //     }
    // }
    // if (command == '/leave') {
    //     message.member.voiceChannel.leave()
    //     message.reply('통화방 퇴장');
    // }
    if (command == '/강화') {
        if (!talk.has(userId)) {
            if (args[0]) {
                fs.readdir('data/', (err, files) => {
                    if (files.indexOf(userId + ".json") == -1) {
                        fs.writeFile('data/' + userId + '.json', '[]', (err) => {
                            if (err) { console.log(err) }
                        })
                    }
                    fs.readFile('data/' + userId + '.json', (err, data) => {
                        if (err) { console.log(err) }
                        if (data) {
                            var jsonData = JSON.parse(data);
                        }
                        else {
                            var jsonData = []
                        }
                        if (args[0] == '설정' && args[1] && args[2]) {
                            var idx = jsonData.findIndex(x => x.name == args[2]);
                            if (idx != -1) {
                                if (args[1] == '이미지') {
                                    jsonData[idx].img = args[3];
                                    fs.writeFile('data/' + userId + '.json', JSON.stringify(jsonData), (err) => {
                                        var chat = {
                                            embed: {
                                                color: 1111111,
                                                author: {
                                                    name: client.user.username,
                                                    icon_url: client.user.avatarURL
                                                },
                                                thumbnail: {
                                                    "url": jsonData[idx].img
                                                },
                                                title: args[2],
                                                description: "이미지를 변경하였습니다."
                                            }
                                        }
                                        message.channel.send(chat);
                                    })
                                }
                            }
                            else {
                                message.reply('존재하지 않는 아이템입니다.')
                            }
                        }
                        else if (args[0] == '삭제' && args[1]) {
                            var idx = jsonData.findIndex(x => x.name == args[1]);
                            if (idx != -1) {
                                var tmpImg = jsonData[idx].img
                                jsonData.splice(idx, 1)
                                fs.writeFile('data/' + userId + '.json', JSON.stringify(jsonData), (err) => {
                                    var chat = {
                                        embed: {
                                            color: 1111111,
                                            author: {
                                                name: client.user.username,
                                                icon_url: client.user.avatarURL
                                            },
                                            thumbnail: {
                                                "url": tmpImg
                                            },
                                            title: args[2],
                                            description: "이 아이템을 삭제하였습니다."
                                        }
                                    }
                                    message.channel.send(chat);
                                })
                            }
                            else {
                                message.reply('존재하지 않는 아이템입니다.')
                            }
                        }
                        else {
                            var uLv;
                            var img;
                            var status;
                            var idx = jsonData.findIndex(x => x.name == args[0]);
                            if (idx == -1) {
                                jsonData.push({
                                    name: args[0],
                                    img: "https://cdn.discordapp.com/embed/avatars/0.png",
                                    lv: 1,
                                    history: [1]
                                });
                                uLv = 1;
                                img = "https://cdn.discordapp.com/embed/avatars/0.png";
                                status = 'create'
                            }
                            else {
                                img = jsonData[idx].img
                                uLv = jsonData[idx].lv
                                if (uLv == 'break') {
                                    status = 'already break'
                                }
                                else {
                                    //강화 알고리즘
                                    var maxLv = 200;
                                    var bk = maxLv - uLv; //Math.pow(1.1, uLv/2)
                                    console.log(bk / (maxLv / 100));
                                    if (Math.random() * maxLv < bk) {
                                        jsonData[idx].lv += 1 + Math.floor(Math.random() * 10);
                                        uLv = jsonData[idx].lv
                                        jsonData[idx].history.push(uLv)
                                        status = 'success' // 성공
                                    }
                                    else {
                                        if (Math.random() * maxLv < bk) {
                                            // if (Math.random() * maxLv < bk) {
                                            //     uLv = jsonData[idx].lv
                                            //     jsonData[idx].history.push(uLv)
                                            //     status = 'save' // 파괴 보존
                                            // }
                                            // else {
                                            jsonData[idx].lv -= Math.floor(Math.random() * jsonData[idx].lv / 1.2);
                                            uLv = jsonData[idx].lv;
                                            jsonData[idx].history.push(uLv)
                                            status = 'down' // 레벨 하락
                                            // }
                                        }
                                        else {
                                            if (Math.random() * maxLv < bk) {
                                                uLv = jsonData[idx].lv
                                                jsonData[idx].history.push(uLv)
                                                status = 'save' // 파괴 보존
                                            }
                                            else {
                                                uLv = jsonData[idx].lv
                                                jsonData[idx].lv = 'break';
                                                jsonData[idx].history.push(uLv)
                                                status = 'break' // 파괴
                                            }
                                        }

                                    }
                                }

                            }
                            fs.writeFile('data/' + userId + '.json', JSON.stringify(jsonData), (err) => {
                                function createStar(star) {
                                    var table = ""
                                    var t1 = Math.floor(star / 100)
                                    var t2 = Math.floor(star % 100 / 25)
                                    var t3 = Math.floor(star % 100 % 25 / 5)
                                    for (var i = 0; i < t1; i++) {
                                        table += ":diamonds:";
                                    }
                                    for (var i = 0; i < t2; i++) {
                                        table += ":small_blue_diamond:";
                                    }
                                    for (var i = 0; i < t3; i++) {
                                        table += ":small_orange_diamond:";
                                    }
                                    return table;
                                }
                                var star;
                                var color;
                                var des;
                                if (status == 'already break') {
                                    star = ':heavy_multiplication_x:'
                                    color = 16711680
                                    des = ':heavy_multiplication_x: -이미 파괴된 아이템입니다.'
                                }
                                if (status == 'break') {
                                    star = createStar(uLv)
                                    color = 16711680
                                    des = ':bomb: -아이템이 파괴되었습니다.'
                                }
                                if (status == 'success') {
                                    star = createStar(uLv)
                                    color = 3447003
                                    des = ':chart_with_upwards_trend: -Level : ' + uLv
                                }
                                if (status == 'down') {
                                    star = createStar(uLv)
                                    color = 16776960
                                    des = ':chart_with_downwards_trend: -Level : ' + uLv
                                }
                                if (status == 'save') {
                                    star = createStar(uLv)
                                    color = 16776960
                                    des = ':shield: -아이템이 파괴될 뻔했습니다.'
                                }
                                if (status == 'create') {
                                    star = createStar(uLv)
                                    color = 3447003
                                    des = ' Level : ' + uLv + '\n 아이템이 생성되었습니다.'
                                }

                                var chat = {
                                    embed: {
                                        color: color,
                                        author: {
                                            name: client.user.username,
                                            icon_url: client.user.avatarURL
                                        },
                                        thumbnail: {
                                            "url": img
                                        },
                                        title: star,
                                        fields: [
                                            {
                                                name: args[0],
                                                value: des
                                            }
                                        ]
                                    }
                                }

                                message.channel.send(chat);
                            })
                        }
                    })
                })
                talk.add(userId);
                setTimeout(()=>{
                    talk.delete(userId)
                },30000)
            }
        }
        else{
            message.reply('아직 사용하실 수 없습니다.')
        }
    }
});

const express = require('express');
const app = express();
const bodyParser = require('body-parser') // POST
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session'); // Session
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    secret: 'Andy0414',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static('public'));
app.use(express.static('data'));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

passport.serializeUser(function (user, done) {
    done(null, user);
}); // 세션 생성

passport.deserializeUser(function (id, done) {
    done(null, id);
}); // 세션 확인

passport.use(new DiscordStrategy({
    clientID: '452066246448513025',
    clientSecret: 'Ccs5IAvqsjR4DiBYmGqKdedpszNxqnRE',
    callbackURL: '/discord/callback',
    scope: ["identify"]
},
    function (accessToken, refreshToken, profile, done) {
        var user = {
            id: profile.id,
            username: profile.username
        }
        //console.log(profile)
        done(null, user);
    }));

app.get("/discord", passport.authenticate("discord", { permissions: 66321471 }));
app.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/main') // Successful auth
});
app.get(['/main', '/main/:item'], (req, res) => {
    if (!req.user) { res.redirect('/discord') }
    else {
        var userId = req.user.id;
        fs.readdir('data/', (err, files) => {
            if (files.indexOf(userId + ".json") != -1) {
                fs.readFile('data/' + userId + '.json', (err, data) => {
                    if (err) { res.status(404) }
                    if (data) {
                        var jsonData = JSON.parse(data);
                    }
                    else {
                        var jsonData = [];
                    }
                    var item;
                    res.render('myList', {
                        list: jsonData,
                        item: req.params.item
                    });
                })
            }
            else {
                fs.writeFile('data/' + userId + '.json', '[]', (err) => {
                    if (err) { res.status(404) }
                    res.render('myList', {
                        list: ''
                    });
                })
            }
        })
    }
})
app.post('/data/:item', (req, res) => {
    if (!req.user) { res.redirect('/discord') }
    else {
        var userId = req.user.id;
        fs.readdir('data/', (err, files) => {
            if (files.indexOf(userId + ".json") != -1) {
                fs.readFile('data/' + userId + '.json', (err, data) => {
                    if (err) { res.status(404).end() }
                    if (data) {
                        var jsonData = JSON.parse(data);
                    }
                    else {
                        var jsonData = [];
                    }
                    var idx = jsonData.findIndex(x => x.name == req.params.item)
                    if (idx != -1) {
                        res.json(jsonData[idx]);
                    }
                    else {
                        res.status(404).end()
                    }
                })
            }
            else {
                res.status(404).end()
            }
        })
    }
})
app.listen(3000, () => {
})