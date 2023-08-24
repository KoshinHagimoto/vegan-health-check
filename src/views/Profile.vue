<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <!-- 発展課題のローディング表示用 -->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>
      
      <div class="ui segment">
        <!-- エラーメッセージ用-->
        <p class="ui negative message" v-if="errorMsg">
          <i class="close icon" @click="clearMsg('error')"></i>
          <span class="header">エラーが発生しました！</span>
          {{ errorMsg }}
        </p>
        
         <!-- 成功メッセージ用-->
        <p class="ui positive message" v-if="successMsg">
          <i class="close icon" @click="clearMsg"></i>
          <span class="header">完了しました！</span>
          {{ successMsg }}
        </p>
        
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input v-model="user.userId" type="text" placeholder="ID" required disabled/>
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input v-model="user.password" type="password" placeholder="password"/>
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input v-model="user.nickname" type="text" placeholder="Nickname"/>
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="calendar icon"></i>
              <input v-model="user.age" type="number" min="0" placeholder="Age">
            </div>
          </div>
          <button class="ui huge green fluid button" v-bind:disabled="isButtonDisabled" type="submit">
            更新
          </button>
        </form>
      </div>
      <button @click="deleteUser" class="ui huge grey fluid button" type="submit">
        退会
      </button>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';

const headers = {'Authorization': 'mtiToken'};


export default {
  name: 'Profile',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      user: {
        userId: window.localStorage.getItem('userId'),
        password: null,
        nickname: null,
        age: null,
      },
      successMsg: '',
      errorMsg: '',
      isCallingApi: false,
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
     isButtonDisabled() {
      const { userId, password, nickname, age } = this.user;
      return !userId || !password || !nickname || !age;
    }
  },

  methods: {
    
    clearMsg(target) {
      if (target === 'error') {
        this.errorMsg = '';
      } else {
        this.successMsg = '';
      }
    },
    
    async submit() {
      if (this.isCallingApi) {
        return;
      }
      this.isCallingApi = true;
      
      // request
      const { userId, password, nickname, age } = this.user;
      const reqBody = {
        userId,
        password,
        nickname,
        age
      };
      
      try {
        /* global fetch */
        const res = await fetch(baseUrl + '/user', {
          method: 'PUT',
          body: JSON.stringify(reqBody),
          headers
        });
        
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}
        
        if (!res.ok){
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage)
        }
        this.successMsg = 'ユーザー更新が完了.'
      } catch(e){
        this.errorMsg = `ユーザー更新時にエラー発生: ${e}`;
      } finally {
        this.isCallingApi = false;
      }
    },
    
    async deleteUser() {
      if (this.isCallingApi) {
        return;
      }
      this.isCallingApi = true;
      
      try {
        const res = await fetch(`${baseUrl}/user?userId=${this.user.userId}`, {
          method: 'DELETE',
          headers
        });
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        
        window.localStorage.clear();
        this.$router.push({ name: 'Login' });
      } catch(e){
        this.errorMsg = `ユーザー削除時にエラー発生: ${e}`;
      } finally {
        this.isCallingApi = false;
      }
    },
  },
  
  // インスタンスが生成されかつデータが初期化された後
  // 初回表示時にユーザー情報を得る
  created: async function() {
    this.isCallingApi = true;
    
    try {
      /* global fetch */
      const res = await fetch(baseUrl + `/user?userId=${this.user.userId}`, {
        method: 'GET',
        headers
      });
      
      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}
      
      if (!res.ok){
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage)
      }
      
      //成功
      this.user.nickname = jsonData.nickname;
      this.user.age = jsonData.age;
    } catch(e) {
      // error
      this.errorMsg = `ユーザー情報取得時にエラー発生: &{e}`;
    } finally {
      this.isCallingApi = false;
    }
  }
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
