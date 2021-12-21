<template>
    <div>
        <h1>注文内容確認</h1>
        <!-- <div v-if="this.cartContent.length === 0">
            <h1>カートに商品がありません!!</h1>
        </div> -->
        <!-- <div v-if="this.cartContent.length >= 1"> -->
                <table border="1">
                    <tr v-for="cart in cartContent" :key="cart.id">
                        <td>
                            <p>商品名：{{ getItem(cart.id).name }}</p>
                            <p>サイズ：{{cart.itemSize}}</p>
                            <p>追加トッピング：{{cart.choseToppings}}</p>
                            <p>個数:{{cart.itemCount}}個</p>
                            <p>小計:{{cart.totalPrice}}円</p>
                            <div>
                                <!-- <router-link :to="{ name:'Toorder'}"><button @click="Buy(cart)" style="width:300px">ユーザー情報入力</button></router-link> -->
                            </div>
                            <div>
                            </div>
                        </td>
                        <!-- </td> -->
                    </tr>
                    <tr>
                        <td>
                            <h2>ご注文金額合計：{{ sumPrice }}円</h2>
                                <router-link :to="{ name:'Toorder'}"><button @click="Buy(cart)" style="width:300px">ユーザー情報入力へ</button></router-link>
                                
                            <div>
                            </div>

                        </td>
                    </tr>

                </table>
                


        <!-- </div> -->
        


    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
    data(){
        return{
            //{ ID: 1, name: 'Gorgeous4サンド', contents: '人気の定番具材「ハム」と「チキン」をセットにした食べごたえ抜群のサンドイッチです', priceM: 480, priceL: 700, imageURL: require('@/assets/img_coffee/1.jpg') },
        }
    },

    methods:{
        ...mapActions(['BuyInCart','DeleteInCart']),
        Buy(){
            //購入ボタンが押されたらcartSampleアクションズを呼び出す
            this.cartSample();
        },
    },
    computed:{
        cartContent(){
            if(this.$store.state.useCart.Items){
                 return this.$store.state.useCart.Items.concat();      
            }
            return []
        },
        sumPrice(){
            return this.cartContent.reduce((a,c) => a + c.totalPrice, 0)
        },
       ...mapGetters(['getItem'])
        
    }

   


    


}



</script>
