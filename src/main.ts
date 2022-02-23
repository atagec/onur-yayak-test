import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNoz711p_p_h9ujSvEef3mxGgIu_kN9kw",
  authDomain: "onur-yayak-test.firebaseapp.com",
  projectId: "onur-yayak-test",
  storageBucket: "onur-yayak-test.appspot.com",
  messagingSenderId: "46225843964",
  appId: "1:46225843964:web:3e233f0a87bd5a06ce9979"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth =  getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

const app = createApp(App)
  .use(IonicVue)
  .use(router);
  
router.isReady().then(() => {
  app.mount('#app');
});