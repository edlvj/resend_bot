var Bot = require('telegram-api').default;
var Message = require('telegram-api/types/Message');
const messageFactory = require('./message_factory');

const { TelegramBotApiKey, DatabasebUrl } = require('./config');
const { getChats, getFullChat, addChatUser } = require('./mtproto/methods');
const { Publisher, InviteLog } = require('./db');

//default user can do 50 invites
const MAX_INVITE = 50;

var bot = new Bot({
  token: TelegramBotApiKey
});

bot.start();

bot.on('update', update => {
  console.log(update[0].message)
 // if(update.message.entities != undefined)
   // return;
  messageFactory(bot, update.message);
});

bot.get(/(.+)/, function(message) {
  var answer = new Message().text('Its all your chat').to(message.chat.id);
  console.log(message)

  bot.send(answer);
});

bot.command('chats', function(message) {
  getChats().then(function(chats) {
    for( var i = 0; i < chats.length; i++) {
    // chats.map(function(chat) {
      var answer = new Message().text(`${chats[i].id} - ${chats[i].title}`).to(message.from.id);
      bot.send(answer);
    // });
      }
  });
});

bot.command('add_publisher <from_chat> <to_chat>', function(msg) {
  var newPublisher = new Publisher({from_chat: msg.args.from_chat, to_chat: msg.args.to_chat});

  newPublisher.save((err, publisher) => {
    var answer = new Message().text('Publisher added').to(msg.from.id);
    bot.send(answer);
  });
});

bot.command('publishers', function(msg) {
  Publisher.find({}).exec((err, publishers) => {
    for( var i = 0; i < publishers.length; i++) {
      var answer = new Message().text(`${publishers[i].id}: ${publishers[i].from_chat} ${publishers[i].to_chat} `).to(msg.from.id);
      bot.send(answer);
    }
  });
});

bot.command('drop_publisher <publisher_id>', function(msg) {
  Publisher.find({}).exec((err, publishers) => {
  	for( var i = 0; i < publishers.length; i++) {
  	  var answer = new Message().text(`${publishers[i].id}: ${publishers[i].from_chat} ${publishers[i].to_chat} `).to(msg.from.id);
      bot.send(answer);
    }
  });
});

bot.command('invite_users <from_group> <to_group>', function(msg) {
	getFullChat(msg.args.from_group).then(function(chatFull) {
		var users = chatFull.users;
		var inviteCount = users.length < 50 ? chatFull.users.length : 50;
		
		for(var i = 0; i <= inviteCount; i++) {
	    var inputUser = {
	      _: 'inputUser',
	      user_id: users[i].id,
	      access_hash: users[i].access_hash
		  };
      addChatUser(msg.args.to_group, inputUser);
      //log
    }  
	});

  //get users from from_group
  //invite to 

  //add log
  //max 50

})