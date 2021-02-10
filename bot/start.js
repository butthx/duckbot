const util = require('./util')
const { lang } = require('./lang/language')
const start_module = {
    start : async function (ctx) {
        var msg = ctx.message;
        var msg_id = msg.message_id;
        var user_id = msg.from.id;
        let language = 'en'
        var first_name = msg.from.first_name;
        var mention = "<a href='tg://user?id=" + user_id + "'>" + first_name + "</a>";
        //check the user language
        if (msg.from.language_code && lang[msg.from.language_code]) {
            language = msg.from.language_code.toLowerCase()
        }
        //check private chat or not
        try {
            if (msg.chat.type == 'private') {
                var pesan = lang[language].start.replace(/\{mention\}/gmi,mention);
                var keyboard = [[{
                    text: `🧚🏻‍♂️ ${lang[language].addGroup}`,
                    url: `https://t.me/${ctx.botInfo.username}?startgroup=true`
                }], [{
                    text: `💲 ${lang[language].donate}`,
                    url: 'https://saweria.co/DuckBot'
                },{
                    text: `🆘 ${lang[language].helpButton}`,
                    callback_data :'help'
                    }]]
                util.kirimpesan(ctx, pesan, keyboard)
                //if not 
            } else {
                util.kirimpesan(ctx,lang[language].pmMessage , [[{ text:lang[language].pmButton, url: `https://t.me/${ctx.botInfo.username}?start` }]])
            }
        } catch (error) {
            util.error_log(ctx,error)
        }
    },
    setUsername : async function(ctx){
      try{
        //config language
            let language = 'en'
            if (ctx.message.from.language_code && lang[ctx.message.from.language_code]) {
                language = ctx.message.from.language_code.toLowerCase()
            }
        return ctx.replyWithAnimation('CgACAgUAAxkBAAObYAkiJAUIT51Q3ZvG8_xteDoKC9MAAvEAAx2fiVenbESkzdblXh4E',{caption : `How to set username?\n• Goto settings and fill in the username\n• Username must at least 5 letters or numbers\n• The username notification must be green text with the words 'username is available'\n#setusername\n©️ Miss Duckbot ${new Date().getFullYear()}`,reply_to_message_id : ctx.message.message_id,reply_markup:{inline_keyboard:[[{text:`❌ ${lang[language].close}`,callback_data:'close',hide:true}]]}})

      // change file_id with this if published!
      //
      //beta : CgACAgUAAxkBAAIOXGAJJW50DkblSZwUZ5ofywABWesrFgAC8QADHZ-JV8GRgHSfTY8GHgQ
      }catch(error){
        return util.error_log(ctx,error)
      }
    },
  id : async function (ctx){
    try{
    if(ctx.message.chat.type == 'private'){
      return util.kirimpesan(ctx,`ID : ${ctx.message.chat.id}`)
    }
    if(ctx.message.reply_to_message){
      return util.kirimpesan(ctx,`ChatID : ${ctx.message.chat.id}\nUserID: ${ctx.message.reply_to_message.from.id}`)
    }else{
      return util.kirimpesan(ctx,`ChatID : ${ctx.message.chat.id}\nUserID: ${ctx.message.from.id}`)
    }
   }catch(error){
     return util.error_log(ctx,error)
   }
  }
}
module.exports = start_module
