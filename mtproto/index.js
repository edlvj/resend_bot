const login = require('./login')
const { getChats, getFullChat, addChatUser } = require('./methods')

const run = async () => {
  /*const first_name =*/
  //await login()
  // const res = await searchUsers()
  // await updateProfile(first_name)
  
  //    id: 1155234907, title: 'test_channel',
  // id: 255217342, title: 'test_group',

  //const chat = await getChats()
  //console.log(chat)
 const chatFull = await getFullChat(1155234907)
  console.log(chatFull.users)
   //210537456,
   // username: 'vlad_egorov',

 //  const myUser = {
	// 	_: 'inputUser',
	// 	user_id: 210537456,
	// 	access_hash: '1717271744168898738'
	// };

 //  await addChatUser(255217342, myUser)

 // 


 // await chatHistory(chat)
}

run()