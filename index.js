/*
  A bot that welcomes new guild members when they join
*/

// Import the discord.js module
const Discord = require('discord.js')
const datefns = require('date-fns/format')
const datefnsjp = require('date-fns/locale/ja')
// Create an instance of a Discord client
const client0 = new Discord.Client();
const client1 = new Discord.Client();
const client2 = new Discord.Client();
const client3 = new Discord.Client();
const client4 = new Discord.Client();
const client5 = new Discord.Client();
const client6 = new Discord.Client();
const client7 = new Discord.Client();
const client8 = new Discord.Client();
const client9 = new Discord.Client();

//奇妙な拡張子のファイルパーサー(emotesという名前で奇妙な拡張子のファイル)
var emostore_json;
var FS = require('fs');
FS.readFile('emotes.json', 'utf-8', function (err, data) {
    if (err) throw err;
    emostore_json = JSON.parse(data);
})

// The token of your bot - https://discordapp.com/developers/applications/me
//トークンのアレイ
const tokens=JSON.parse(FS.readFileSync('tokens.json', 'utf-8'))
//転送済みメッセージのIDのアレイを格納する奇妙な拡張子のファイルを読み込む
var pinnedmsgids=JSON.parse(FS.readFileSync("pinned.json","utf-8"));

//メッセージ送るだけ
function repeater(ch, ArrayedMsg) {
    ch.send(ArrayedMsg[1]);
}

//上の関数repeater(ch, ArrayedMsg)をリピートさせる根幹部分
function looper(ch, ArrayedMsg, reNum) {
    for (let currentNum = 0; currentNum < reNum; ++currentNum) {
        //ここで1足して処理してないとｋ送信から時間が短すぎて途中で制限に引っかかると思う
        setTimeout(repeater, 1300 * (currentNum + 1), ch, ArrayedMsg);
    }
}

//割った余りを基に不足分をそれぞれ追加する数値を作るための関数
function amariplus(ArrayedMsg, conum) {
    let amari = ArrayedMsg[0].replace('/Re: ', '') % 10;
    if (amari >= conum) {
        return 1;
    } else {
        return 0;
    }
}

//メッセージ転送用の関数
function msgtrans(destch, msgs, transrep) {
    if (pinnedmsgids.includes(msgs[transrep - 1].id)){
        console.log(`すでに転送済みのメッセージ。メッセージID:${msgs[transrep - 1].id}`);
    }else{
        let msgid = msgs[transrep - 1].id;
        //↓の奴if挟んだほうがいいだろうか？
        msgs[transrep - 1].unpin();
        //転送するメッセージの投稿日時を取得してdate-fnsで日本語にする
        posteddate = datefns(msgs[transrep - 1].createdAt,'YYYY[年]MMMDodddd Ah[時]mm[分]ss[秒]',{locale:datefnsjp});
        //console.log(msgs[transrep-1].attachments.array()[0].url);
        if (msgs[transrep-1].attachments.array().length != 0) {
            //ファイルがくっついてればこっち
            var atch=msgs[transrep-1].attachments.array()[0].url;
            //Attachmentにはファイルのパス、URL、またはバッファを投げる。
            //contentの後にAttachmentやRichEmbedをブチ込むと一緒に投稿してくれる。
            destch.send(`${msgs[transrep - 1].author}が${posteddate}に${msgs[transrep - 1].channel}で投稿した、ピン留め対象メッセージが転送されました。内容は以下のとおりです。\n\n${msgs[transrep - 1].content}`,new Discord.Attachment(atch)).then(function(){
                pinnedmsgids.push(msgid);
                FS.writeFile("pinned.json",JSON.stringify(pinnedmsgids),function(err){if (err) throw err});
            })
        }else{
            //なんもくっついてなければこっち
            destch.send(`${msgs[transrep - 1].author}が${posteddate}に${msgs[transrep - 1].channel}で投稿した、ピン留め対象メッセージが転送されました。内容は以下のとおりです。\n\n${msgs[transrep - 1].content}`).then(function(){
                pinnedmsgids.push(msgid);
                FS.writeFile("pinned.json",JSON.stringify(pinnedmsgids),function(err){if (err) throw err});
            })
        }
    }
}

//📌転送用の配列達
var pinobservechs = [];
var pindestch = [];

//ログイン用関数
function loginer() {
    client0.login(tokens[0]);
    client1.login(tokens[1]);
    client2.login(tokens[2]);
    client3.login(tokens[3]);
    client4.login(tokens[4]);
    client5.login(tokens[5]);
    client6.login(tokens[6]);
    client7.login(tokens[7]);
    client8.login(tokens[8]);
    client9.login(tokens[9]);
}

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client0.on('ready', () => {
    console.log('I am ready.');
});
client1.on('ready', () => {
    console.log('I am ready!');
});
client2.on('ready', () => {
    console.log('I am ready!!');
});
client3.on('ready', () => {
    console.log('I am ready!!!');
});
client4.on('ready', () => {
    console.log('I am ready!!!!');
});
client5.on('ready', () => {
    console.log('I am ready!!!!!');
});
client6.on('ready', () => {
    console.log('I am ready!!!!!!');
});
client7.on('ready', () => {
    console.log('I am ready!!!!!!!');
});
client8.on('ready', () => {
    console.log('I am ready!!!!!!!!');
});
client9.on('ready', () => {
    console.log('Am I ready?');
});

// メッセージ投稿が確認されたとき
client0.on('message', message => {
    if (message.type == 'DEFAULT') {
        //スパイシーにするコマンド認識
        if (message.content.indexOf('/Re: ') == 0) {
            //メッセージの解釈をするための分割
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(Number(ArrayedMsg[0].replace('/Re: ', '')) / 10);
            //チャンネル指定の検出と反映
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                //デフォルト動作としてメッセージが送信された場所を指定
                ch = message.channel;
            }

            //準備完了報告&処理実行
            message.channel.send('ｋ');
            setTimeout(looper, 1000, ch, ArrayedMsg, reNum);
        } else if (message.content.indexOf('/Func: ') == 0) {
            //コマンド認識
            let ArrayedCmd = message.content.split('.')
            if (message.content.indexOf('System') == 7) {
                if (ArrayedCmd[1] === 'kill') {
                    //const author = message.author;
                    console.log(`終了要請を受信。送信者: ${message.author.username}`)
                    let reallykill = new Discord.RichEmbed();
                    reallykill.setTitle('本当にこのBotを終了しますか？');
                    reallykill.setColor([255, 0, 0]);
                    reallykill.addField('終了するとこのBotのすべての機能を利用できなくなります', '本当にこのBotを終了しますか？', false);
                    reallykill.addField('終了する', '✅', true);
                    reallykill.addField('キャンセル', '🛑', true);
                    reallykill.addField('再起動', '🔄', true);
                    reallykill.setFooter('リアクションをつけて処理を確定してください');
                    message.channel.send(reallykill)
                        .then(embed => {
                            //Embedの投稿が正常に完了したときの処理
                            embed.react('✅').then(embed.react('🛑').then(embed.react('🔄')));
                            //✅か🛑か🔄がコマンドメッセージを送った人によってリアクションされたときだけ反応するようにフィルタ
                            const filter = (reaction, user) => reaction.emoji.name === '✅' && user === message.author || reaction.emoji.name === '🛑' && user === message.author || reaction.emoji.name === '🔄' && user === message.author
                            var collector = embed.createReactionCollector(filter);
                            collector.on('collect', r => {
                                //上のフィルタで引っかかったときの処理
                                console.log(`${r.emoji.name}が認識されました`);
                                if (r.emoji.name === '🛑') {
                                    console.log('終了をキャンセルします。。。');
                                    embed.delete();
                                    message.delete();
                                } else if (r.emoji.name === '✅') {
                                    console.log('終了します。。。');
                                    //ボットをオフラインにした後プログラムを強制終了
                                    client0.destroy();
                                    client1.destroy();
                                    client2.destroy();
                                    client3.destroy();
                                    client4.destroy();
                                    client5.destroy();
                                    client6.destroy();
                                    client7.destroy();
                                    client8.destroy();
                                    client9.destroy();
                                    setTimeout(process.exit, 1000, 0);
                                } else if (r.emoji.name === '🔄') {
                                    client0.destroy();
                                    client1.destroy();
                                    client2.destroy();
                                    client3.destroy();
                                    client4.destroy();
                                    client5.destroy();
                                    client6.destroy();
                                    client7.destroy();
                                    client8.destroy();
                                    client9.destroy();
                                    setTimeout(loginer, 15000);
                                }
                            });
                        });

                }
            } else if (message.content.indexOf('Emoji') == 7) {
                //絵文字関連コマンド
                if (ArrayedCmd[1].indexOf('post') == 0) {
                    //絵文字投稿コマンド
                    let emoId = ArrayedCmd[1].split(' ')[1];
                    if (emostore_json.some(function (value) {
                        return value.id == emoId;
                    })) {
                        //絵文字があるか確認
                        let emoName = emostore_json.filter(function (value) {
                            return value.id == emoId;
                        })[0].name;
                        message.channel.send(`<:${emoName}:${emoId}>`);
                    }
                } else if (ArrayedCmd[1].indexOf('add') == 0) {
                    //絵文字の追加
                    let newemoId = ArrayedCmd[1].split(' ')[1].split(':')[1],
                        newemoName = ArrayedCmd[1].split(' ')[1].split(':')[0];
                    message.channel.send(`<:${newemoName}:${newemoId}>を追加しています。。。`);
                    emostore_json.push({ name: newemoName, id: newemoId });
                    FS.writeFile('emotes.json', JSON.stringify(emostore_json), 'utf-8', function (err) {
                        //非同期な書き込み
                        if (err) { console.log(err); }
                        FS.readFile('emotes.json', 'utf-8', function (err, data) {
                            //非同期な読み込み
                            if (err) { console.log(err); }
                            emostore_json = JSON.parse(data);
                            //内部絵文字情報更新
                        })
                    })
                }
            } else if (message.content.indexOf('PinRemoverStart') == 7) {
                //このコマンドが送信されたチャンネルのピン留め（実際に転送できるのは現在はテキストデータのみ。画像等のピン留めは消えてしまうので改善が必要）
                //を別のチャンネルに移すというもの
                //メッセージ内のチャンネルメンションから転送先を決定する
                let destchl = message.mentions.channels.array();
                let destch = destchl[destchl.length - 1];
                message.channel.fetchPinnedMessages()
                    .then(msgsb => {
                        let msgs = msgsb.array();
                        for (let transrep = 1; transrep <= msgs.length; transrep++) {
                            setTimeout(msgtrans, 3000 * transrep, destch, msgs, transrep);
                        }
                        message.channel.send('移行処理発行を完了しました。しばらくお待ち下さい...');
                    })
            } else if (message.content.indexOf('PinTransmitter') == 7) {
                if (ArrayedCmd[1].indexOf('Enable') == 0) {
                    //TODO:クライアントのイベントから拾うように書き直す
                    let transdestch = message.mentions.channels.array()[message.mentions.channels.array().length - 1];
                    var pinmsgcoll = message.channel.createMessageCollector(function (msg) {
                        //ここのフィルタは今のところは特に意味をなしていない。（）
                        return msg.type == 'DEFAULT';
                    });
                    pinmsgcoll.on('collect', obsmsg => {
                        let pinreactcoll=obsmsg.createReactionCollector(function (reaction) {
                            return reaction.emoji.name === '📌';
                        }).once('collect', react => {
                            let transmsgs = [];
                            transmsgs.push(react.message);
                            //このコードはDate.prototype.toLocaleString()だと自分の環境では日本語表記にできなかったので
                            //date-fnsのformatとその日本語ロケールを使って実現するためにいろいろ試した痕跡です。
                            //console.log(datefns(react.message.createdAt,'YYYY[年]MMMDodddd Ah[時]mm[分]ss[秒]',{locale:datefnsjp}));
                            msgtrans(transdestch, transmsgs, 1);
                            //message.embeds[0].type
                            pinreactcoll.stop();
                        })
                    })

                }else if (ArrayedCmd[1].indexOf('Guild')==0) {
                    //このコマンドで、コマンドメッセージを投稿したギルド全体のテキストチャンネルにて
                    //ボット起動後に投稿されたメッセージに対してつけられた📌リアクションで
                    //指定したチャンネルに転送するように設定する。
                    pinobservechs = message.guild.channels.filterArray(function (guildch){
                        //ここでテキストチャンネルだけ取り出す
                        if (guildch.type == "text") {return true;} else {return false;}
                    })
                    pindestch.push({channel:message.mentions.channels.last(),guild:message.mentions.channels.last().guild});
                }
            }
        }
    }
    //ここのコードはExamplesの今はいらないやつ達
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
}).on('messageReactionAdd', react => {
    if (react.emoji.name === '📌'){
        if (pinobservechs.includes(react.message.channel)) {
            //対象のチャンネルかどうかを確認
            if (pindestch.filter(function (chset){
                return chset.guild === react.message.guild;
            }).length != 0){
                //送り先のチャンネルの確認
                msgtrans(pindestch.filter(function (chset){
                    return chset.guild === react.message.guild                    
                })[0].channel, [react.message], 1);
            }
        }
    }
});

//こっから先はただおんなじコードがそれぞれ記述されているだけ。違うのはディレイ用の定数くらいなもん
client1.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            let ArrayedMsg = message.content.split(' ->|');
            //var amariplus = (ArrayedMsg, conum) => {
            //const amari = Number(ArrayedMsg[0].replace('/Re: ', '')) % 8)
            //if (amari >= conum) {
            //return 1;
            //} else {
            //return 0;
            //}
            //}
            let reNum = Math.floor(ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, 1);
            console.log(amariplus(ArrayedMsg, 1));
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                ch = message.channel;
            }

            message.channel.send('ｋ');
            setTimeout(looper, 1200, ch, ArrayedMsg, reNum);
        }
    }
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
});
client2.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, 2);
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                ch = message.channel;
            }

            message.channel.send('ｋ');
            setTimeout(looper, 1400, ch, ArrayedMsg, reNum);
        }
    }
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
});
client3.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, 3);
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                ch = message.channel;
            }

            message.channel.send('ｋ');
            setTimeout(looper, 1600, ch, ArrayedMsg, reNum);
        }
    }
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
});
client4.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, 4);
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                ch = message.channel;
            }

            message.channel.send('ｋ');
            setTimeout(looper, 1800, ch, ArrayedMsg, reNum);
        }
    }
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
});
client5.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, 5);
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                ch = message.channel;
            }

            message.channel.send('ｋ');
            setTimeout(looper, 1100, ch, ArrayedMsg, reNum);
        }
    }
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
});
client6.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, 6);
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                ch = message.channel;
            }

            message.channel.send('ｋ');
            setTimeout(looper, 1300, ch, ArrayedMsg, reNum);
        }
    }
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
});
client7.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, 7);
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                ch = message.channel;
            }

            message.channel.send('ｋ');
            setTimeout(looper, 1500, ch, ArrayedMsg, reNum);
        }
    }
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
});
client8.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, 8);
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                ch = message.channel;
            }

            message.channel.send('ｋ');
            setTimeout(looper, 1700, ch, ArrayedMsg, reNum);
        }
    }
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
});
client9.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, 9);
            let ch;
            if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                ch = message.channel;
            }

            message.channel.send('ｋ');
            setTimeout(looper, 1900, ch, ArrayedMsg, reNum);
        }
    }
    // Send the message to a designated channel on a server:
    //const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    //if (!channel) return;
    // Send the message, mentioning the member
    //channel.send(`Welcome to the server, ${member}`);
});

// Log our bot in
loginer();