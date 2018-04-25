const { sendCode, signIn } = require('./../mtproto/methods');
const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');

bot.command('auth', message => {
  auth().then(resp => {
    let msg = new Message().to(message.chat.id);
    
    if(resp.user) {
      msg = msg.text('You are logged.');
    } else {
      msg = msg.text('Try again');
    }         
    bot.send(msg);
  })
});

const auth = async(message) => {
  const answerPhone = bot.askQuestion('Enter your phone(+380xxxxxxxx):', message);
  let phone = answerPhone.text;
  
  let resCode = await sendCode(phone);
  
  const answerCode = bot.askQuestion('Enter your code:', message);
  let code = answerCode.text;

  return await signIn(phone, code, resCode);
}

module.exports = auth;