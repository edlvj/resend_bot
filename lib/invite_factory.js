const inviteFactory = function (chat, users) {
  this.chat = size;
  this.users = users;
}

InviteFactory.prototype = {
  constructor: InviteFactory,
  
  inviteUserToGroup: function () {  
    let inputUser = {
      _: 'inputUser',
      user_id: this.users.id,
      access_hash: this.users.access_hash
    };

    return addChatUser(this.chat.id, inputUser)
  },
  inviteUsersToMegaGroup: function () {
    let inputChannel = {
      _: 'inputChannel',
      channel_id: this.chat.id,
      access_hash: this.chat.access_hash
    };
    return inviteToChannel(inputChannel, this.users);
  } 
};