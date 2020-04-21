/*
  A bot that welcomes new guild members when they join
*/

// Import the discord.js module
const Discord = require('discord.js')

const distuff_util = require('./util/utils')

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
var emostore_json = new distuff_util.EmojiStorage();
var FS = require('fs');
FS.readFile('emotes.json', 'utf-8', function (err, data) {
    if (err) throw err;
    emostore_json.fromJSONArray(JSON.parse(data));
})

// The token of your bot - https://discordapp.com/developers/applications/me
//転送済みメッセージのIDのアレイを格納する奇妙な拡張子のファイルを読み込む
distuff_util.pinnedmsgids=JSON.parse(FS.readFileSync("pinned.json","utf-8"));

//📌転送用の配列達
var pinobservechs = distuff_util.PinObserveChs;
var pindestch = distuff_util.PinDestCh;

//GetVidChLink用のストリング
const vidlinkbase = ["https://canary.discordapp.com/channels/", "/"]

//VCTitle用Array<obj>
var TempLabeledVCList = []

//ログイン用関数
function loginall() {
    client0.login(process.env.BK_1);
    client1.login(process.env.BK_2);
    client2.login(process.env.BK_3);
    client3.login(process.env.BK_4);
    client4.login(process.env.BK_5);
    client5.login(process.env.BK_6);
    client6.login(process.env.BK_7);
    client7.login(process.env.BK_8);
    client8.login(process.env.BK_9);
    client9.login(process.env.BK_10);
}

//すべてのインスタンスをオフラインにします(ログオフ)
function offlineall() {
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
}

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client0.on('ready', () => {
    console.log('I am ready.');
    //client0.permission = new distuff_util.Permission(client0.guilds);
    //client0.guilds.array()[0].members.array()[0].permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD);
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
            //perm:command.util.RepeatPost
            //メッセージの解釈をするための分割
            let ArrayedMsg = message.content.split(' ->|');
            let reNum = Math.floor(Number(ArrayedMsg[0].replace('/Re: ', '')) / 10);
            //チャンネル指定の検出と反映
            let ch;
            if (message.mentions.users.array().some(user => {return user.bot})) {
                message.author.createDM().then(dmch=>{ch=dmch})
            } else if (ArrayedMsg[2] && message.mentions.channels.values().length != 0) {
                let chs = message.mentions.channels.array();
                ch = chs[chs.length - 1];
                //console.log(chs);
            } else {
                //デフォルト動作としてメッセージが送信された場所を指定
                ch = message.channel;
            }

            //準備完了報告&処理実行
            message.channel.send('ｋ');
            setTimeout(distuff_util.looper, 1000, ch, ArrayedMsg, reNum);
        } else if (message.content.indexOf('/Func: ') == 0) {
            //コマンド認識
            let ArrayedCmd = message.content.split('.')
            if (message.content.indexOf('System') == 7) {
                if (ArrayedCmd[1] === 'kill') {
                    //perm:command.system.Kill
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
                                    offlineall();
                                    setTimeout(process.exit, 1000, 0);
                                } else if (r.emoji.name === '🔄') {
                                    offlineall();
                                    setTimeout(loginall, 15000);
                                }
                            });
                        });

                }
            } else if (message.content.indexOf('Emoji') == 7) {
                //絵文字関連コマンド
                if (ArrayedCmd[1].indexOf('post') == 0) {
                    //perm:command.emoji.Post
                    //絵文字投稿コマンド
                    let emoId = ArrayedCmd[1].split(' ')[1];
                    //絵文字があるか確認
                    if (emostore_json.some(function (value) {
                        return value.id == emoId;
                    })) {
                        let emoName = emostore_json.filter(function (value) {
                            return value.id == emoId;
                        })[0].name,
                            emoIsanim = emostore_json.filter(function (value) {
                                return value.id == emoId;
                            })[0].isanim;
                        let anim="";
                        if(emoIsanim){anim = "a"}else{anim = ""}
                        message.channel.send(`<${anim}:${emoName}:${emoId}>`);
                    }
                } else if (ArrayedCmd[1].indexOf('add') == 0) {
                    //perm:command.emoji.Add
                    //絵文字の追加
                    let newemoIsanim,
                        newemoId,
                        newemoName;
                    let str=ArrayedCmd[1].slice(4);
                    if(str.startsWith('a')){
                        newemoIsanim=true;
                        str=str.slice(2);
                    }else{
                        newemoIsanim=false;
                        str=str.slice(1);
                    }
                    newemoName=str.split(':')[0];
                    newemoId=str.split(':')[1];
                    let anim="";
                    if(newemoIsanim){anim = "a"}else{anim = ""}
                    message.channel.send(`<${anim}:${newemoName}:${newemoId}>を追加しています。。。`);
                    let emojic = new distuff_util.EmojiCache(newemoName, newemoId, newemoIsanim);
                    emostore_json.push(emojic.toObject());
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
                } else if (ArrayedCmd[1].indexOf('genEmojiJSON') == 0){
                    //perm:command.emoji.GenEmojicordJSON
                    //絵文字のJSONをEmojicord対応形式で出力する。
                    let guildemojis = message.guild.emojis.array();
                    let guildemojistore=new distuff_util.EmojiStorage();
                    guildemojis.forEach(emoji =>{guildemojistore.push(new distuff_util.EmojiCache(null,null,null,emoji))});
                    let tmpgemojis = new distuff_util.GuildEmojiStorage(message.guild.name, message.guild.id, guildemojistore);
                    let tmp = {groups:[tmpgemojis]};
                    FS.writeFileSync(`${message.guild.id}.json`, JSON.stringify(tmp, null,`\t`))
                    message.channel.send({files:[{attachment: `${message.guild.id}.json`,name:`${message.guild.name}.json`}]})
                }
            } else if (message.content.indexOf('PinRemoverStart') == 7) {
                //perm:command.pin.RemoverTool
                //このコマンドが送信されたチャンネルのピン留め（実際に転送できるのは現在はテキストデータのみ。画像等のピン留めは消えてしまうので改善が必要）
                //を別のチャンネルに移すというもの
                //メッセージ内のチャンネルメンションから転送先を決定する
                let destchl = message.mentions.channels.array();
                let destch = destchl[destchl.length - 1];
                message.channel.fetchPinnedMessages()
                    .then(msgsb => {
                        let msgs = msgsb.array();
                        for (let transrep = 1; transrep <= msgs.length; transrep++) {
                            setTimeout(distuff_util.msgtrans, 3000 * transrep, destch, msgs, transrep);
                        }
                        message.channel.send('移行処理発行を完了しました。しばらくお待ち下さい...');
                    })
            } else if (message.content.indexOf('PinTransmitter') == 7) {
                if (ArrayedCmd[1].indexOf('Enable') == 0) {
                    //perm:command.pin.observeandcopy.channel
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
                            distuff_util.msgtrans(transdestch, transmsgs, 1);
                            //message.embeds[0].type
                            pinreactcoll.stop();
                        })
                    })

                }else if (ArrayedCmd[1].indexOf('Guild')==0) {
                    //perm:command.pin.observeandcopy.guild
                    //このコマンドで、コマンドメッセージを投稿したギルド全体のテキストチャンネルにて
                    //ボット起動後に投稿されたメッセージに対してつけられた📌リアクションで
                    //指定したチャンネルに転送するように設定する。
                    pinobservechs = message.guild.channels.filterArray(function (guildch){
                        //ここでテキストチャンネルだけ取り出す
                        if (guildch.type == "text") {return true;} else {return false;}
                    })
                    pindestch.push({channel:message.mentions.channels.last(),guild:message.mentions.channels.last().guild});
                }
            } else if (message.content.indexOf('DedNewsGen') == 7) {
                //perm:command.util.DedNewsGen
                let Arrayedlns = message.content.split(/\r\n|\r|\n/g)
                let Defaultstrs = ["に埋もれてdedしている", "が発見された。"].reverse()
                Defaultstrs.push(`${distuff_util.WATIIN()}、果実都某所で、`)
                Defaultstrs.reverse()
                if(Arrayedlns.length >=3){
                    let burything=""
                    let buriedperson=""
                    if(Arrayedlns[1].length>0 && Arrayedlns[2].length>0){
                        [_, burything, buriedperson] = Arrayedlns;
                        burything.endsWith(" ") ? burything=burything : burything=burything+" "
                        buriedperson.endsWith(" ") ? buriedperson=buriedperson : buriedperson=buriedperson+" "
                        let lns=[];
                        let lastlnpt=[];
                        for (var r1=0;r1!=3;r1++) {
                            let ln =[];
                            for (var r2=0;r2!=7;r2++) {
                                ln.push(burything);
                            }
                            lns.push(ln.join(""));
                            lastlnpt.push(burything);
                        }
                        lns.push(lastlnpt.join("")+buriedperson+lastlnpt.join(""))
                        let returnedlns= [Defaultstrs[0]+burything+Defaultstrs[1]+buriedperson+Defaultstrs[2]].concat(lns).join('\n')
                        message.channel.send(returnedlns)
                    }
                }
            } else if (message.content.indexOf('GetVidChLink') == 7) {
                //perm:command.util.GetVidChLink
                //踏むとビデオ通話の画面が開くcanaryのリンクを生成します。
                let targetvoicech = message.member.voiceChannel
                if (targetvoicech == null) {
                    message.channel.send('あんたが参加してるVCが、ないやん！\nどうしてくれるの、これ。');
                }else{
                    let res = new Discord.RichEmbed();
                    res.setTitle('ご注文はこちらのビデオ通話ですか？');
                    res.setColor([156, 58, 190]);
                    res.addField("お待たせいたしました。こちら、", `[${targetvoicech.name}](${vidlinkbase[0]}${targetvoicech.guild.id}${vidlinkbase[1]}${targetvoicech.id})になります。`);
                    res.setFooter("以上でよろしいですね。");
                    message.channel.send(res);
                }

            } else if (message.content.indexOf('Help') == 7) {
                //perm:command.general.Help
                //ヘルプを表示します。
            } else if (message.content.indexOf('InviteBots') == 7) {
                //perm:command.general.Invitebot
                //Botの招待リンクを発行します。
                message.channel.send('導入を検討いただきありがとうございます。\n以下のリンク先で追加したいサーバーを選択し、\`認証\`ボタンを押してください。\n||https://discordapp.com/api/oauth2/authorize?client_id=446678468931878912&permissions=120974400&scope=bot||');
            } else if (message.content.indexOf('BridgeChannel') == 7) {
                //perm:command.util.BridgeCh
                //ボイスチャット同士を接続します
            } else if (message.content.indexOf('VCTitle') == 7){
                //perm:command.util.VCTempTitle
                //VCのタイトルを一時的に書き換えて利用目的がわかるようにします
                let authorID = message.author.id;
                let targetCh = message.guild.members.get(authorID).voiceChannel;
                if (targetCh === undefined){message.channel.send(`Hey ${message.author}, そもそもVCに参加していませんね。。。？`);return;}
                let originTitle = targetCh.name;
                let TempTitle = [...originTitle][0]+message.content.split(" ")[2];
                TempLabeledVCList.push({issuer:authorID, targetID:targetCh.id, originTitle:originTitle, guild:message.guild.id});
                targetCh.setName(TempTitle, `${targetCh}の一時的なタイトルの設定が${message.author}(${message.author.tag})によって要求されました。`);
                message.delete();
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
                distuff_util.msgtrans(pindestch.filter(function (chset){
                    return chset.guild === react.message.guild                    
                })[0].channel, [react.message], 1);
            }
        }
    }
}).on('voiceStateUpdate', (OldVoiceStat, NewVoiceStat) => {
    //VCに誰かが入ったり抜けたりしたとき
    let NoLongerUsedVCh = TempLabeledVCList.find(vc => vc.issuer == OldVoiceStat.id && vc.targetID != NewVoiceStat.voiceChannelID);
    if (NoLongerUsedVCh !== undefined){
        client0.guilds.get(NoLongerUsedVCh.guild).channels.get(NoLongerUsedVCh.targetID).setName(NoLongerUsedVCh.originTitle ,`<@${NoLongerUsedVCh.issuer}>(${client0.users.get(NoLongerUsedVCh.issuer).tag})が<#${NoLongerUsedVCh.targetID}>を退出したため一時的なタイトルの必要性はもはや認められません。`);
        TempLabeledVCList = TempLabeledVCList.filter(vc => vc != NoLongerUsedVCh);
    }
});

//こっから先はただおんなじコードがそれぞれ記述されているだけ。違うのはディレイ用の定数くらいなもん
client1.on('message', message => {
    if (message.type == 'DEFAULT') {
        if (message.content.indexOf('/Re: ') == 0) {
            distuff_util.repeatcom(message, 1)
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
            distuff_util.repeatcom(message, 2)
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
            distuff_util.repeatcom(message, 3)
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
            distuff_util.repeatcom(message, 4)
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
            distuff_util.repeatcom(message, 5)
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
            distuff_util.repeatcom(message, 6)
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
            distuff_util.repeatcom(message, 7)
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
            distuff_util.repeatcom(message, 8)
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
            distuff_util.repeatcom(message, 9)
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
loginall();