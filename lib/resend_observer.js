const Base = require('telegram-api/types/Base');
const { Publisher } = require('./storage/index');
const { getChatId } = require('./utils');
const bot = require('./resend_bot');

const TYPES = ['Message', 'Photo', 'Document', 'Video', 'Audio', 'Voice'];

bot.on('update', update => {
  for(var i = 0; i < update.length; i++) {
    let message = update[i].message;
    
    //ecxept commands and private chats
    if(message.entities || message.chat.type == 'private')
      return;

    onUpdate(message);
    
  }
});

const onUpdate = async(message) => {
  let chat_id = Math.abs(message.chat.id);

  let publishers = await Publisher.find({from_chat: chat_id}).exec();
  let answer = handleMessage(message);
  
  if(answer) {
    publishers.forEach(function(publisher) {
      let to_chat_id = getChatId(publisher.to_chat_type, publisher.to_chat);
      answer.setProperties({ chat_id: to_chat_id });
      bot.send(answer);
    }); 
  }
}

const handleMessage = function (msg) {
  for(var i = 0; i < TYPES.length; i++) {
    var mProperty = msgProperty(TYPES[i]);
    
    if(msg.hasOwnProperty(mProperty)) {
      var element = new Base('send'+ TYPES[i]);
      element._keyboard = element;
    
      var property = resendProperty(TYPES[i], msg);
      element.setProperties(property);
      return element;
    }
  }
}

const msgProperty = function(type) {
  if(type == 'Message') {
    return 'text';
  } else {
    return type.toLowerCase();
  }
}

const resendProperty = function(type, msg) {
  let property = {};
  
  if(type == 'Photo') {
    property['photo'] = msg.photo[msg.photo.length - 1].file_id;
  } else if(type == 'Message') {
    property['text'] = msg['text'];
  } else {
    property[type.toLowerCase()] = msg[type.toLowerCase()].file_id;
  }
  return property;
}