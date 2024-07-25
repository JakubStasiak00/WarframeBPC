<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="row items-center">
          <q-avatar style="font-size: 70px;">
            <img style="
        width: 100%; 
        height: 100%;
        object-fit: contain;
        color: green" src="https://logos-world.net/wp-content/uploads/2021/02/Warframe-Emblem.png">;

          </q-avatar>
          <h1 class="text-h3">WarframeBPC</h1>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Bulk Price Checker" />
        <q-route-tab to="/about" label="About Project" />
        <q-route-tab to="/report-issues" label="Report Issues" />
        <q-route-tab to="/updates" label="Future Updates" />
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
