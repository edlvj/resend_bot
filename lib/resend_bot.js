var Bot = require('telegram-api').default;
const Message = require('telegram-api/types/Message');
const { TelegramBotApiKey } = require('./config');

var bot = new Bot({
  token: TelegramBotApiKey
});

Bot.prototype.askQuestion = function(question, message) {
  const msg = new Message().to(message.chat.id).text(question).reply(message.message_id);
  return this.send(msg);
};

Bot.prototype.askKeyboardQuestion = function(question, message) {
  question.to(message.chat.id).reply(message.message_id);
  return this.send(question);
};

module.exports = bot;

bot.start();