var Base = require('telegram-api/types/Base');

var resendFactory = function () {
  const TYPES = ['Message', 'Photo', 'Document', 'Video', 'Audio', 'Voice'];

  this.handle = function (msg) {
    for(var i = 0; i < TYPES.length; i++) {
      var mProperty = msgProperty(TYPES[i]);
      
      if(msg.hasOwnProperty(mProperty)) {
        var element = new Base('send'+ TYPES[i]);
        element._keyboard = element;
      
        var property = resendProperty(TYPES[i], msg);
        element.setProperties(property);
        return element;
      }
    }
  }

  var msgProperty = function(type) {
    if(type == 'Message') {
      return 'text';
    } else {
      return type.toLowerCase();
    }
  }

  var resendProperty = function(type, msg) {
    let property = {};
    
    if(type == 'Photo') {
      property['photo'] = msg.photo[msg.photo.length - 1].file_id;
    } else if(type == 'Message') {
      property['text'] = msg['text'];
    } else {
      property[type.toLowerCase()] = msg[type.toLowerCase()].file_id;
    }
    return property;
  }
}

module.exports = resendFactory;