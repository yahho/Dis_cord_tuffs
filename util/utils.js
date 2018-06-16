const FS = require('fs');
const Discord = require('discord.js');
const datefns = require('date-fns/format')
const datefnsjp = require('date-fns/locale/ja')

var pinnedmsgids=JSON.parse(FS.readFileSync('pinned.json','utf-8'));

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
var PinObserveChs = [];
var PinDestCh = [];

class EmojiCache{
    constructor(name, id, isanim){
        if(name){this.name=name}
        if(id){this.id=id}
        if(isanim){this.isanim=isanim}
    }

    fromString(str){
        if(Object.prototype.toString.call(str)=='[Object String]'){
            str.replace('<','');
            str.replace('>','');
            if(str.startsWith('a')){
                this.isanim=true;
                str=str.slice(2);
            }else{
                this.isanim=false;
                str=str.slice(1);
            }
            this.name=str.split(':')[0]
            this.id=str.split(':')[1]
        }
    }

    toString(){
        let anim;
        if(this.isanim){anim='a'}else{anim=''}
        return `<${anim}:${this.name}:${this.id}>`
    }

    toObject(){
        return {name:this.name, id:this.id, isanim:this.isanim}
    }
}
module.exports ={repeater, looper, amariplus, msgtrans, PinObserveChs, PinDestCh, pinnedmsgids,EmojiCache}

