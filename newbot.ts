/*
  A bot that welcomes new guild members when they join
*/

// Import the discord.js module
import Discord = require('discord.js');

import distuff_util = require('./util/utils');

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
var emostore_json= new distuff_util.EmojiStorage<distuff_util.EmojiCache>();
import FS = require('fs');
FS.readFile('emotes.json', 'utf-8', function (err, data) {
    if (err) throw err;
    emostore_json.fromJSONArray(JSON.parse(data));
})

// The token of your bot - https://discordapp.com/developers/applications/me
//転送済みメッセージのIDのアレイを格納する奇妙な拡張子のファイルを読み込む
distuff_util.pinnedmsgids=JSON.parse(FS.readFileSync("pinned.json","utf-8"));

//📌転送用の配列達

var pindestch = distuff_util.PinDestCh;
var pinTransmissionPairs = [];

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
            if (message.mentions.users.some(user => {return user.bot})) {
                message.author.createDM().then(dmch=>{ch=dmch})
            } else if (ArrayedMsg[2]) {
                ch = message.mentions.channels.last();
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
                    let reallykill = new Discord.MessageEmbed();
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
                            embed.react('✅')
                            .then(returnedreaction => returnedreaction.message.react('🛑')
                            .then(returnedreaction => returnedreaction.message.react('🔄')));
                            //✅か🛑か🔄がコマンドメッセージを送った人によってリアクションされたときだけ反応するようにフィルタ
                            let reactStr = "✅🛑🔄"
                            const filter:Discord.CollectorFilter = (reaction:Discord.MessageReaction, user:Discord.User) => {
                                return ((user === message.author) && ([...reactStr].some(react => react === reaction.emoji.name)));
                            }
                            embed.awaitReactions(filter).then(r => {
                                //上のフィルタで引っかかったときの処理
                                console.log(`${r.first().emoji.name}が認識されました`);
                                if (r.first().emoji.name === '🛑') {
                                    console.log('終了をキャンセルします。。。');
                                    embed.delete();
                                    message.delete();
                                } else if (r.first().emoji.name === '✅') {
                                    console.log('終了します...');
                                    //ボットをオフラインにした後プログラムを強制終了
                                    offlineall();
                                    setTimeout(process.exit, 1000, 0);
                                } else if (r.first().emoji.name === '🔄') {
                                    console.log('再起動します...');
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
                    let newemoIsanim:boolean,
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
                    emostore_json.push(emojic);
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
                    let guildemojis = message.guild.emojis.cache;
                    let guildemojistore=new distuff_util.EmojiStorage<distuff_util.EmojiCache>();
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
                let destch = message.mentions.channels.last();
                message.channel.messages.fetchPinned()
                    .then(msgsb => {
                        let msgs = msgsb;
                        for (let transrep = 1; transrep <= msgs.size; transrep++) {
                            setTimeout(distuff_util.msgtrans, 3000 * transrep, destch, msgs, transrep);
                        }
                        message.channel.send('移行処理発行を完了しました。しばらくお待ち下さい...');
                    })
            } else if (message.content.indexOf('PinTransmitter') == 7) {
                if (ArrayedCmd[1].indexOf('Enable') == 0) {
                    //perm:command.pin.observeandcopy.channel
                    //TODO:クライアントのイベントから拾うように書き直す
                    let transdestch = message.mentions.channels.last();
                    pinTransmissionPairs.push({destCh:transdestch, collectCh:message.channel})
                    
                }else if (ArrayedCmd[1].indexOf('Guild')==0) {
                    //perm:command.pin.observeandcopy.guild
                    //このコマンドで、コマンドメッセージを投稿したギルド全体のテキストチャンネルにて
                    //ボット起動後に投稿されたメッセージに対してつけられた📌リアクションで
                    //指定したチャンネルに転送するように設定する。
                    //チャンネルの指定はチャンネルメンションで行う。
                    let pinobservechs:Array<Discord.TextChannel>=[];
                    let pinObserveChCollection = message.guild.channels.cache.filter(guildch =>
                        //ここでテキストチャンネルだけ取り出す。まだGuildChannelのまま。
                        guildch.type == "text"
                    );
                    pinObserveChCollection.forEach(Ch => pinobservechs.push(Ch as Discord.TextChannel));
                    
                    for (let collCh of pinobservechs){
                        pinTransmissionPairs.push({destCh:message.mentions.channels.last(), collectCh:collCh})
                    }
                }else if (ArrayedCmd[1].indexOf('Disable') == 0){
                    //ピン止め転送されてくるのを止めたいチャンネルでこのコマンドを打つと、
                    //そのチャンネルではあらゆる場所からのピン止め転送を拒否する設定が作動するようになります。
                    //チャンネルメンションで特定の1チャンネルからのみを遮断することもできます。
                    let cancellObserveCh = message.mentions.channels.last();
                    if (cancellObserveCh !== undefined){
                        pinTransmissionPairs = pinTransmissionPairs.filter(pair => pair != {destCh:message.channel, collectCh:cancellObserveCh})
                    } else {
                        pinTransmissionPairs = pinTransmissionPairs.filter(pair => pair.destCh != message.channel)
                    }
                    
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
                        [burything, buriedperson] = Arrayedlns.shift();
                        burything.endsWith(" ") ? burything=[...burything].slice(0, burything.lastIndexOf(" ")).join() : burything=burything
                        buriedperson.endsWith(" ") ? [...buriedperson].slice(0, buriedperson.lastIndexOf(" ")).join() : buriedperson=buriedperson
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
                let targetvoicech = message.member.voice.channel
                if (targetvoicech === undefined) {
                    message.channel.send('あんたが参加してるVCが、ないやん！\nどうしてくれるの、これ。');
                }else{
                    let res = new Discord.MessageEmbed();
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
                let targetCh = message.member.voice.channel;
                if (targetCh === undefined){message.channel.send(`Hey ${message.author}, そもそもVCに参加していませんね。。。？`);return;}
                let originTitle = targetCh.name;
                let TempTitle = [...originTitle][0]+message.content.split(" ")[2];
                if (TempLabeledVCList.find(VCConf => VCConf.targetID == targetCh.id && VCConf.guild == message.guild.id) !== undefined){
                    let tmp_VCConf = TempLabeledVCList.find(VCConf => VCConf.targetID == targetCh.id && VCConf.guild == message.guild.id);
                    TempLabeledVCList = TempLabeledVCList.filter(VCConf => VCConf != tmp_VCConf);
                    tmp_VCConf.issuer = authorID;
                    TempLabeledVCList.push(tmp_VCConf);
                }else{
                    TempLabeledVCList.push({issuer:authorID, targetID:targetCh.id, originTitle:originTitle, guild:message.guild.id});
                }
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
        if (pinTransmissionPairs.find(pair => pair.CollectCh == react.message.channel)!==undefined) {
            //対象のチャンネルかどうかを確認
            for (let targetPairs of pinTransmissionPairs.filter(pair => pair.CollectCh == react.message.channel)){
                //送り先のチャンネルの確認
                distuff_util.msgtrans(targetPairs.destCh, [react.message], 1);
            }
        }
    }
}).on('voiceStateUpdate', (OldVoiceStat, NewVoiceStat) => {
    //VCに誰かが入ったり抜けたりしたとき
    let NoLongerUsedVCh = TempLabeledVCList.find(vc => vc.issuer == OldVoiceStat.id && vc.targetID != NewVoiceStat.channelID);
    if (NoLongerUsedVCh !== undefined){
        client0.guilds.resolve(NoLongerUsedVCh.guild).channels.resolve(NoLongerUsedVCh.targetID).setName(NoLongerUsedVCh.originTitle ,`<@${NoLongerUsedVCh.issuer}>(${client0.users.resolve(NoLongerUsedVCh.issuer).tag})が<#${NoLongerUsedVCh.targetID}>を退出したため一時的なタイトルの必要性はもはや認められません。`);
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