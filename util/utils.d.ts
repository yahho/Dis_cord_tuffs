//import FS from 'fs';
import Discord = require('discord.js');

declare module './utils'{
     /**
     *メッセージの送信を行います。
     *それだけです。
     *
     * @param {Discord.TextChannel} ch　送信先のチャンネルです。
     * @param {Array<string>} ArrayedMsg　メッセージテキストを分割して配列にしたものです。
     */
    function repeater(ch:Discord.TextChannel,ArrayedMsg:Array<string>):void;
    /**
     * repeater()を使って指定回数分だけ繰り返しメッセージを送信します。
     *
     * @param {Discord.TextChannel} ch　送信先のチャンネルです。
     * @param {Array<string>} ArrayedMsg　メッセージテキストを分割して配列にしたものです。
     * @param {number} ReNum　繰り返す回数です。
     */
    function looper(ch:Discord.TextChannel, ArrayedMsg:Array<string>, ReNum:number):void;
    /**
     *全体で正確なリピート回数にするためにそれぞれ1追加するか何も追加しないかを求めるための関数です。
     *
     * @param {Array<string>} ArrayedMsg　メッセージテキストを分割して配列にしたものです。
     * @param {number} conum　クライアントの担当番号
     * @returns {(1|0)}　追加で繰り返す数
     */
    function amariplus(ArrayedMsg:Array<string>, conum:number):1|0;
    /**
     *📌転送用の関数です。リピートしやすいかもしれません。
     *
     * @param {Discord.TextChannel} destch　転送先のチャンネルです。
     * @param {Array<Discord.Message>} msgs　転送するメッセージオブジェクトが入った配列です。
     * @param {number} transrep　参照用の番号です。1から始まります。
     */
    function msgtrans(destch:Discord.TextChannel, msgs:Array<Discord.Message>, transrep:number):void;
    /**
     *渡されたオブジェクトの型を確認します。
     *
     * @param {*} chkobj
     * @returns {string}
     */
    function typecheck(chkobj):string;

    var PinObserveChs:Array<Discord.TextChannel>;
    var PinDestCh:Array<{channel:Discord.TextChannel,guild:Discord.Guild}>;
    var pinnedmsgids:Array<string>;
    /**
     *実際にリピートコマンドを送信します。
     *
     * @param {Discord.Message} message
     * @param {Number} botid
     */
    function repeatcom(message:Discord.Message, botid:Number):void;
    
    /**
     *〇〇日△△の形で時刻を出力します。
     *例：30日夜, 3日昼頃, etc...
     *
     * @returns {string}
     */
    function WATIIN():string;
    /**
     *絵文字をDistuffBots内でキャッシュする際に扱われるオブジェクトのクラスです。
     *ボットがアクセスできないギルドに属した絵文字もキャッシュできますが、使用することはできません。
     *
     * @class EmojiCache
     */
    class EmojiCache{
        public name:string;
        public id:string;
        public isanim:boolean;
        constructor(name?:string, id?:string, isanim?:boolean)
        /**
         *これを使うと絵文字の実際の文字列（そのまま投稿すると絵文字に変換される文字列）からEmojiCacheに変換できます。
         *
         * @param {string} str
         * @returns {this}
         * @memberof EmojiCache
         */
        public fromString(str:string):EmojiCache;
        /**
         *これを使うとEmojiCacheからメッセージ投稿の際に絵文字に変換される文字列に変換できます。
         *
         * @returns {string}
         * @memberof EmojiCache
         */
        public toString():string;
        /**
         *これを使うとEmojiCacheからオブジェクトに変換できます。
         *
         * @returns {({name:string, id:string, isanim:boolean})}
         * @memberof EmojiCache
         */
        public toObject():{name:string, id:string, isanim:boolean};
        /**
         *JSON文字列に変換します。
         *
         * @returns {string}
         * @memberof EmojiCache
         */
        public toJSONString():string;
        /**
         *整合性確認的な関数です。
         *
         * @memberof EmojiCache
         */
        public chkthis():void;
    }
    /**
     *ただ囲んだだけです。EmojiCacheしか入れてはならぬ。
     *
     * @class EmojiStrage
     * @extends {Array<EmojiCache>}
     * @template EmojiCache
     */
    class EmojiStorage<EmojiCache> extends Array<EmojiCache>{
        constructor(array:Array<EmojiCache>)
        /**
         *JSON文字列に変換します。
         *
         * @returns {string}
         * @memberof EmojiStorage
         */
        public toJSONString():string;

        public fromJSONArray(array:Array<object>):this;

        public first():EmojiCache;
    }
}

