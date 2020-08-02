import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

Vue.use(firestorePlugin)

const config = {
  apiKey: 'AIzaSyBl6A8rwS8LtZiBkapftLTt9lVAhdE7YRU',
  authDomain: 'realtime-answer-aac8e.firebaseapp.com',
  databaseURL: 'https://realtime-answer-aac8e.firebaseio.com',
  projectId: 'realtime-answer-aac8e',
  storageBucket: 'realtime-answer-aac8e.appspot.com',
  messagingSenderId: '729477940909',
  appId: '1:729477940909:web:b9fd95ae5189c0988ce824',
  measurementId: 'G-H6ZW2V1LT8'
}

const firebaseApp = firebase.initializeApp(config)

export const db = firebaseApp.firestore()

export const auth = firebaseApp.auth()
