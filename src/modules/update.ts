import {exec} from 'child_process';
import fs from 'fs';
import sudos from './database/sudos';
import {replyToMessage, reportError, parseBoolean, getPing} from './misc';

export default async function update(ctx) {
  let c = await getPing(ctx);
  try {
    let sudo = await sudos.findOne({
      user: 'sudo',
    });
    if (sudo == null) {
      return replyToMessage(
          ctx,
          `command failed!\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
      );
    }
    let data = sudo.value;
    if (!data.includes(ctx.from.id)) {
      return replyToMessage(
          ctx,
          `command failed!\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
      );
    }
    let beta = await parseBoolean(process.env['BETA']);
    let results = '';
    let msg = await replyToMessage(
        ctx,
        `Updating script..\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
    );
    if (beta) {
      await exec('sh ./download/update-beta.sh', async (err, stdout, stderr) => {
        if (err) {
          results += err;
        }
        if (stdout) {
          results += stdout;
        }
      });
      results += `\nSuccessfully updated script. Please restart the application to get the results.\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(
          ctx,
      )}</code>`;
      return ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, results);
    } else {
      await exec('sh ./download/update-stable.sh', async (err, stdout, stderr) => {
        if (err) {
          results += err;
        }
        if (stdout) {
          results += stdout;
        }
      });
      results += `\nSuccessfully updated script. Please restart the application to get the results.\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(
          ctx,
      )}</code>`;
      return ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, results);
    }
  } catch (error) {
    replyToMessage(
        ctx,
        `command failed!\n⏱ <code>${c}</code> | ⏳ <code>${await getPing(ctx)}</code>`,
    );
    return reportError(error, ctx);
  }
}
