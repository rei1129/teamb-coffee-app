<template>

  <form>
    <p v-if="errors.length">
    <ul>
      <li v-for="error in errors" :key="error.error_id">{{ error }}</li>

    </ul>
    </p>
    <p>お届け先情報</p>
      <div>
        お名前<input type="text" v-model="CustomerInfo.user">
      </div>
      <div>
        メールアドレス<input type="text" v-model="CustomerInfo.mail">
      </div>
      <div>
        郵便番号<input type="text" v-model="CustomerInfo.addressNumber">
      </div>
      <div>
        住所<input type="text" v-model="CustomerInfo.address">
      </div>
      <div>
        電話番号<input type="text" v-model="CustomerInfo.phoneNumber">
      </div>
 
      <div>
        配達日
        <input type="date" v-model="CustomerInfo.orderDate">
      </div>

      <div>
        時間
      <select v-model="CustomerInfo.orderTime">
        <option v-for="option in options" v-bind:value="option.value" :key="option.option_id">
              {{ option.text }}
        </option>
      </select>
      </div>
        <div>
          <h1>お支払い方法</h1>
          <input type="radio" id="daibiki" value="1" v-model="CustomerInfo.status">
            <label for="daibiki">代金引換</label>
          <br>
          <input type="radio" id="credit" value="2" v-model="CustomerInfo.status">
          <label for="credit">クレジットカード</label>
          <br>
        </div>
        <button type="submit" @click="checkForm">注文する</button>

  </form>
        
</template>
<script>
// import axios from 'axios'
import {mapActions} from 'vuex'
export default {
  name:'Toorder',
  data(){
   return {
    CustomerInfo:{
    user: '佐藤',
    mail: 'aaa@icloud.com',
    addressNumber : '111-2222',
    address: '東京都港区',
    phoneNumber: '090-1111-2222',
    orderDate:null,
    orderTime:null,
    status:null,
     }
     ,
      errors:[],

    options: [
        {text:'10時',value:10},
        {text:'11時',value:11},
        {text:'12時',value:12},
        {text:'13時',value:13},
        {text:'14時',value:14},
        {text:'15時',value:15},
        {text:'16時',value:16},
        {text:'17時',value:17},
        {text:'18時',value:18},
      ],
   }
},

methods: {
    checkForm: function (e) {
      this.errors = [];

      if (!this.CustomerInfo.user) {
        this.errors.push("名前を入力してください");
      } //名前のバリデーション

      if (!this.CustomerInfo.mail) {
        this.errors.push('メールアドレスを入力してください');
      } else if (!this.validEmail(this.CustomerInfo.mail)) {
        this.errors.push('メールアドレスの形式が不正です');
      } //メールアドレスのバリデーション

      if (!this.CustomerInfo.addressNumber) {
        this.errors.push("郵便番号を入力して下さい");
      } else if(!this.validZipaddress(this.CustomerInfo.addressNumber)){
       this.errors.push('郵便番号はXXX-XXXXの形式で入力してください');
      } //郵便番号のバリデーション

      if (!this.CustomerInfo.address) {
        this.errors.push("住所を入力して下さい");
      }  //住所のバリデーション

      if (!this.CustomerInfo.phoneNumber) {
        this.errors.push("電話番号を入力して下さい");
      } else if(!this.validPhone(this.CustomerInfo.phoneNumber)){
       this.errors.push('電話番号はXXXX-XXXX-XXXXの形式で入力してください');
      } //電話番号のバリデーション

      if (!this.CustomerInfo.orderDate) {
        this.errors.push("配達日時を入力して下さい");
      } else if(!this.validOrderdate(this.CustomerInfo.orderDate)){
       this.errors.push('今から3時間後の日時をご入力ください');
      } //配達日時のバリデーション

      if (!this.CustomerInfo.orderTime) {
        this.errors.push("配達日時を入力して下さい");
      } //配達日時のバリデーション

      // エラーがなかったら
      if (!this.errors.length) {
         e.preventDefault();
         //入力されたユーザー情報をactions(addCustomerInfo)に渡す
        this.addCustomerInfo(this.CustomerInfo);
        this.$router.push({ name: "Done" });
        return true;
      }
       e.preventDefault();
         
    },

    validEmail: function (email) {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email); //メールアドレスの表記のバリデーション
    },
    validZipaddress: function(zipaddress){
      let re = /^\d{3}-\d{4}$/
      return re.test(zipaddress) //郵便番号の表記のバリデーション
    },
    validPhone: function(phone){
      let re = /^\d{2,5}-\d{1,4}-\d{4}$/
      return re.test(phone) //郵便番号の表記のバリデーション
    },


    validOrderdate: function(orderdate){
      //本日
      let today = new Date() 
      today = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours()
      )
      
      let date1 = new Date(orderdate)

      let nowDay = today.getDate()

      let date = new Date (date1)
       date1 = new Date(
        date1.getMonth(),
        date1.getDate()
      )

      let selectedDay = date.getDate()
      let nowHour = today.getHours()
      let a = Math.abs(this.ordertime - nowHour)

      if(nowDay === selectedDay){
        console.log('同じ日付です')
        if( this.ordertime <= nowHour){
           console.log('時間がおかしいです')
          return false
        } else if( 3 <= a)
        console.log('時間は正常です')
        return true
      }//ここまで同じ日の場合の処理
         else if(nowDay >= selectedDay){
        console.log('本日以降の日付を選択してください')
        return false
      }else{
        return true
      }
    },
      ...mapActions(['addCustomerInfo'])
  }
}
</script>


