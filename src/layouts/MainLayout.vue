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
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-primary text-white">
      Created by Jacob
    </q-footer>

  </q-layout>
  <!-- <q-circular-progress indeterminate rounded size="50px" color="lime" class="q-ma-md" v-else /> -->
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onBeforeMount, ref } from 'vue';
import { auth } from 'src/firebaseD/firebase-config';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const isDrawerOpened = ref(false);
const router = useRouter()
const username = ref('')
const userPhoto = ref('')

const openDrawer = () => {
  isDrawerOpened.value = !isDrawerOpened.value;
}

const userLogout = async () => {
  await auth.signOut();
  router.push('/login')

}

const authListener = auth.onAuthStateChanged(user => {
  if (!user) {
    router.push('/login')
  } else {
    username.value = user.displayName || ''
    userPhoto.value = user.photoURL || ''
  }
})

onBeforeMount(() => {
  authListener
})
</script>

<style lang="scss" scoped>
$clr-link-dormant: rgb(160, 187, 235);
$clr-link-hover: rgb(100, 210, 224);

@mixin link-styling {
  color: $clr-link-dormant;
  font-size: 1rem;

  &:hover {
    color: $clr-link-hover;
  }
}

.cst-banner {

  display: flex;
  align-items: center;

  &__title {
    font-size: clamp(1.7rem, 2vw + 0.5rem, 2.7rem);
    line-height: 2rem;
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