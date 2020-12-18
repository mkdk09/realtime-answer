<template>
    <el-container>
        <el-main v-if="question">
            <p class="ra-question">
                {{ question.text }}
                <span v-if="isAnswered">
                    (回答終了)
                </span>
            </p>
            <el-button
                class="ra-select"
                v-for="selection in question.selectionRefs"
                :key="selection.id"
                :disabled="isAnswered"
                @click="select($event, selection)"
            >{{ selection.text }}</el-button>
        </el-main>
        <el-main class="ra-message" v-else>Please wait for question.</el-main>
    </el-container>
</template>

<script>
import firebase from 'firebase/app'
import { db, auth } from '@/plugins/firebase'

const questions = db.collection('questions')
const activeQuestions = questions.where('isFinished', '==', false)
const selections = db.collection('selections')
const answers = db.collection('answers')

export default {
  data () {
    return {
      uid: null,
      questions: []
    }
  },
  async created () {
    // 匿名認証を行う
    await auth.signInAnonymously()
    auth.onAuthStateChanged((user) => {
      // 取得したUIDを保持
      this.uid = user.uid
    })

    // dataのquestionsにバインド
    // note: maxRefDepthをデフォルトの2から変更するため，ここで処理
    await this.$bind(
      'questions',
      activeQuestions,
      {
        maxRefDepth: 3
      }
    )
  },
  computed: {
    /**
         * @var Object 問題
         */
    question: {
      get () {
        return (this.questions.length) ? this.questions[0] : null
      }
    },
    /**
         * @var Boolean 回答済みかどうか
         */
    isAnswered: {
      get () {
        if (!this.question) {
          return false
        }
        if (this.question.isClosed) {
          return true
        }
        // note: questionがVueFireで複数回に分けて更新されるため、Objectのチェックを行う
        for (const selectionRef of this.question.selectionRefs) {
          if (typeof selectionRef !== 'object') {
            continue
          }
          for (const answerRef of selectionRef.answerRefs) {
            if (typeof answerRef !== 'object') {
              continue
            }
            if (answerRef.uid === this.uid) {
              // 自身の回答があれば，回答済み
              return true
            }
          }
        }
        return false
      }
    }
  },
  methods: {
    /**
         * 選択処理
         */
    async select (event, selection) {
      // 回答を保存
      const answerRef = await answers.add({
        uid: this.uid
      })
      // 選択肢に回答を紐付け
      const selectionRef = await selections.doc(selection.id)
      await selectionRef.set(
        {
          answerRefs: firebase.firestore.FieldValue.arrayUnion(answerRef)
        },
        {
          merge: true
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.ra-question {
  margin-top: 3rem;
  margin-bottom: 3rem;
  width: 100%;
  text-align: center;
  font-size: 1rem;
}
.ra-select {
  display: block;
  width: 100%;
  font-size: 1rem;
  & + & {
    margin: 2rem 0 0;
  }
}
.ra-message {
  width: 100%;
  height: 100vh;
  background-color: #4caf50;
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
