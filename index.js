var Bot = require('telegram-api').default;
var Message = require('telegram-api/types/Message');

const resendFactory = require('./resend_factory');
const { TelegramBotApiKey, DatabasebUrl } = require('./config');
const { getChats, getFullChat, addChatUser } = require('./mtproto/methods');
const { Publisher, InviteLog } = require('./db');

//default user can do 50 invites
const MAX_INVITE = 50;

var bot = new Bot({
  token: TelegramBotApiKey
});

var rFactory = new resendFactory();
bot.start();

bot.on('update', update => {
  for(var i = 0; i < update.length; i++) {
    if(update[i].message.entities)
      return;
    
    var answer = rFactory.handle(update[i].message);
    
    if(answer)
      bot.send(answer);
  }
});

bot.command('chats', function(message) {
  getChats().then(function(chats) {
    for(var i = 0; i < chats.length; i++) {
      //save if not exist
      var answer = new Message().text(chats[i].id + '-' + chats[i].title).to(message.from.id);
      bot.send(answer);
    }
  });
});

bot.command('add <from_chat> <to_chat>', function(msg) {
  var newPublisher = new Publisher({from_chat: msg.args.from_chat, to_chat: msg.args.to_chat});
   
  newPublisher.save((err, publisher) => {
    var answer = new Message().text('Publisher added').to(msg.from.id);
    bot.send(answer);
  });
});

bot.command('list', function(msg) {
  Publisher.find({}).exec((err, publishers) => {
    if(publishers.length == 0) {
      var answer = new Message().text('No publishers').to(msg.from.id);
      bot.send(answer);
    } else {
      for(var i = 0; i < publishers.length; i++) {
        var answer = new Message().text('ID: ' + publishers[i].id + ' From: ' + publishers[i].from_chat + ' To: ' + publishers[i].to_chat).to(msg.from.id);
        bot.send(answer);
      }
    }  
  });
});

bot.command('drop <publisher_id>', function(msg) {
  Publisher.findById(msg.args.publisher_id, (err, page) => {
    Publisher.remove({_id : msg.args.publisher_id}, (err, result) => {
      var answer = new Message().text('Publisher destroyed.').to(msg.from.id);
      bot.send(answer);
    });
  });
});

bot.command('invite <from_group> <to_group>', function(msg) {
  getFullChat(msg.args.from_group).then(function(chatFull) {
    var users = chatFull.users.filter(function(user) {
      return !user.hasOwnProperty('bot') && !user.hasOwnProperty('self');
    });

    var inviteCount = users.length < 50 ? users.length : 50;

    console.log(users);
    console.log(inviteCount);

    if(inviteCount <= 0) {
      var answer = new Message().text('No have members.').to(msg.from.id);
      bot.send(answer);
      return;
    }
    
    for(var i = 0; i <= inviteCount; i++) {
      var inputUser = {
        _: 'inputUser',
        user_id: users[i].id,
        access_hash: users[i].access_hash
      };
      console.log(users[i]);

      //addChatUser(msg.args.to_group, inputUser);
      //log

      //message added 50 from groups;
    }  
  });

  //get users from from_group
  //invite to 

  //add log
})


bot.command('start', function(message) {
  var answer = new Message().text('Hello, I am group resend bot. Enter /help .').to(message.from.id);
  bot.send(answer);
});

bot.command('help', function(message) {
  var answer = new Message().text('/chats List of chats \n/list List of').to(message.from.id);
  bot.send(answer);
});