<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->

<div class="main-content">
  <div class="back-button">
    <i class="left chevron icon"></i>
    <div class="padding-button"></div>
    <button class="circular ui icon button" @click="backPage">
      戻る
      </button>
  </div>
  <h2>今日の食事</h2>
  <table>
    <thead>
      <tr>
        <th>内容</th>
        <th>個数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(key, index) in tableCol" :key="index">
        <td>
          <select class="ui fluid search dropdown" v-on:change="selectDish">
            <option v-for="dish in dishes" :value="dish">{{dish}}</option>
          </select>
        </td>
        <td>
          <div v-if="quantityFlags[index]">
            <input  v-model.number="quantitys[index]"  type="number" min="1" placeholder="Age" v-on:change="selectQuantity(index)" />
          </div>
        </td>
      </tr>
    </tbody>
    
  </table>

<div class="button-seg">
<button v-on:click="add" class="add-button">行を追加</button>
<button v-on:click="del" class="del-button">削除</button>  
</div>

</div>

<div class="container2"></div>


<div class="sub-content">
  <div class="container2"></div>
  <div class="meal segment">
  <center>
    <input type="text" placeholder="食品名" v-model.text="newMeal"/>    
  </center>
  
</div>
  <div class="record-button">
      <button class="ui  green fluid button" @click="foodRecord">
        <i class="plus icon"></i>
        <p>食品を追加する</p>
      </button>
  </div>
</div>
  <div class="container"></div>
  <div class="record-button">
      <button class="ui  green fluid button" @click="record">
        <i class="arrow alternate circle right icon"></i>
        <p>記録する</p>
      </button>
  </div>
    
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcと同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from "@/assets/config.js";
import moment from 'moment';

const headers = {'Authorization': 'mtiToken' }

export default {
  name: "FoodRecord",

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      userId: "",
      dishes: [],
      date: "",
      
      quantity: 1,
      
      tableCol: [{key: ""}],
      meals: [],
      quantitys: [0,0,],
      quantityFlags: [],
      index: 1,
      
      // new meal name
      newMeal: "",
    }

  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },

  created: async function () {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // apiからarticleを取得する
    this.userId = window.localStorage.getItem("userId");
    this.date = window.localStorage.getItem("date");
    try {
      /* global fetch */
      const res = await fetch(baseUrl + `/dishes?userId=${this.userId}`,{
        method: 'GET',
        headers
      });
      
      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}
      
      if (!res.ok) {
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage);
      }
      
      this.dishes = jsonData.dishes;
      console.log(this.dishes);
      
    } catch (e) {
      this.errorMsg = `Something Error occur: ${e}`
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    async record() {
 
      const userId = this.userId;
      // const date = this.date
      //dateの変換
      const date = 20230824
      const dishes = this.meals;
      // ページ遷移で持ってくる
      const mealType = "dinner"
      console.log(this.meals)
      
      const reqBody = {
        userId, date, dishes, mealType
      }
      console.log(reqBody)
      
      try {
        let path = "/daily-meals";
        /* global fetch */
        const res = await fetch(baseUrl + path, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(reqBody),
          
        });
        
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        
        this.$router.push({ name: "Diary"})
      } catch(e) {
        console.error(e);
        this.errorMsg = e;
      }  
      
    },
    
    foodRecord() {
      window.localStorage.setItem("newMeal", this.newMeal)
      this.$router.push({ name : "FoodRecord" })
    },
    
    add() {
      this.index += 1
      this.tableCol.push({ name: "", quantity: 0 });
      if (this.quantitys.length < this.index+1) {
        this.quantitys.push(0)
      };
    },
    del() {
      this.tableCol.pop()
    },
    
    selectDish(dish) {
      this.meals.push({ dishName: dish.target.value, quantity: 1 });
      this.quantityFlags.push(true);
    },
    
    selectQuantity(index) {
      this.meals[index]["quantity"] = this.quantitys[index]
    },
    
    backPage() {
      this.$router.push({ name: "Diary"})
    }
    
  },
  

  mounted: function(){
  
        /* global $ */
  
        $('.ui.dropdown').dropdown({
  
          allowAdditions:true
  
        });
  
      },
      
};
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
.article-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 100%;
}
.right-align {
  text-align: right;
}
.container {
  height: 100px;
}
.food-input {
  text-align: center;
}
.container2 {
  height: 50px;
}
.main-content {
  background-color: rgba(127,255,0, 0.4);
  text-align:center;
}
table {
    margin-left: auto;
    margin-right: auto;
}
.sub-content {
  background-color: rgba(	192,192,192, 0.5);
}
.record-button {
  margin-top: 30px;
}
.add-button {
  margin-right: 40px;
  margin-bottom: 40px;
  width: 100px;
}
.del-button {
  width: 100px;
  margin-bottom: 40px;
}
.button-seg {
  margin-top: 30px;
  
}
h2 {
  padding-top: 30px;  
}
.back-button {
  display: flex;
}
.padding-button {
  width: 10px;
}
</style>
