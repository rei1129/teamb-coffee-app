<template>
    <div id="details">

        <div style="margin-top:'200px'"><h1>商品詳細画面</h1></div>
        <table border="1" align = 'center'>
             <tr>
                <td>
                    <div><h2>商品名：{{itemdetails.name}}</h2></div>
                    <div><img :src="itemdetails.imageURL" style="width:600px"> </div>
                     <div><h2>商品説明：{{itemdetails.contents}}</h2></div>
                </td>
             </tr>

             <tr>
                 <td>
                     
                 </td>
             </tr>

             <tr>
                <td>
                    <div><h3>【商品サイズ】</h3></div>
                    <input type="radio" v-model="countSize" value="M"><span style="font-size:25px;">M</span>
                    <input type="radio" v-model="countSize" value="L"><span style="font-size:25px;">L</span>
                    <div><h2>Mサイズの料金：{{ itemdetails.priceM }}円(税抜)</h2></div>
                     <div><h2>Lサイズの料金：{{ itemdetails.priceL }}円(税抜)</h2></div>
                    <div><h3>【商品の個数】</h3></div>

                        <select v-model="itemCount">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                        </select>

                   <div><h2>【トッピング】</h2></div>
                        <span v-for="tops in toppings" :key="tops.ID">
                        <label><input type="checkbox" v-model="choseToppings" :value="tops.name">
                        {{ tops.name }}</label></span> 
                        <h3>※Mサイズは1トッピングにつき200円</h3>
                        <h3>※Lサイズは1トッピングにつき300円</h3>
                    <div><h3>選択中のトッピング：{{ choseToppings }}</h3></div>
                    <h1>商品金額：{{ totalPrice() }}円(税込)</h1>

                    <router-link :to="{name: 'Home'}"><button>戻る</button></router-link> |
                    <!--ボタンclickしたら、firestoreに保存される-->
                    <router-link :to="{ name: 'Cart' }"><button @click="goCart">カートに入れる</button></router-link>
                </td>
             </tr>          
           
        </table>

    </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
export default {
    name: 'Order',
    data(){
        //商品詳細情報が入る
        return {
            itemdetails: {},
            countSize:'',
            topping:{},
            choseToppings:[],
            itemCount: 0,
            id: 0,
        }
    },
    created(){
        //this.$route.params.idは選択された商品のid
        //getItemによってcoffeeList配列のidが一致したデータを取得
        const getItem = this.$store.getters.getItem(this.$route.params.id);
        console.log(getItem)
        if(getItem){
            //このページで利用するためにitemdetailsに置き換える
            this.itemdetails = getItem
        }
        //トッピング情報を表示するためにgetToppingを呼び出し
        this.getTopping()
    },
    methods:{
         ...mapActions(['addCartItem','intoCart', 'getTopping']),
        //カートのボタン押されたらaddCartItemを呼び出し
        goCart(){
            let selectItems = {
                //商品id
                id: this.$route.params.id,
                //個数
                itemCount: this.itemCount,
                //合計金額
                totalPrice: this.totalPrice(),
                //MかL
                itemSize: this.countSize,
                // 選ばれたトッピング
                choseToppings: this.choseToppings,
            }
            //選ばれた商品をオブジェクトにして渡す
            this.addCartItem(selectItems);
        },
        totalPrice(){
            if(this.countSize ==='M'){
                // (Mサイズの価格 * 個数 + トッピングの個数 * 200円) * 1.1
                 let total = (this.itemdetails.priceM * this.itemCount +this.choseToppings.length * 200) * 1.1
                return Math.floor(total)
            }else if(this.countSize ==='L'){
                // (Lサイズの価格 * 個数 + トッピングの個数 * 300円) * 1.1
                 let total=(this.itemdetails.priceL * this.itemCount + this.choseToppings.length *300) * 1.1
                return Math.floor(total)
            }
        },
    },
    computed:{
        ...mapState(['toppings'])
    }
}

   
        
</script>

<style scoped>

</style>
