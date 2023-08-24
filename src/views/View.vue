<template>
   <div>
    <h1>栄養素表示</h1>
    <div class="ui main container">
      <div class="progress-bar-container">
        <div v-for="(nutrient, index) in nutrients" :key="index" class="progress-bar-wrapper">
          <div class="nutrient-label"><h3>{{ nutrient}}</h3></div>
           <div name="progress" class="ui green progress" 
             :data-percent="progressBarWidths(nutrient)"
             >
            <div class="bar"></div>
            <!--<div class="label">Transferring files</div>-->
        </div>
          <div class="tag1">{{progressBarWidths(nutrient)}}% 達成中</div>
          <p></p><div class="remaining-amount">残り{{ remainingAmount(nutrient) }} g摂取することを目指しましょう！</div>
          
        </div>
      </div>
    </div>
  </div>
        <div class="ui segment"></div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcと同じ意味です
// import something from '@/components/something.vue';
// import { baseUrl } from '@/assets/config.js';

// const headers = {'Authorization' : 'mtiToken'};
import { baseUrl } from '@/assets/config.js';
const headers = {'Authorization': 'mtiToken'};
export default {
  name: 'View',
  data() {
    return {
      nutrients: [
        'タンパク質',
        'ビタミンD',
        'ビタミンD12',
        '鉄分',
        'DHA',
        'EPA',
        'カルシウム',
        '亜鉛',
      ],
      maxValues: {
        'タンパク質': 100,
        'ビタミンD': 50,
        'ビタミンD12': 150,
        '鉄分': 130,
        'DHA': 180,
        'EPA': 70,
        'カルシウム': 100,
        '亜鉛': 100,
      },
      totalNutrients: {
        'タンパク質': 12,
        'ビタミンD': 34,
        'ビタミンD12': 68,
        '鉄分': 54,
        'DHA': 70,
        'EPA': 78,
        'カルシウム': 70,
        '亜鉛': 70,
      },
    };
  },
  computed: {   
    
  },
  methods: {
    progressBarWidths(nutrient) {
      console.log("OK")
      const progressBarWidths = {};
      for (const nutrient of this.nutrients) {
        console.log("AAAAA")
        const intake = this.totalNutrients[nutrient];
        const maxValue = this.maxValues[nutrient];
        const percentage = (intake / maxValue) * 100;
        progressBarWidths[nutrient] = Math.min(percentage, 100);
      }
      console.log(progressBarWidths)
      return progressBarWidths[nutrient];
    },
    remainingAmount(nutrient) {
      const intake = this.totalNutrients[nutrient];
      const maxValue = this.maxValues[nutrient];
      const remaining = Math.max(maxValue - intake, 0);
      return remaining.toFixed(2); // 小数点2桁まで表示
    },
  },
  mounted: function(){
    console.log( $('div[name="progress"]'))
    $('div[name="progress"]').each((i, e)=> $(e).progress());
  }
}
</script>

<style scoped>
/*.progress-bar-container {
  display: flex;
  flex-direction: column;
}

.progress-bar-wrapper {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.nutrient-label {
  width: 120px;
}

.ui.green.progress .bar {
  background-color: #21ba45; //進捗バーの色 //
}

.ui.green.progress {
  background-color: #00FFFF; // プログレスバー全体の背景色 //
}

.remaining-amount {
  margin-left: 10px;
}
*/
.ui.green.progress .bar {
  background-color: #21ba45; /*進捗バーの色*/ 
}

.ui.green.progress {
  background-color: #A9A9A9; /*プログレスバー全体の背景色*/
}
.tag1{
  text-align:center;
  font-weight: bold;
}
.remaining-amount{
  display: flex;
  justify-content: flex-end; /* 右端に配置 */
  font-weight: bold;
  /*background-color: lightblue; */
  padding: 10px; 
}
</style>
