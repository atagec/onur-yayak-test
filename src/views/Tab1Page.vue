<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Öğrenciler</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item button @click="testClick()" detail="true" v-for="user in users" :key="user.id">
          <ion-label>{{ user.name }}</ion-label>
        </ion-item>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed" @click="setOpen(true)">
        <ion-fab-button>
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="isOpenRef" css-class="my-custom-class" :swipe-to-close="true" :presenting-element="$parent.$refs.ionRouterOutlet" @didDismiss="setOpen(false)">
        <ion-header translucent>
          <ion-toolbar>
            <ion-title>Modal Content</ion-title>
            <ion-buttons slot="end">
              <!-- <ion-button onclick="dismissModal()">Close</ion-button> -->
              <ion-button @click="setOpen(false)">Close</ion-button>
              <ion-button color="primary" @click="addUser(name, total, current)">Add</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-item>
          <ion-label position="stacked">Öğrenci Adı</ion-label>
          <!-- Input with placeholder -->
          <ion-input v-model="name"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Toplam Ders Sayısı</ion-label>
          <!-- Input with clear button when there is a value -->
          <ion-input v-model="total"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Kalan Ders Sayısı</ion-label>

          <!-- Number type input -->
          <ion-input v-model="current"></ion-input>
        </ion-item>
        <!-- <Modal :data="data"></Modal> -->
      </ion-modal>

      <!-- <ExploreContainer name="Tab 1 page" /> -->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, toRefs, computed } from "vue";
import { add } from "ionicons/icons";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonFab, IonFabButton, IonModal, IonInput } from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";
import { getDocs, collection, doc, setDoc, getFirestore, serverTimestamp, addDoc, onSnapshot } from "firebase/firestore";

import { auth, db } from "../main";

export default defineComponent({
  name: "Tab1Page",
  components: { 
    // ExploreContainer, 
  IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonItem, IonLabel, IonFab, IonFabButton, IonModal, IonInput },
  setup() {
    const state = reactive({
      name: "",
      total: "",
      current: "",
      users: [] as any
    });

    const fetchUsers = async () => {
      const users = collection(db, "users");
      const snapshot = await getDocs(users);

      const usersPlaceholder = [] as any;

      snapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        const id = doc.id;
        const data = doc.data() as any;
        usersPlaceholder.push({
          id: id,
          ...data
        });
        console.log(doc.id, " => ", doc.data());
      });

      return usersPlaceholder;
    };

    const setUsers = (users: object) => {
      console.log("users", users);
      state.users = users;
    };

    const getUsers = computed(() => state.users);

    const loadUsers = async () => {
      const users = await fetchUsers();
      setUsers(users);
    };

    const addUser = async (name: string, total: number, current: number) => {
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        total: total,
        current: current,
        createdAt: serverTimestamp()
      });

      const unsubscribe = onSnapshot(
        collection(db, "users"),
        querySnapshot => {
          const usersPlaceholder = [] as any;

          querySnapshot.forEach(doc => {
            const data = doc.data() as any;

            console.log("Current data: ", doc.data());

            const id = docRef.id;
            usersPlaceholder.push({
              id: id,
              ...data
            });
          });

          setUsers(usersPlaceholder);
        },
        error => {
          console.log("error", error);
        }
      );

      // unsubscribe();
      setOpen(false);

      console.log("document written with ID", docRef.id);
    };

    const isOpenRef = ref(false);
    const setOpen = (state: boolean) => (isOpenRef.value = state);
    // const setClose = (state: boolean) => {
    //   console.log("wow");
    //   // isOpenRef.value = state
    // };

    onMounted(() => {
      loadUsers();
    });

    return {
      ...toRefs(state),
      add,
      isOpenRef,
      setOpen,
      addUser,
      loadUsers,
      getUsers
    };
  }
});
</script>
