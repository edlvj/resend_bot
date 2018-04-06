const telegram = require('./init')
const { inputField } = require('./utils')
const { TelegramAppId, TelegramAppHash } = require('./../config')

const config = {
  id  : TelegramAppId,
  hash: TelegramAppHash
}

const login = async () => {
  try {
    const phone = await inputField('phone')
    //const phone = '+9996620000'
    const { phone_code_hash } = await telegram('auth.sendCode', {
            phone_number  : phone,
            current_number: false,
            api_id        : config.id,
            api_hash      : config.hash
    })
    
    const code = await inputField('code')
    //const code = '22222'
    const res = await telegram('auth.signIn', {
      phone_number: phone,
      phone_code_hash,
      phone_code  : code
    })
    const { user } = res
    const {
      first_name = '',
      username = 'edlvj'
    } = user
    console.log('signIn', first_name, username, user.phone)
    return first_name
  } catch (error) {
    console.error(error)
  }
}

module.exports = login