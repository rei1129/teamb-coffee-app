import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)



export default new Vuex.Store({

  state: {
    //商品リスト
    coffeeList: [],
    // /トッピングリスト
    toppings: [],
    login_user: null,
    // 複数のカート情報が入る配列 => 商品情報が複数入る！
    //現在使ってるカート情報
    useCart: {},
    //履歴(ステータスが0以外のものが入ってる)購入ずみ
    historyCart: [],
  },

  mutations: {
    //ログイン
    setLoginUser(state, user) {
      state.login_user = user
    },
    //ログアウト
    deleteLoginUser(state) {
      state.login_user = null
    },
    //商品一覧
    fetchItems(state, { item }) {
      state.coffeeList.push(item)
      console.log('コーヒー一覧')
      console.log(state.coffeeList)
    },
    //トッピングを取ってくる
    getTopping(state, { subItems }) {
      state.toppings.push(subItems)
      // console.log(state.toppings)
    },
    addCartItem(state, { id, cartItem }) {
      state.cartItem.id = id;
      // console.log(cartItem);
      state.cartList.push(cartItem);
      // console.log(state.cartList);
    },
    updateCart(state, { selectItem }) {
      //stateのカート情報のItems配列に選択された商品を追加
      state.useCart.Items.push(selectItem)
      console.log(state.useCart)
    },
    detailChangeCart(state, newCartItem) {
      state.cartList.push(newCartItem)
      console.log('detailChangeCart完了！');
      console.log(state.cartList);
    },
    //statusが0のショッピングカートはuseCart{}に保存
    useCart(state, { id, cartItem }) {
      //stateにfirestoreのカート情報を保存
      state.useCart = cartItem;
      state.useCart.orderID = id;
      console.log(state.useCart);
    },
    //statusが0以外の購入済みの場合は、履歴としてhistoryCart{}に入れる
    historyCart(state, { id, cartItem }) {
      state.historyCart.id = id;
      state.historyCart.push(cartItem);
    },
    //Itemsの中身を更新
    deleteFromCart(state, cart) {
      state.useCart.Items = cart.concat()
    },
    addCustomerInfo(state, customerInfo) {
      state.historyCart.push(customerInfo)
      state.useCart = {}
    }
  },
  actions: {
    //ログイン
    setLoginUser({ commit }, user) {
      console.log('setLoginUser動いているよ！！'),
        commit('setLoginUser', user)
    },
    //ログイン
    login() {
      //Googleプロジェクトオブジェクトのインスタンスの作成
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      //ログインページ（google）のにリダイレクトしてログインする為のコード
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout() {
      firebase.auth().signOut()
    },
    deleteLoginUser({ commit }) {
      commit('deleteLoginUser')
    },
    //商品リスト
    fetchItems({ commit }) {
      this.state.coffeeList = [] // 初期化
      //商品リストをfirestoreから持ってくる
      firebase.firestore().collection(`/Items`)
        .get().then(snapshot => {
          snapshot.forEach(doc =>
            commit('fetchItems', { item: doc.data() }))
        })
    },
    //トッピングを持ってくる
    getTopping({ commit }) {
      this.state.toppings = []
      firebase.firestore().collection(`/subItems`).get()
        .then(snapshot => {
          snapshot.forEach(doc =>
            commit('getTopping', { subItems: doc.data() }))
        })
    },
    //ユーザーがログインしてたらカートに入れる処理
    addCartItem({ getters, commit, state }, selectItem) {
      //カート情報を一旦変数に保存
      let usecartInfo = Object.assign({}, state.useCart)
      if (getters.uid) {
        console.log(usecartInfo)
        //usercartInfoのプロパティが0だったら = カート情報がなければ
        if (!Object.keys(usecartInfo).length) {
          const initState = {
              Items: [selectItem],
              address: '',
              orderID: '',
              orderTime: '',
              user: '',
              addressNumber: '',
              mail: '',
              orderDate: '',
              phoneNumber: '',
              status: 0,
            }
          firebase.firestore().collection(`users/${getters.uid}/carts`)
            //カート情報（選択された商品selectItemと空のユーザー情報)を追加
            .add(initState).then(doc => {
               commit('useCart', { id: doc.id, cartItem: initState })   
              })
        } else {
          //カート情報のItems(商品情報)配列だけをusercartInfoのItemsプロパティに代入
          usecartInfo.Items = state.useCart.Items.slice()
          console.log(usecartInfo.Items)
          //Itemsプロパティ（配列）に選ばれた商品情報を追加
          usecartInfo.Items.push(selectItem)
          console.log(usecartInfo.Items)
          firebase.firestore().collection(`users/${getters.uid}/carts`)
            // usercartInfoのorderIDを指定して、カート情報を更新
            .doc(usecartInfo.orderID).update(usecartInfo)
          commit('updateCart', { selectItem })
        }
      }
    },
    //カートから商品を削除する＝カートのItemsを更新する
    deleteInCart({ state, getters, commit }, cart){
      if(getters.uid){
        firebase.firestore().collection(`users/${getters.uid}/carts`)
          // カートの中のorderIDと一致するカートを指定して、
          // Itemsプロパティを更新する
            .doc(state.useCart.orderID).update({ Items: cart})
          commit('deleteFromCart', cart)
      }
    },
    fecthCartItem({ getters, commit }) {
      //ログインしたユーザー情報のパスを指定して、カート情報を持ってくる
      firebase.firestore().collection(`users/${getters.uid}/carts`)
        .get().then(snapshot => {
          snapshot.forEach(doc => {
            //カートのstatusが0(未購入)の場合、useCartを実行
            if (doc.data().status === 0) {
              // idはfirestore上の自動生成されたid、cartItemはカートの中身の情報
              commit('useCart', { id: doc.id, cartItem: doc.data() })
              //statusが0以外(購入済み)の場合履歴に反映
            } else if (doc.data().status !== 0) {
              commit('historyCart', { id: doc.id, cartItem: doc.data() });
            }
          })
        })
    },
    //注文ボタンの後に実行される
    addCustomerInfo({ state, getters, commit }, customerInfo) {
      //変数CIに入力されたユーザー情報を代入
      let CI = Object.assign({}, customerInfo)
      CI.Items = state.useCart.Items
      console.log(state.useCart.Items)
      console.log(CI)
      firebase.firestore().collection(`users/${getters.uid}/carts`)
      // カートを指定して、ユーザー情報を更新する
        .doc(state.useCart.orderID).update(CI)
          commit('addCustomerInfo', CI)
    }
  },

  getters: {
    //coffeeListのidとparams.idが一致したものを返す
    getItem: (state) => (id) => state.coffeeList.find((product) => product.ID === id),
    uid: (state) => (state.login_user ? state.login_user.uid : null),
    cartItemList: (state) => state.useCart,
  }
})
