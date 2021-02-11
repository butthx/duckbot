const { Markup } = require("telegraf");
const util = require("./util");
const eval_module = {
  telegraf: async function(ctx) {
    try {
      if (ctx.message.chat.id !== -1001492226458) {
        return util.kirimpesan(
          ctx,
          "Chat owner to get access to this feature!"
        );
      }
      if(/\.env|dotenv|process\.env|process\.env\.|mongoose|db|save|find|findeAll|findOne|findAndDelete|findAndUpdate/gmi){
        return util.kirimpesan(
          ctx,
          `Cannot Acces ${ctx.message.text}`
        );
      }
      let func = ctx.message.text.split(" ");
      let def = ctx.message.text.replace(func[0], "").trim();
      if (def == "") {
        util.kirimpesan(ctx, "/tele &lt;telegraf function&gt;");
      } else {
        if (/console\.log/gim.exec(def)) {
          def = def.replace(/console\.log/gim, "ctx.reply");
        }
        return eval(
          `(async () => {try{${def}}catch(e){ctx.reply(e.message)}})()`
        );
      }
    } catch (e) {
      return ctx.reply(e.message);
    }
  }
};

module.exports = eval_module;
