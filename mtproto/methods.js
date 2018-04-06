const telegram = require('./init')

const getChats = async () => {
  const dialogs = await telegram('messages.getDialogs', {
    limit: 50,
  })

  const { chats } = dialogs
  return chats
}

const getFullChat = async (chat_id) => {
  const fullChat = await telegram('messages.getFullChat', {
    chat_id: chat_id
  })

  return fullChat
}

const addChatUser = async (chat_id, user_id) => {
  await telegram('messages.addChatUser', {
    chat_id: chat_id,
    user_id: user_id
  })
}

module.exports = {
  getChats,
  getFullChat,
  addChatUser
}