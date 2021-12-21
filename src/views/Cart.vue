<template>
    <div>
        <h1>ショッピングカート</h1>
        
        <div v-if="!$store.state.login_user">カートを見るにはログインが必要です。</div>
            <h2 v-if="$store.state.login_user">{{$store.state.login_user.displayName}}さんのカート</h2>
            <div v-if="!cartContent.length">※カートに商品がありません</div>
            <div v-if="$store.state.login_user">
                <table border="1" v-if="cartContent.length">
                    <tr v-for="(cart, index) in cartContent" :key="cart.id">
                        <!-- カートのidを元に商品リストから商品の名前を表示 -->
                            <p>商品名：{{ getItem(cart.id).name }}</p>
                            <p>サイズ：{{cart.itemSize}}</p>
                            <p>追加トッピング：{{cart.choseToppings}}</p>
                            <p>個数:{{cart.itemCount}}個</p>
                            <p>小計:{{cart.totalPrice}}円</p>

                            <div>
                                <button @click="deleteCart(index)" style="width:300px">カートから削除する！</button>
                            </div>
                    </tr>
                </table>

                <h2>ご注文金額合計：{{ sumPrice }}</h2>

                <div>
                    <router-link :to="{ name: 'Confirm'}"><button style="width:300px">すべて購入する！</button></router-link>
                </div>

            </div>

    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
    data(){
        return{
        }
    },

    methods:{
        ...mapActions(['BuyInCart','deleteInCart']),
        deleteCart(index){
            let itemsBox = this.cartContent
            itemsBox.splice(index, 1)
            this.deleteInCart(itemsBox)
        }
    },
    computed:{
        cartContent(){
            console.log(this.$store.state.useCart.Items)
            //カート情報が入っていれば
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
