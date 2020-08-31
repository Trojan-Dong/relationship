<template>
  <div id="friendList">

    <div class="list" v-for="(friendInfo,index) in friendList" v-bind:key="index"
         v-on:click="toSendPage(friendInfo)">
      <div class="pic">
        <img
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598875856740&di=483b8f1c98a70ee32a624049246473fe&imgtype=0&src=http://c-ssl.duitang.com/uploads/item/202008/15/20200815203046_pwcze.thumb.400_0.jpeg">
      </div>
      <div class="message">
        <div class="message_top">
          <span class="name"> {{ friendInfo.loginName }} </span>
          <span class="status"> {{ friendInfo.status=='0'?'在线':'离线' }} </span>
        </div>
        <div class="message_bottom">
          <div class="noread_mess">1</div>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
  import {
    connection
  } from '../js/websocket.js'
  import axios from 'axios'

  export default {
    name: 'friend',
    data () {
      return {
        friendList: [],
        messageList: []
      }
    },
    methods: {
      toSendPage (friendInfo) {
        this.$router.push({
          name: 'SendMessage',
          params: {
            friend: friendInfo
          }
        })
      }
    },
    mounted () {
      var page = this
      var user = this.$cookies.get('user')
      if (user == null || user == '') {
        console.log(user)
        this.$router.push({
          name: 'login',
          params: {}
        })
      } else {
        axios.post(page.HOST + '/listAllUser').then(function (res) {
          page.friendList = res.data
        }).catch(function (error) {
          console.log(error)
        })
      }
      var websocket = connection(user.id)
      console.log(websocket)
    }
  }
</script>

<style scoped>
  .list {
    height: 50px;
    width: 100%;
    background-color: #fafafa;
    border-radius: 5px;
    margin: 3px 0px;
  }

  .pic {
    height: 50px;
    width: 20%;
    float: left;
  }

  .pic img {
    margin: 5px 1rem;
    width: 40px;
    height: 40px;
    border-radius: 30px;
  }

  .message {
    height: 50px;
    width: 80%;
    float: right;
  }

  .message .name {
    margin: 3px;
    font-size: 1rem;
    /*line-height: 50px;*/
  }

  .message .status {
    margin: 3px;
    font-size: 0.5rem;
    color: darkgrey;
    float: right;
  }

  .message_top {
    height: 50%;
  }

  .message_bottom {
    width: 100%;
    height: 50%;
  }

  .noread_mess {
    float: right;
    width: 1.5rem;
    height: 1rem;
    border-radius: 0.5rem;
    background-color: darkgrey;
    color: white;
    margin-right: 0.3rem;
    font-size: 0.8rem;
    text-align: center;
    line-height: 1rem;
  }
</style>
