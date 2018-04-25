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

// bot.command('start', function(message) {
//   var answer = new Message().text('Hello, I am group resend and invite bot.').to(message.from.id);
//   bot.send(answer);
// });

// bot.command('add', message => {
//   var newPublisher = new Publisher();

//   getChats().then(chats => {

//     console.log(chats);

//     var chats = chats.filter(function(chat) {
//       return isGroup(chat) || isMegaGroup(chat);
//     });

//     var pubChatTitles = chats.map(chat => {
//       return new Array(chat.title);
//     });

//     const choose_publisher = new Question({
//       text: 'Choose publisher group',
//       answers: pubChatTitles
//     });

//     askKeyboardQuestion(choose_publisher, message).then(answer => {
//       var from_chat = chats.find(chat => chat.title === answer.text);

//       newPublisher.from_chat = from_chat.id;
//       newPublisher.from_chat_type = from_chat._;

//       var subChatTitles = chats.map(chat => {
//         if(chat.id != newPublisher.from_chat)  
//           return new Array(chat.title);
//       }).filter(function(chat) {
//         return chat;
//       });

//       const choose_subsciber = new Question({
//         text: 'Choose subscriber group',
//         answers: subChatTitles
//       });

//       askKeyboardQuestion(choose_subsciber, message).then(answer => {
//         var to_chat = chats.find(chat => chat.title === answer.text);

//         newPublisher.to_chat = to_chat.id;
//         newPublisher.to_chat_type = to_chat._;

//         newPublisher.save((err, publisher) => {
//           var answer = new Message().text('Record added').to(message.from.id);
//           bot.send(answer);
//         });
//       });
//     });
//   });

// });

// bot.command('drop', function(message) {
//   getChats().then(chats => {
//     var publishersList = [];  
    
//     Publisher.find({}).exec((err, publishers) => {
      
//       publishers.forEach(function(publisher,index ) {
//         var from_chat = chats.find(chat => chat.id === parseInt(publisher.from_chat));
//         var to_chat = chats.find(chat => chat.id === parseInt(publisher.to_chat));
//         publishersList.push({id: publisher.id, title: from_chat.title + ' => ' + to_chat.title });
//       });

//       var selectPublisher = publishersList.map((publisher, index) => {
//         return new Array(publisher.title);
//       });

//       const choose_publisher = new Question({
//         text: 'Choose publisher:',
//         answers: selectPublisher
//       });
      
//       askKeyboardQuestion(choose_publisher, message).then(answer => {
//         var publisher = publishersList.find(publisher => publisher.title === answer.text);

//         Publisher.remove({_id : publisher.id}, (err, result) => {
//           var answer = new Message().text('Publisher destroyed.').to(message.from.id);
//           bot.send(answer);
//         });
//       });
//     });     
//   });   
// });

// bot.command('invite', function(message) {
//   getChats().then(chats => {
//     var inviteChats = chats.filter(function(chat) {
//       return isGroup(chat) || isMegaGroup(chat);
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
      
//       var toChatTitles = inviteChats.map(chat => {
//         if(chat.id != from_chat.id)  
//           return new Array(chat.title);
//       }).filter(function(chat) {
//         return chat;
//       });

//       const choose_to_invite = new Question({
//         text: 'Choose to invite group',
//         answers: toChatTitles
//       });

//       askKeyboardQuestion(choose_to_invite, message).then(answer => {
//         var to_chat = chats.find(chat => chat.title === answer.text);
//         inviteUsers(from_chat, to_chat).then(count => {
//           const msg = new Message().to(message.chat.id).text(count + ' invitations have been sent');
//           bot.send(msg);
//         }).catch(err => {
//           const msg = new Message().to(message.chat.id).text(err.message);
//           bot.send(msg);
//         });
//       });  
//     });
//   });
// });

// bot.command('auth', message => {
//   askQuestion('Enter your phone:', message).then(msg => {
//     var phone = msg.text;
//     sendCode(phone).then(resp => {
//       askQuestion('Enter your code:', message).then(msg => {
//         var code = msg.text;

//         signIn(phone, code, resp).then(resp => {
//           var msg = new Message().to(message.chat.id);
          
//           if(resp.user) {
//             msg = msg.text('You are logged.');
//           } else {
//             msg = msg.text('Try again');
//           }         
//           bot.send(msg);
//         })
//       });
//     });  
//   });
// });

