const { getFullChat, addChatUser, getParticipants, inviteToChannel } = require('./../mtproto/methods');
const { isMegaGroup, isGroup } = require('./utils');

var getInfoFromGroup = function (chat, limit = 10) {
  console.log("zashlo");
  if(isGroup(chat)) {
    console.log(getFullChat(chat.id));
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

var intiteUserToGroup = function(chat, user) {
  var inputUser = {
    _: 'inputUser',
    user_id: user.id,
    access_hash: user.access_hash
  };

  if(isGroup(chat)) {
    return addChatUser(chat.id, inputUser);
  } 
  
  if (isMegaGroup(chat)) {
    let inputChannel = {
       _: 'inputChannel',
      channel_id: chat.id,
      access_hash: chat.access_hash
    };

    console.log('inviteToChannel')
    console.log(inputUser)

    return inviteToChannel(inputChannel, [inputUser]);
  }

  return false;
}

var inviteUsers = function(from, to, limit = 10) {
  var inviteLogProperties = {
    from_chat_id: from.id,
    to_chat_id: to.id
  };

  getInfoFromGroup(from, limit).then(function(chat) {
    // var startFrom = 0;

    // inviteLog.count(inviteLogProperties, function(err, count) {
    //   startFrom = chats.users.length - count;
    // });
    
    // users = chat.users.slice(startFrom, chat.users.length);

    var users = users.filter(function(user) {
      return !user.hasOwnProperty('bot') && !user.hasOwnProperty('self');
    });

    var inviteCount = users.length < limit ? users.length : limit;

    if(inviteCount <= 0)
      return;

    var i = 1;

    while (i < inviteCount - 1) {
     // console.log(i);
      console.log(users[i].id)

      inviteLog.findOne(inviteLogProperties).exec((err, inviteLog) => {
        console.log(inviteLog);
        if(!inviteLog) {
          console.log('send');
          console.log(users[i]);
          // intiteUserToGroup(to, users[i]).catch(err => {
          //   console.log(err);
          // });
            //inviteLogProperties.user_id = users[i].id
           // new InviteLog(inviteLogProperties).save();
        }
      });

      i++;
    }
 });
}

module.exports = {
  inviteUsers,
  getInfoFromGroup,
  intiteUserToGroup
};