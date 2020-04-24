import FS = require('fs');
import Discord = require('discord.js');
const datefns = require('date-fns/format');
const datefnsjp = require('date-fns/locale/ja');
const offsettedDate = require('date-with-offset');

var pinnedmsgids:Array<string>=JSON.parse(FS.readFileSync('pinned.json','utf-8'));
function typecheck(chkobj){
    return Object.prototype.toString.call(chkobj).slice(8, -1).toLowerCase()
}

//メッセージ送るだけ
function repeater(ch:Discord.TextChannel, ArrayedMsg:Array<string>) {
    ch.send(ArrayedMsg[1]);
}

//上の関数repeater(ch, ArrayedMsg)をリピートさせる根幹部分
function looper(ch:Discord.TextChannel, ArrayedMsg:Array<string>, reNum:number) {
    for (let currentNum = 0; currentNum < reNum; ++currentNum) {
        //ここで1足して処理してないとｋ送信から時間が短すぎて途中で制限に引っかかると思う
        setTimeout(repeater, 1300 * (currentNum + 1), ch, ArrayedMsg);
    }
}

//割った余りを基に不足分をそれぞれ追加する数値を作るための関数
function amariplus(ArrayedMsg:Array<string>, conum:number) {
    let amari = +ArrayedMsg[0].replace('/Re: ', '') % 10;
    if (amari >= conum) {
        return 1;
    } else {
        return 0;
    }
}

//メッセージ転送用の関数
function msgtrans(destch:Discord.TextChannel, msg:Discord.Message) {
    if (pinnedmsgids.includes(msg.id)){
        console.log(`すでに転送済みのメッセージ。メッセージID:${msg.id}`);
    }else{
        let msgid = msg.id;
        //↓の奴if挟んだほうがいいだろうか？
        msg.unpin();
        //転送するメッセージの投稿日時を取得してdate-fnsで日本語にする
        let posteddate:string = datefns(msg.createdAt,'yyyy年MMMdoeeee Ho時mm分ss秒SSS',{locale:datefnsjp});
        //console.log(msgs.attachments.array()[0].url);
        let restext = `${msg.author}が${posteddate}に${msg.channel}で投稿した、ピン留め対象メッセージが転送されました。\n【ジャンプURL】: ${msg.url}\n内容は以下のとおりです。\n\n${msg.content}`;
        if (msg.attachments.size != 0) {
            //ファイルがくっついてればこっち
            let atchs=msg.attachments;
            let atchobjs:Array<Discord.MessageAttachment>=[];
            atchs.forEach(atch => {atchobjs.push(new Discord.MessageAttachment(atch.url))});
            //Attachmentにはファイルのパス、URL、またはバッファを投げる。
            //contentの後にAttachmentやRichEmbedをブチ込むと一緒に投稿してくれる。
            destch.send(restext, atchobjs).then(function(){
                pinnedmsgids.push(msgid);
                FS.writeFile("pinned.json",JSON.stringify(pinnedmsgids),function(err){if (err) throw err});
            })
        }else{
            //なんもくっついてなければこっち
            destch.send(restext).then(function(){
                pinnedmsgids.push(msgid);
                FS.writeFile("pinned.json",JSON.stringify(pinnedmsgids),function(err){if (err) throw err});
            })
        }
    }
}
//📌転送用の配列達
var PinObserveChs = [];
var PinDestCh = [];

function repeatcom(message:Discord.Message, botid:number){
    let ArrayedMsg = message.content.split(' ->|');
    let reNum = Math.floor(+ArrayedMsg[0].replace('/Re: ', '') / 10) + amariplus(ArrayedMsg, botid);
    let ch:Discord.TextChannel;
    if (!(message.channel instanceof Discord.TextChannel)) {
        message.channel.send("DMやニュースチャンネルでは利用できません");
    }else {
        if (ArrayedMsg[2] && message.mentions.channels.size != 0) {
            let chs = message.mentions.channels;
            let dchs:Array<Discord.TextChannel>;
            chs.forEach(function(chent){if(chent.id == ArrayedMsg[2].replace("<#", "").replace(">", "")){dchs.push(chent)}})
            if(dchs.length==0){ch = message.channel}
            ch = dchs.pop();
            //console.log(chs);
        } else {
            ch = message.channel;
        }
    }

    message.channel.send('ｋ');
    setTimeout(looper, 100*(10+botid), ch, ArrayedMsg, reNum);
}

function WATIIN(){
    const today = new offsettedDate(540)
    let date = today.getDate()
    let ahour = today.getHours()>=3 ? today.getHours()>6 ? today.getHours()>9 ? today.getHours()>=12 ? today.getHours()>15 ? today.getHours()>18 ? today.getHours()>21 ? "深夜":"夜":"午後":"昼頃":"午前":"朝":"早朝":"深夜"
    return `${date}日${ahour}`
}

class EmojiCache{
    public name:string;
    public id:string;
    public isanim:boolean;
    constructor(nameOrEmoji?:string|Discord.GuildEmoji, id?:string, isanim?:boolean){
        if(nameOrEmoji instanceof Discord.GuildEmoji){
            this.name = nameOrEmoji.name;
            this.id = nameOrEmoji.id;
            this.isanim = nameOrEmoji.animated;
            return this;
        }else{this.name=name}
        if(id){this.id=id}else{this.isanim=null}
        if(isanim){this.isanim=isanim}else{this.isanim=null}
    }

    fromString(str:string){
        if(Object.prototype.toString.call(str)=='[Object String]'){
            if(str.startsWith("<")==false||str.endsWith(">")==false){throw new SyntaxError(`絵文字の構文が正しくありません。絵文字は<>で囲まれている必要があります。\n問題が発生した文字列:${str}`)}
            if(str.split(":").length!=3){throw new SyntaxError(`絵文字の構文が正しくありません。絵文字には2つのコロンが存在するはずです。\n問題が発生した文字列:${str}`)}
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
        let anim:string;
        if(this.isanim){anim='a'}else{anim=''}
        return `<${anim}:${this.name}:${this.id}>`
    }

    toObject(){
        return {name:this.name, id:this.id, isanim:this.isanim}
    }

    toJSONString(){
        this.chkthis();
        let TorFstr:string;//<- That's meaning boolean
        if(this.isanim){TorFstr="true"}else{TorFstr="false"}
        return `{"name":"${this.name}","id":"${this.id}","isanim":"${TorFstr}"}`
    }

    chkthis(){
        if(typecheck(this.name)!="string"){throw new TypeError(`絵文字の名称が文字列ではありません。識別された型：${typecheck(this.name)}`)}
        if(typecheck(this.id)!="string"){throw new TypeError(`絵文字のIDが文字列ではありません。識別された型：${typecheck(this.id)}`)}
        if(typecheck(this.isanim)!="boolean"){throw new TypeError(`絵文字のアニメーションの有無が判別できません。識別された型：${typecheck(this.isanim)}`)}

    }
}

class EmojiStorage<EmojiCache> extends Array{
    constructor(array?:Array<EmojiCache>){
        if(array){
            super();
            this.concat(array)
            return this
        }else {
            super();
            return this
        }
    }

    toJSONString(){
        const BeginEnd = ["[","]"];
        let retstr = BeginEnd[0];
        if (this.length != 0){
            for(let i=0;i<=this.length-1;i++){
                retstr=retstr+this[i].toJSONString();
                retstr=retstr+","
            }
            retstr = retstr.slice(0,-1);
        }
        retstr=retstr+BeginEnd[1];
        return retstr;
    }

    fromJSONArray(array:Array<{name:string, id:string, isanim:boolean}>){
        if(typecheck(array)!='array'){
            throw new TypeError(`入力は配列でなければなりません。判定された型: ${typecheck(array)}`);
        }else{
            array.forEach(consemo => {
                this.push(new EmojiCache(consemo.name, consemo.id, consemo.isanim));
            },this);
            return this;
        }
    }
}

/**
 *EmojicordJSON生成用絵文字コンテナです。
 *
 * @class GuildEmojiStorage
 */
class GuildEmojiStorage{
    public name:string;
    public id:string;
    public emojis:EmojiStorage<EmojiCache>;
    constructor(guildname:string, guildid:string, emojiarray:EmojiStorage<EmojiCache>){
        this.name=guildname;
        this.id=guildid;
        this.emojis=emojiarray;
        this.emojis.forEach(emoji => {
            delete emoji.isanim;
        })
    }

    toJSONString(){
        return JSON.stringify(this)
    }
}

class PermissionManager{
    public rules:Array<any>;
    public permCache
    constructor(guild:Discord.Guild){
        this.rules=[];
        if (FS.existsSync(`./permission/`)) {
            if (FS.existsSync(`./permission/${guild.id}.json`)){
                this.permCache = JSON.parse(FS.readFileSync(`./permission/${guild.id}.json`, 'utf-8'))
            } else {
                //default deny: command.system.kill, command.util.RepeatPost, command.pin.*
                //default global permission: Permit
            }
        }
    }

    checkBotPerm(User, Node){//node -> user

    }

    checkUserPerm(User, action, to){
        if (to === undefined){

        }
    }

    swapPriority(from, to){
        [this.permCache.CustomRule[from],this.permCache.CustomRule[to]] = [this.permCache.CustomRule[to],this.permCache.CustomRule[from]];
        this.save()
    }

    addPerm(User, isPermit, Node){

    }

    removePerm(){

    }

    save(){

    }

}
class PermissionUser{}
class PermissionNode{}
export {repeater, looper, amariplus, msgtrans, pinnedmsgids, EmojiCache, EmojiStorage, GuildEmojiStorage, typecheck, repeatcom, WATIIN}
