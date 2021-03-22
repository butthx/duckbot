const util = require('./util')
const { lang } = require('./lang/language')

const loop = {
loopText : async function echo(ctx){
    try {
     let msg = ctx.message
     let spl = msg.text.split(' ')
     let count = Number(spl[1])
     let psl = spl[2] || "\n"
     if((count !== " " || count !== null || count !== 0 || count !== undefined || count > 1)&&(msg.reply_to_message)){
        let text = msg.reply_to_message.text;
        let hasil = "";
         for (i = 0; i < count; i++) {
           hasil += `${text}${psl}`;
        }
        if(hasil.length < 4097){
         return util.kirimpesan(ctx,hasil)
        }
      }
    }catch (error){
      return util.error_log(ctx,error)
    }
  }
}

module.exports = loop