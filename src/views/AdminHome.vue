<template>
    <el-container>
        <el-main v-if="!question">
            <hr class="separator">
            <el-input placeholder="質問を入力してください" class="question" v-model="edit.question.text"></el-input>
            <hr class="separator">
            <el-input
                class="selection"
                placeholder="選択肢を入力してください"
                v-model="selectionText.text"
                v-for="(selectionText, index) in edit.selections"
                :key="index"
            ></el-input>
            <hr class="separator">
            <el-button type="primary" class="button" @click="save($event)">保存</el-button>
        </el-main>
        <el-main v-else>
            <hr class="separator">
            <p>{{ question.text }}</p>
            <hr class="separator">
            <table class="table">
                <thead>
                    <tr>
                        <th>回答</th>
                        <th>回答数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="selectionRef in question.selectionRefs" :key="selectionRef.index">
                        <td>{{ selectionRef.text }}</td>
                        <td>{{ (selectionRef.answerRefs) ? selectionRef.answerRefs.length : 0 }}</td>
                    </tr>
                </tbody>
            </table>
            <hr class="separator">
            <el-button type="warning" class="button" @click="close($event)" v-if="!question.isClosed">解答締切</el-button>
            <el-button type="danger" class="button" @click="finish($event)" v-else>次の質問へ</el-button>
        </el-main>
    </el-container>
</template>

<script>
import { db } from '@/plugins/firebase'

const questions = db.collection('questions')
const activeQuestions = questions.where('isFinished', '==', false)
const selections = db.collection('selections')

export default {
  data () {
    return {
      questions: [],
      edit: {
        question: {
          text: ''
        },
        selections: [
          {
            text: ''
          },
          {
            text: ''
          },
          {
            text: ''
          },
          {
            text: ''
          }
        ]
      }
    }
  },
  async created () {
    // dataのquestionsにバインド
    // note: maxRefDepthをデフォルトの2から変更するため、ここで処理
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
    }
  },
  methods: {
    /**
         * 保存処理
         */
    async save (event) {
      // バリデーション
      if (!this.edit.question.text) {
        alert('質問を入力してください')
        return
      }
      let selectionTextJoined = ''
      for (const selection of this.edit.selections) {
        selectionTextJoined += selection.text
      }
      if (!selectionTextJoined) {
        alert('選択肢を入力してください')
        return
      }

      // 保存処理
      const selectionRefs = []
      for (const selection of this.edit.selections) {
        if (!Selection.text) {
          continue
        }
        // 選択肢保存処理
        const selectionRef = await selections.add({
          text: selection.text,
          answerRefs: []
        })
        // Refを保持
        selectionRefs.push(selectionRef)
      }
      // 質問保存処理
      await questions.add({
        text: this.edit.question.text,
        isFinished: false,
        isClosed: false,
        selectionRefs: selectionRefs
      })
      // 入力値クリア
      this.edit.question.text = ''
      for (const index in this.edit.selections) {
        this.edit.selections[index].text = ''
      }
    },
    /**
         * 回答締め切り処理
         */
    async close (event, selection) {
      const questionRef = await questions.doc(this.question.id)
      // 質問のステータスを更新
      await questionRef.set(
        {
          isClosed: true
        },
        {
          merge: true
        }
      )
    },
    /**
         * 質問終了処理
         */
    async finish (event, selection) {
      // 質問のステータスを更新
      const questionRef = await questions.doc(this.question.id)
      await questionRef.set(
        {
          isFinished: true
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
.separator {
  margin: 1.5rem 0;
  border: none;
  border-bottom: 1px solid #999;
}
.selection {
  & + & {
    margin-top: 1rem;
  }
}
.table {
  width: 100%;
  color: #999;
  & thead th {
    border-bottom: 1px solid #ccc;
  }
  & th, & td {
    padding: .5rem;
  }
  & td:last-child {
    text-align: right;
  }
}
.button {
  display: block;
  margin: 0 auto;
}
</style>
