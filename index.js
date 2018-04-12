var Bot = require('telegram-api').default;
var Message = require('telegram-api/types/Message');

const { TelegramBotApiKey } = require('./config');
const { getChats, getFullChat, addChatUser, sendCode, signIn, getParticipants } = require('./mtproto/methods');
const { Publisher, InviteLog } = require('./storage');

var Question = require('telegram-api/types/Question');
const resendFactory = require('./lib/resend_factory');

var bot = new Bot({
  token: TelegramBotApiKey
});

var rFactory = new resendFactory();

bot.start();

bot.on('update', update => {
  for(var i = 0; i < update.length; i++) {
    var message = update[i].message;
    
    if(message.entities)
      return;
    
    if(message.chat.type == 'group') {
      Publisher.find({from_chat: Math.abs(message.chat.id)}).exec((err, publishers) => {
        
        publishers.forEach(function(publisher) {
          var answer = rFactory.handle(message);

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

bot.command('start', function(message) {
  var answer = new Message().text('Hello, I am group resend and invite bot.').to(message.from.id);
  bot.send(answer);
});

bot.command('chats', message => {
  getChats().then(chats => {

    var chats = chats.filter(function(chat) {
      return chat._ == 'chat' || chat.hasOwnProperty('megagroup');
    });

    console.log(chats);

    var chatTitles = chats.map(chat => {
      return chat.title;
    }).join('\n');

    var answer = new Message().to(message.from.id).text(chatTitles);
    bot.send(answer).catch(err => {
      console.log(err);
    });

  }).catch(err => {
    console.log(err);
    const msg = new Message().to(message.from.id).text('Something went wrong.');
    bot.send(msg);
  });
});

bot.command('add', message => {
  var newPublisher = new Publisher();

  getChats().then(chats => {

    var chats = chats.filter(function(chat) {
      return chat.hasOwnProperty('creator');
    });

    var pubChatTitles = chats.map(chat => {
      return new Array(chat.title);
    });

    const choose_publisher = new Question({
      text: 'Choose publisher group',
      answers: pubChatTitles
    });

    askKeyboardQuestion(choose_publisher, message).then(answer => {
      var from_chat = chats.find(chat => chat.title === answer.text);

      newPublisher.from_chat = from_chat.id;
      newPublisher.from_chat_type = from_chat._;

      var subChatTitles = chats.map(chat => {
        if(chat.id != newPublisher.from_chat)  
          return new Array(chat.title);
      }).filter(function(chat) {
        return chat;
      });

      const choose_subsciber = new Question({
        text: 'Choose subscriber group',
        answers: subChatTitles
      });

      askKeyboardQuestion(choose_subsciber, message).then(answer => {
        var to_chat = chats.find(chat => chat.title === answer.text);

        newPublisher.to_chat = to_chat.id;
        newPublisher.to_chat_type = to_chat._;

        newPublisher.save((err, publisher) => {
          var answer = new Message().text('Record added').to(message.from.id);
          bot.send(answer);
        });
      });
    });
  });  
});

bot.command('list', function(message) {
  getChats().then(chats => {
    var chats = chats.filter(function(chat) {
      return chat.hasOwnProperty('creator');
    });

    Publisher.find({}).exec((err, publishers) => {
      if(publishers.length == 0) {
        var answer = new Message().text('No publishers').to(message.from.id);
        bot.send(answer);
      } else {
        publishers.forEach(function(publisher) {
          var from_chat = chats.find(chat => chat.id === parseInt(publisher.from_chat));
          var to_chat = chats.find(chat => chat.id === parseInt(publisher.to_chat));

          var answer = new Message().text(from_chat.title + ' => ' + to_chat.title).to(message.from.id);
          bot.send(answer);
        });
      }  
    });
  });
});

bot.command('drop', function(message) {
  getChats().then(chats => {
    var publishersList = [];  
    
    Publisher.find({}).exec((err, publishers) => {
      
      publishers.forEach(function(publisher,index ) {
        var from_chat = chats.find(chat => chat.id === parseInt(publisher.from_chat));
        var to_chat = chats.find(chat => chat.id === parseInt(publisher.to_chat));
        publishersList.push({id: publisher.id, title: from_chat.title + ' => ' + to_chat.title });
      });

      var selectPublisher = publishersList.map((publisher, index) => {
        return new Array(publisher.title);
      });

      const choose_publisher = new Question({
        text: 'Choose publisher:',
        answers: selectPublisher
      });
      
      askKeyboardQuestion(choose_publisher, message).then(answer => {
        var publisher = publishersList.find(publisher => publisher.title === answer.text);

        Publisher.remove({_id : publisher.id}, (err, result) => {
          var answer = new Message().text('Publisher destroyed.').to(message.from.id);
          bot.send(answer);
        });
      });
    });     
  });   
});

bot.command('invite', function(message) {
  getChats().then(chats => {
    var inviteChats = chats.filter(function(chat) {
      return chat._ == 'chat' || chat.hasOwnProperty('megagroup');
    });

    var fromChatTitles = inviteChats.map(chat => {
      return new Array(chat.title);
    });

    const choose_from_invite = new Question({
      text: 'Choose from invite group',
      answers: fromChatTitles
    });

    askKeyboardQuestion(choose_from_invite, message).then(answer => {
      var from_chat = inviteChats.find(chat => chat.title === answer.text);
      
      var toChatTitles = inviteChats.map(chat => {
        if(chat.id != from_chat.id)  
          return new Array(chat.title);
      }).filter(function(chat) {
        return chat;
      });

      const choose_to_invite = new Question({
        text: 'Choose to invite group',
        answers: toChatTitles
      });

      askKeyboardQuestion(choose_to_invite, message).then(answer => {
        var to_chat = chats.find(chat => chat.title === answer.text);
        inviteUsers(from_chat, to_chat)
      });  
    });
  });
});

bot.command('auth', message => {
  askQuestion('Enter your phone:', message).then(msg => {
    var phone = msg.text;

    sendCode(phone).then(resp => {

      askQuestion('Enter your code:', message).then(msg => {
        var code = msg.text;

        signIn(phone, code, resp).then(resp => {
          var msg = new Message().to(message.chat.id);
          
          if(resp.user) {
            msg = msg.text('You are logged.');
          } else {
            msg = msg.text('Try again');
          }         
          bot.send(msg);
        }).catch( err => {
          console.log(err);
          const msg = new Message().to(message.chat.id).text('Wrong code. Try Again. /auth');
          bot.send(msg);
        });
      });
    }).catch( err => {
      console.log(err);
      const msg = new Message().to(message.chat.id).text('Wrong phone or format.');
      bot.send(msg);
    });    
  });
});

var askQuestion = function(question, message) {
  const msg = new Message().to(message.chat.id).text(question).reply(message.message_id);
  return bot.send(msg);
};

var askKeyboardQuestion = function(question, message) {
  question.to(message.chat.id).reply(message.message_id);
  return bot.send(question);
};

var getChatId = function(chat_type, chat_id) {
  if(chat_type == "chat"){
    return -Math.abs(chat_id);
  } else if(chat_type == "channel") {
    return parseInt('-100' + chat_id);   
  }
};

var inviteUsers = function(from, to, limit = 10) {
  getInfoFromChat(from, limit).then(function(chat) {

    var users = chat.users.filter(function(user) {
      return !user.hasOwnProperty('bot') && !user.hasOwnProperty('self');
    });

    var inviteCount = users.length < limit ? users.length : limit;

    if(inviteCount <= 0)
      return;

    for(var i = 0; i <= inviteCount; i++) {
      console.log(users[i].id)
      
      var inputUser = {
        _: 'inputUser',
        user_id: users[i].id,
        access_hash: users[i].access_hash
      };

      var inviteLogProperties = {
        user_id: users[i].id,
        from_chat_id: from.id,
        to_chat_id: to.id
      }

      InviteLog.findOne(inviteLogProperties).exec((err, inviteLog) => {
        if(!inviteLog) {
          //console.log(to.id);
          addChatUser(to.id, inputUser).catch(function(err) {
            console.log(err);
          });
          
          var newInviteLog = new InviteLog(inviteLogProperties);
          newInviteLog.save();
        }
      });
    }
 });
}

var isMegaGroup = function(chat) {
  if(chat._ == 'channel' && chat.hasOwnProperty('megagroup')) {
    return true;
  }
  return false
}

var isGroup = function(chat) {
  if(chat._ == 'chat') {
    return true;
  }
  return false;
}

var isChannel = function(chat) {
  if(chat._ == 'channel') {
    return true;
  }
  return false;
}

var getInfoFromChat = function (chat, limit = 10) {
  if(isGroup(chat)) {
    return getFullChat(chat.id);
  } 

  if (isMegaGroup(chat)) {
    let inputChannel = {
       _: 'inputChannel',
      channel_id: chat.id,
      access_hash: chat.access_hash
    };

    return getParticipants(inputChannel, limit);
  }
  return false;
};

// bot.command('aloha', function(message) {
//   getChats().then(chats => {
//     var inviteChats = chats.filter(function(chat) {
//       return chat._ == 'chat' || chat.hasOwnProperty('megagroup');
//     });

//     var fromChatTitles = inviteChats.map(chat => {
//       return new Array(chat.title);
//     });

//     const choose_from_invite = new Question({
//       text: 'Choose from invite group',
//       answers: fromChatTitles
//     });

//     askKeyboardQuestion(choose_from_invite, message).then(answer => {
//       var from_chat = inviteChats.find(chat => chat.title === answer.text);
      
//       var limit = 10;


      
//     });
//   });
// });






//error messages;
//change promises;