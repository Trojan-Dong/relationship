<template>
  <div id="SendMessage">
    <div class="list" v-for="(list,index) in messageList" v-bind:key="index"
         v-bind:class="list.type=='send'?'isSend':'isReceive'" v-scroll>
      <div class="message">
        <div class="messageTime"> {{ list.time|formatDate }}</div>
        <div class="messageText"> {{ list.message }}</div>
      </div>
    </div>
    <div class="bottom">
    </div>
    <div id="send">
      <table>
        <tr>
          <td>
            <input type="text" v-model="message">
            <button v-on:click="sendMessage()">发送</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import {
    formatDate
  } from '../js/date.js'

  export default {
    name: 'SendMessage',
    data () {
      return {
        userId:'',
        userName: '',
        receiver: {},
        messageList: [],
        message: '',
        user: {}
      }
    },
    methods: {
      connection: function () {
        if ('WebSocket' in window) {
          this.websocket = new WebSocket(this.WSHOST+'/relationship/websocket/' + this.userId)
          this.initWebSocket()
        } else {
          alert('当前浏览器 Not support websocket')
        }
      },
      sendMessage () {
        var page = this
        var message = {
          'sender': page.user,
          'reciver': page.receiver,
          'message': page.message,
          'type': 'send',
          'time': new Date()
        }
        axios.post(this.HOST + '/sendMessage', message).then(function (res) {
          page.message = ''
          page.messageList.push(message)
          console.log(page.messageList)
        }).catch(function (error) {
          console.debug(error)
        })
      },
      initWebSocket () {
        // 连接错误
        this.websocket.onerror = this.setErrorMessage

        // 连接成功
        this.websocket.onopen = this.setOnopenMessage

        // 收到消息的回调
        this.websocket.onmessage = this.setOnmessageMessage
        this.websocket.onmessageerror = this.setOnmessageMessageError

        // 连接关闭的回调
        this.websocket.onclose = this.setOncloseMessage

        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = this.onbeforeunload
      },
      setErrorMessage () {
        console.log('WebSocket连接发生错误   状态码：' + this.websocket.readyState)
      },
      setOnopenMessage () {
        console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
      },
      setOnmessageMessage (event) {
        console.log(event)
        // 根据服务器推送的消息做自己的业务处理
        // console.log('服务端返回：' + event.data)
        var message = JSON.parse(event.data)
        var messageContent = message[this.receiver.id]
        if (messageContent != null && messageContent['receiverId'] == this.user.id && messageContent['isdelete'] == 0) {
          var info = {
            'sender': this.receiver,
            'reciver': this.user,
            'time': new Date(),
            'message': messageContent['text']
          }
          this.messageList.push(info)
        }
      },

      setOncloseMessage () {
        console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
      },
      onbeforeunload () {
        this.closeWebSocket()
      },
      closeWebSocket () {
        this.websocket.close()
      }
    },
    mounted () {
      var page = this;
      this.user = this.$cookies.get('user');
      console.log(this.user)
      this.userId = this.user.id;
      var params = this.$route.params;
      console.log(params.friend);
      this.receiver = params.friend;
      this.connection();
      axios.post(page.HOST + '/getHistoryMessage', {
        'receiverId': page.user.id,
        'senderId': page.receiver.id,
      }).then(function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          var info = {
            'sender': res.data[i]['senderId'],
            'reciver': res.data[i]['receiverId'],
            'time': res.data[i]['sendtime'],
            'message': res.data[i]['text'],
            'type': res.data[i]['receiverId'] == page.receiver.id ? 'send' : ''
          }
          page.messageList.push(info)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    beforeDestroy () {
      this.onbeforeunload()
    },
    watch: {}, filters: {
      formatDate (time) {
        var datePattern = /^(\d{4})-(\d{2})-(\d{2})$/
        try {
          if (datePattern.test(time.substr(0, 10))) {
            return time.substr(0,19).replace('T',' ')
          } else {
            return formatDate(time, 'yyyy-MM-dd hh:mm:ss')
          }
        } catch (e) {
          return formatDate(time, 'yyyy-MM-dd hh:mm:ss')
        }
      }
    }, directives: {
      scroll: {
        inserted (el) {
          el.scrollIntoView()
        }
      }
    }
  }
</script>
<style scoped>
  .bottom {
    clear: both;
    height: 50px;
  }

  .list {
    /*height: 50px;*/
    width: 45%;
    background-color: aliceblue;
    border-radius: 5px;
    margin: 3px 10px;
  }

  .isSend {
    clear: both;
    float: right;
  }

  .isReceive {
    clear: both;
    float: left;
  }

  .message {
    margin: 3px 10px;
    border-radius: 10px;
  }

  .messageTime {
    margin: 3px;
    font-size: 0.5rem;
  }

  .messageText {
    margin: 3px;
    font-size: 1rem;
  }

  #send {
    position: fixed;
    bottom: 10px;
    clear: both;
    width: 100%;
  }

  #send table {
    width: 100%;
  }

  #send input {
    width: 70%;
  }

  #send button {
    width: 20%;
  }
</style>
