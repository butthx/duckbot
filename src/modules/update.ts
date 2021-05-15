import {
  exec
} from 'child_process';
import fs from 'fs';
import sudos from './database/sudos';
import {
  replyToMessage,
  reportError,
  parseBoolean
} from './misc';

export default async function update(ctx) {
  try {
    let sudo = await sudos.findOne({
      user: 'sudo'
    });
    if (sudo == null) return replyToMessage(ctx, 'command failed!');
    let data = sudo.value;
    if (!data.includes(ctx.from.id))
      return replyToMessage(ctx, 'command failed!');
    let beta = await parseBoolean(process.env['BETA']);
    let results = '';
    let done = [];
    let msg = await replyToMessage(ctx, "Updating script..")
    if (beta) {
      await exec('git pull origin dev', (err, stdout, stderr) => {
        results += '\n> git pull origin dev\n';
        if (err) {
          results += err.stack;
        }
        if (stdout) {
          results += stdout;
        }
      });
    } else {
      await exec('git pull origin master', (err, stdout, stderr) => {
        results += '\n> git pull origin master\n';
        if (err) {
          results += err.stack;
        }
        if (stdout) {
          results += stdout;
        }
      });
    }
    await exec('yarn install',
      (err, stdout, stderr) => {
        results += '\n> yarn install\n';
        if (err) {
          results += err.stack;
        }
        if (stdout) {
          results += stdout;
        }
      });
    await exec('yarn build',
      (err, stdout, stderr) => {
        results += '\n> yarn build\n';
        let e = false;
        if (err) {
          results += err.stack;
        }
        if (stdout) {
          results += stdout;
        }
        if (!e) {
          results += `\nSuccessfully updated script. Please restart the application to get the results.`;
        }
        return ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, results)
      });
  } catch (error) {
    replyToMessage(ctx,
      'command failed!');
    return reportError(error,
      ctx);
  }
}