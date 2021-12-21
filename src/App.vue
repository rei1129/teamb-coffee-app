<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/cart">買い物かご</router-link> 
    </div>

    <div style="margin:50px"><Header /></div>

    <router-view/>
  </div>

</template>



<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
import firebase from 'firebase'
import { mapActions, mapGetters } from 'vuex'
import Header from '@/components/Header.vue'

export default{


  
components:{
    Header
  },
created(){

    this.$router.push('/');

    firebase.auth().onAuthStateChanged(user =>{ //リダイレクト後
      if(user){
        this.setLoginUser(user) //ログインユーザー情報をセット
        this.fecthCartItem() // ログインユーザーのcartItemを追加する！
        }else{
          this.deleteLoginUser() //ログインユーザー情報を削除
          this.$router.push({name: 'Home'})
        }
    })
  },
  methods:{
   ...mapActions(['setLoginUser','logout','deleteLoginUser','fecthCartItem'])
  },
  computed:{
    ...mapGetters(['cartItemList'])
  }
}
</script>