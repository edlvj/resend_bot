const Base = require('telegram-api/types/Base');
const { Publisher } = require('./storage/index');
const { getChatId } = require('./utils');

const TYPES = ['Message', 'Photo', 'Document', 'Video', 'Audio', 'Voice'];

bot.on('update', update => {
  for(var i = 0; i < update.length; i++) {
    var message = update[i].message;

    if(message.entities)
      return;
    
    if(message.chat.type == 'group') {
      Publisher.find({from_chat: Math.abs(message.chat.id)}).exec((err, publishers) => {
        
        publishers.forEach(function(publisher) {
          var answer = handleMessage(message);

          if(answer) {
            var to_chat_id = getChatId(publisher.to_chat_type, publisher.to_chat);
            answer.setProperties({ chat_id: to_chat_id });
            
            bot.send(answer);
          }  
        });  
      });  
    }
  }
});

let handleMessage = function (msg) {
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

let msgProperty = function(type) {
  if(type == 'Message') {
    return 'text';
  } else {
    return type.toLowerCase();
  }
}

let resendProperty = function(type, msg) {
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
