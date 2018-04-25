const { TelegramAppId, TelegramAppHash } = require('./../config')
const { MTProto } = require('telegram-mtproto')
const { Storage } = require("mtproto-storage-fs")

const config = {
  id  : TelegramAppId,
  hash: TelegramAppHash
}

const api = {
  invokeWithLayer: 0xda9b0d0d,
  layer          : 57,
  initConnection : 0x69796de9,
  api_id         : TelegramAppId,
  app_version    : '1.0.1',
  lang_code      : 'en'
}

const server = { webogram: true, dev: false }
const app = { storage: new Storage('./storage.json')}

const telegram = MTProto({ 
	api, 
	server,  
	app,
})

module.exports = {
  telegram,
  config
}  