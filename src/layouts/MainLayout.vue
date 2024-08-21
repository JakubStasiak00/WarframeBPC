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
          <router-link class="cst-banner__link" to="/login">Login</router-link> <span> or </span>
          <router-link class="cst-banner__link" to="/register">Register</router-link>
        </div>
      </q-toolbar>

      <q-tabs class="tab-menu" align="left" v-if="$q.screen.gt.xs">
        <q-route-tab class="tab-menu__link" to="/" label="Bulk Price Checker" />
        <q-route-tab class="tab-menu__link" to="/about" label="About Project" />
        <q-route-tab class="tab-menu__link" to="/report-issues" label="Report Issues" />
        <q-route-tab class="tab-menu__link" to="/updates" label="Future Updates" />
      </q-tabs>

      <q-drawer class="side-menu bg-primary" v-model="isDrawerOpened" side="right" v-if="!$q.screen.gt.xs">
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
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';


defineOptions({
  name: 'MainLayout'
});

const $q = useQuasar();
const isDrawerOpened = ref(false);

const openDrawer = () => {
  isDrawerOpened.value = !isDrawerOpened.value;
}

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
    align-items: baseline;
    margin-right: calc(0.5rem + 1vw);
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