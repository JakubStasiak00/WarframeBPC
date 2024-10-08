<template>
  <q-layout view="hHh lpR fff">

    <q-header reveal elevated class="bg-primary text-secondary" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="cst-banner">
          <q-avatar class="cst-banner__avatar">
            <img class="cst-banner__logo" src="https://logos-world.net/wp-content/uploads/2021/02/Warframe-Emblem.png">;
          </q-avatar>
          <h1 class="cst-banner__title">WarframeBPC</h1>
        </q-toolbar-title>
        <q-icon class="cst-banner__menu" name="menu" @click="openDrawer()" v-if="!$q.screen.gt.xs"></q-icon>
        <div class="cst-banner__credentials" v-else>
          <div class="cst-banner__credits" v-if="credits">
            {{ credits }}
            <img class="cst-banner__credits-image" src="../assets/Credits.webp" alt="credits">
          </div>
          <q-avatar class="cst-banner__avatar cst-banner__avatar--user">
            <img
              :src="userPhoto ? userPhoto : 'https://firebasestorage.googleapis.com/v0/b/warframebpc.appspot.com/o/user-placeholder.jpg?alt=media&token=2e153f44-a117-4689-bfc3-4c175fd6a07c'"
              alt="" class="cst-banner__user-image">
          </q-avatar>
          <span class="cst-banner__username" v-if="username">{{ username }}</span>
          <q-skeleton class="cst-banner__username" width="100px" height="10px" v-else></q-skeleton>
          <q-icon class="cst-banner__logout  text-h6" name="logout" @click="userLogout()"></q-icon>
        </div>
      </q-toolbar>

      <q-tabs class="tab-menu" align="left" v-if="$q.screen.gt.xs">
        <q-route-tab class="tab-menu__link" to="/" label="Bulk Price Checker" />
        <q-route-tab class="tab-menu__link" to="/about" label="About Project" />
        <q-route-tab class="tab-menu__link" to="/report-issues" label="Report Issues" />
        <q-route-tab class="tab-menu__link" to="/updates" label="Future Updates" />
      </q-tabs>

      <q-drawer class="side-menu bg-primary" v-model="isDrawerOpened" side="right" v-if="!$q.screen.gt.xs">
        <div class="cst-banner__credentials cst-banner__credentials--sidebar">
          <q-avatar class="cst-banner__avatar cst-banner__avatar--user">
            <img
              :src="userPhoto ? userPhoto : 'https://firebasestorage.googleapis.com/v0/b/warframebpc.appspot.com/o/user-placeholder.jpg?alt=media&token=2e153f44-a117-4689-bfc3-4c175fd6a07c'">
          </q-avatar>
          <span class="cst-banner__username" v-if="username">{{ username }}</span>
          <q-skeleton class="cst-banner__username" width="100px" height="10px" v-else></q-skeleton>
          <q-icon class="cst-banner__logout text-h6" name="logout" @click="userLogout()"></q-icon>
        </div>

        <ul class="side-menu__list">
          <li class="side-menu__item">
            <router-link class="side-menu__link" to="/">Bulk Price Checker</router-link>
          </li>
          <li class="side-menu__item">
            <router-link class="side-menu__link" to="/about">About Project</router-link>
          </li>
          <li class="side-menu__item">
            <router-link class="side-menu__link" to="/report-issues">Report Issues</router-link>
          </li>
          <li class="side-menu__item">
            <router-link class="side-menu__link" to="/updates">Future Updates</router-link>
          </li>
        </ul>
      </q-drawer>

    </q-header>

    <q-page-container>
      <div class="main">
        <div class="main__content">
          <router-view />
        </div>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onBeforeMount, ref } from 'vue';
import { auth, db } from 'src/firebaseD/firebase-config';
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';

const $q = useQuasar();
const isDrawerOpened = ref(false);
const router = useRouter()
const username = ref('')
const userPhoto = ref('')
const credits = ref(0)

const openDrawer = () => {
  isDrawerOpened.value = !isDrawerOpened.value;
}

const userLogout = async () => {
  await auth.signOut();
  router.push('/login')

}

const authListener = auth.onAuthStateChanged(async user => {
  if (!user) {
    router.push('/login')
  } else if (!user.emailVerified) {
    router.push('/verify')
  } else {
    username.value = user.displayName || ''
    userPhoto.value = user.photoURL || ''
    const docRef = doc(db, 'usersInfo', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      credits.value = docSnap.data().currency
    }
  }
})

onBeforeMount(() => {
  authListener
})

</script>

<style lang="scss" scoped>
@mixin link-styling {
  color: $clr-link-dormant;
  font-size: 1rem;

  &:hover {
    color: $clr-link-hover;
  }
}

.main {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('../assets/WarframeSceneTwo.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(4px);
    z-index: -1;
    transform: scale(1.1);
  }

  &__content {
    position: relative;
    z-index: 1;
  }
}

.cst-banner {

  display: flex;
  align-items: center;

  &__title {
    font-size: clamp(1.7rem, 2vw + 0.5rem, 2.7rem);
    line-height: 2rem;
    color: $text-primary;
  }

  &__credits {
    color: $text-primary;
  }

  &__credits-image {
    height: 30px;
  }

  &__avatar {
    font-size: clamp(2.5rem, 3vw + 0.8rem, 3.7rem);
    display: flex;
    align-items: center;
    margin-right: 0.4rem;

    &--user {
      font-size: clamp(2rem, 3vw + 0.5rem, 3rem);
    }
  }

  &__username {
    font-size: clamp(0.9rem, 0.3vw + 0.7rem, 1.2rem);
    color: $text-primary;
  }

  &__logout {
    color: red;
  }

  &__logo {
    object-fit: contain;
  }

  &__menu {
    font-size: 28px;
  }

  &__credentials {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-right: calc(0.5rem + 1vw);

    &--sidebar {
      margin-block: 1rem;
      padding-left: 1rem;
    }
  }

  &__link {
    @include link-styling;
  }

}

.tab-menu {
  background-color: #1e2630;

  &__link {
    @include link-styling;
  }
}

.side-menu {

  &__list {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__link {
    @include link-styling;
  }

}
</style>