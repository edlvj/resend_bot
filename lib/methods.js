const { getFullChat, addChatUser, getParticipants, inviteToChannel } = require('./mtproto/methods');
const { isMegaGroup, isGroup } = require('./utils');
const { inviteLog } = require('./storage/index');
const inviteFactory = require('./resend_observer');


const getInfoFromGroup = function (chat, options) {
  if(isGroup(chat)) {
    return getFullChat(chat.id);
  } 

  if(isMegaGroup(chat)) {
    let inputChannel = {
      _: 'inputChannel',
      channel_id: chat.id,
      access_hash: chat.access_hash
    };
    return getParticipants(inputChannel, options);
  }
  return Promise.reject(new Error('Wrong chat type'));
};

const chatFilter = function(chats) {
  let res = chats.filter(function(chat) {
    return chat._ == 'chat' || chat.hasOwnProperty('megagroup');
  });
  return res;
}

const userFilter = function(users) {
  let res = users.filter(function(user) {
    return !user.hasOwnProperty('bot') && !user.hasOwnProperty('self');
  });

  return res;
}

const maxInvited = function(inviteLog, chat) {
  if(!inviteLog.invited_count)
    return false; 

  if(isGroup(chat)) {
    return inviteLog.invited_count > chat.users.length; 
  }

  if(isMegaGroup(chat)) {
    return inviteLog.invited_count > chat.count;
  }
  
  return false;
}

Array.prototype.each_slice = function (size, callback){
  for (var i = 0, l = this.length; i < l; i += size){
    callback.call(this, this.slice(i, i + size));
  }
};

const inviteUsers = async(from, to, limit = 300) => {
  let inviteLogProperties = {
    from_chat_id: from.id,
    to_chat_id: to.id
  };

  const iLog = await inviteLog.findOne(inviteLogProperties);
  var offset = iLog ? iLog.invited_count : 0;
  var chat = await getInfoFromGroup(from, { limit: limit, offset: offset });
  
  if(iLog && maxInvited(iLog, chat))
    return Promise.reject(new Error('You reached max invites'));

  var users = userFilter(chat.users);

  var inviteCount = users.length < limit ? users.length : limit;
  var i = 0;

  // if(isGroup(to)) {
  //   while (i < inviteCount) {
  //     try {
  //       let inviteFactory = new inviteFactory(to, users[i]);
  //       await inviteFactory.toGroup();
  //     } catch(e) {
  //       console.log(e.message)
  //     }
  //     await inviteLog.updateOne(inviteLogProperties, { $inc: {"invited_count": 1 } }, {upsert: true, new: true});
  //     i++;
  //   }
  // }

  if(isMegaGroup(to)) {
    let inputUsers = [];

    while(i < inviteCount) {
      let inputUser = {
        _: 'inputUser',
        user_id: users[i].id,
        access_hash: users[i].access_hash
      };

      inputUsers.push(inputUser);
      i++;
    }

    let inviteFactory = new inviteFactory(to, inputUsers);
    
    try {
    //  .each_slice(10, function (slice){
        inviteFactory.toMegaGroup(to, inputUsers);
     // });
      await inviteLog.updateOne(inviteLogProperties, { $inc: {"invited_count": inputUsers.length } }, {upsert: true, new: true});
    } catch(e) {
      console.log(e.message)
    }
  }  
  return i;
}

module.exports = {
  inviteUsers,
  getInfoFromGroup,
  chatFilter
};