<template>
  <div class="home">
      <!-- <button @click="logout" v-if="$store.state.login_user">ログアウト</button>
      <button @click="login" v-else>ログイン</button>
    <img :src="url"> -->

  <h1>コーヒー・ショピングサイト</h1>
    <input type="text" v-model="search" style="width:300px; height:20px;">
    <button style="margin-left:20px">検索</button>
    <!-- v-on click -->


  <div class="container">
    
  <div class="container1">

    <table  style="margin-top:30px ;" align = 'center'>

      <tbody v-for="item in getlist " :key="item.id" style="font-size: 20px;">
        <tr><img :src="item.imageURL" @click="submit(item)" class="coffee"></tr>
          <tr><th class="nowrap">{{item.name}}</th></tr>
          <tr><th>{{item.priceM}}円</th></tr>
          <tr><th>{{item.priceL}}円</th></tr>
          <tr><th class="nowrap"><router-link :to="{name: 'Details',params:{id:item.ID}}"><button class="button">商品詳細へ</button></router-link></th></tr>
      </tbody>

    </table>

  </div>

  </div>


    
    
  </div>
</template>

<script>
  import { mapActions } from "vuex";
  export default{
    methods:{
      ...mapActions(["login","logout","fetchItems"]),
      submit(id){
          this.$router.push({name:"Details",params:{id}})//省略id:idと同じ
        },
    },
    data(){
      return {
        search:''
      }
    },
      created(){
      this.fetchItems()
    },
    computed:{
      getlist(){
        const coffeeList  = this.$store.state.coffeeList
        //商品リストの中からnameが検索ワードに一致したものを返す
        return coffeeList.filter((item) => {
        return item.name.match(this.search)
      })
      }
    }
  }

</script>

<style>
table{
  border-collapse: collapse;
  display:flex;
  
  flex-wrap: wrap;
  
}
.container{
  display:flex;
  background-color: rgb(253, 249, 239);
  flex-wrap: wrap;
  padding: 150px;
}
.container1{
  margin: 2px;
  align-content: stretch;
}

th, td {
  border: solid 1px #333;
}
.nowrap {
  white-space: nowrap;
}

.button {
  padding:30px;
  color :#333;
  font-size: 16px;
  font-weight: bold;
  background: whitesmoke;
  padding: 18px 30px;
  border-radius: 6px;
  transition: .3s;
}
button:hover{
  opacity: 0.6; 
} 
</style>
