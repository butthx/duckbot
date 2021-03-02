const util = require('./util')
const { lang } = require('./lang/language')
const report_module = require('./admin')
const pin_module = {
    checkpin: async function (ctx) {
        try {
            //running function
            if (ctx.message.chat.username === undefined) {
                let msg_id = ctx.message.pinned_message.message_id;
                let chat_id = String(ctx.message.chat.id);
                let spl = chat_id.replace("-100", "").trim();
                let pesan = await util.getLang(ctx,'newPin')
                url = `https://t.me/c/${spl}/${msg_id}`;
                pesan += `\n<code>${new Date().toUTCString()}</code>`;
               return util.kirimPesanPin(ctx,pesan,[[{ text: `📌 ${await util.getLang(ctx,'newPinButton')}`, url: url }]])
            } else {
                let username = ctx.message.chat.username;
                let msg_id = ctx.message.pinned_message.message_id;
                let pesan = await util.getLang(ctx,'newPin')
                let url = `https://t.me/${username}/${msg_id}`;
                pesan += `\n<code>${new Date().toUTCString()}</code>`;
               return util.kirimPesanPin(ctx,pesan,[[{ text: `📌 ${await util.getLang(ctx,'newPinButton')}`, url: url }]])
            }
        } catch (error) {
            return util.error_log(ctx,error)
        }
    },
    pinnedMessage : async function(ctx){
      try{
          //running function
        //check bot admin or not
         let botAdmin = report_module.adminCheck(ctx,ctx.botInfo.id)
         if(!botAdmin){
           return ;
         }
            //running process
        if(ctx.message.reply_to_message){
          if(rpl.toLowerCase() == 'loud'){
           return ctx.pinChatMessage(ctx.message.reply_to_message.message_id,{disable_notification : false})
          }
           return ctx.pinChatMessage(ctx.message.reply_to_message.message_id,{disable_notification : true})
        }else{
          return util.kirimPesanPin(ctx,`${await util.getLang(ctx,'mustReply')}`)
        }
      }catch(error){
        console.log(error) 
       // return util.error_log(ctx,error)
      }
    },
    unpinMessage : async function(ctx){
      try{
        //config language
        let language = 'en'
            if (ctx.message.from.language_code && lang[ctx.message.from.language_code]) {
                language = ctx.message.from.language_code.toLowerCase()
            }
        let spl = ctx.message.text.split(' ')
        let rpl = ctx.message.text.replace(spl[0],'').trim()
        let getChat = await ctx.getChat()
          //running function
        if(getChat.pinned_message == undefined){
           return util.kirimPesanPin(ctx,lang[language].noPin)
         }
         let botAdmin = report_module.adminCheck(ctx,ctx.botInfo.id)
         let admin = report_module.adminCheck(ctx,ctx.message.from.id)
         if(!botAdmin){
           return ;
         }
         if(!admin){
           return ;
         }
        //check reply to message or not
        if(ctx.message.reply_to_message){
          let msg_id = ctx.message.reply_to_message.message_id
          return ctx.unpinChatMessage(msg_id)
        }
        //check unpin all or not
        if(rpl.toLowerCase() == 'all'){
          return util.kirimPesanPin(ctx, lang[language].unpinAll,[[{text:lang[language].yes,callback_data : 'unpinall yes'},{text:lang[language].no,callback_data : 'unpinall no'}]])
        }
       return ctx.unpinChatMessage()
    }catch(error){
     return util.error_log(ctx,error)
    }
   }
}

module.exports = pin_module
