const { telegram, config } = require('./index')

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

const sendCode = async (phone) => {
  const { phone_code_hash } = await telegram('auth.sendCode', {
    phone_number  : phone,
    current_number: false,
    api_id        : config.id,
    api_hash      : config.hash
  })

  return phone_code_hash
}

const signIn = async (phone, code, phone_code_hash) => {
  const res = await telegram('auth.signIn', {
    phone_number: phone,
    phone_code_hash: phone_code_hash,
    phone_code: code
  })
  return res
}

const getParticipants = async (inputChannel, options) => {
  const participants = await telegram('channels.getParticipants', {
    channel: inputChannel,
    filter: { _: 'channelParticipantsRecent' },
    offset: options["offset"],
    limit: options["limit"]
  })
  return participants
}

const inviteToChannel = async (inputChannel, users) => {
  const res = await telegram('channels.inviteToChannel', {
    channel: inputChannel,
    users: users
  })
  return users
}

const logOut = async () => {
  const res = await telegram('auth.logOut')
  return res
}

module.exports = {
  getChats,
  getFullChat,
  addChatUser,
  sendCode,
  signIn,
  logOut,
  getParticipants,
  inviteToChannel
}