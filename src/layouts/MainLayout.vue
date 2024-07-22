<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="row items-center">
          <q-avatar style="font-size: 70px;">
            <img style="
        width: 100%; 
        height: 100%;
        object-fit: contain;" src="https://1000logos.net/wp-content/uploads/2020/09/Warframe-Emblem.png">
          </q-avatar>
          <h1 class="text-h3">WarframeBPC</h1>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      Created by Jacob
    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">

defineOptions({
  name: 'MainLayout'
});

</script>
