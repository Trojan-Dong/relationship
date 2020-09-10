let websocket = null
// const WSHOST = 'ws://www.donguju.com'
const WSHOST = 'ws://localhost'
let friendCollection = null

export function connection (username, friendList) {
  friendCollection = friendList
  if ('WebSocket' in window) {
    websocket = new WebSocket(WSHOST + '/relationship/websocket/' + username)
    initWebSocket()
  } else {
    alert('当前浏览器 Not support websocket')
  }
  return websocket
}

function initWebSocket () {
  // 连接错误
  websocket.onerror = setErrorMessage

  // 连接成功
  websocket.onopen = setOnopenMessage

  // 收到消息的回调
  websocket.onmessage = setOnmessageMessage

  // 连接关闭的回调
  websocket.onclose = setOncloseMessage

  // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
  window.onbeforeunload = onbeforeunload
}

function setErrorMessage () {
  console.log('WebSocket连接发生错误   状态码：' + websocket.readyState)
}

function setOnopenMessage () {
  console.log('WebSocket连接成功    状态码：' + websocket.readyState)
}

function setOnmessageMessage (event) {
  console.log(friendCollection)
  // 根据服务器推送的消息做自己的业务处理
  for (var i = 0; i < friendCollection.length; i++) {
    var message = JSON.parse(event.data)
    for (var key in message) {
      if (friendCollection[i].friendId == key) {
        friendCollection[i].lastMsg=message[key].text;
        friendCollection[i].msgCount+=1;
      }
    }

  }
  console.log('服务端返回：' + event.data)

}

function setOncloseMessage () {
  console.log('WebSocket连接关闭    状态码：' + websocket.readyState)
}

function onbeforeunload () {
  closeWebSocket()
}

function closeWebSocket () {
  websocket.close()
}

