const bot = require('./../resend_bot');
const Message = require('telegram-api/types/Message');

bot.command('start', function(message) {
  var answer = new Message().text('Hello, I am group resend and invite bot.').to(message.from.id);
  bot.send(answer);
});