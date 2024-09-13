<template>
    <q-layout view="hHh lpR fFf">

        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title class="cst-banner">
                    <q-avatar class="cst-banner__avatar">
                        <img class="cst-banner__logo"
                            src="https://logos-world.net/wp-content/uploads/2021/02/Warframe-Emblem.png">;
                    </q-avatar>
                    <h1 class="cst-banner__title">WarframeBPC</h1>
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-page-container class="cst-bg-dark">
            <router-view />
        </q-page-container>

    </q-layout>
</template>

<script setup lang="ts">
import { auth } from 'src/firebaseD/firebase-config';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const authListener = auth.onAuthStateChanged(user => {
    if (user && !user.emailVerified) {
        router.push('/verify')
    } else if (user && user.emailVerified) {
        router.push('/')
    }
})

onBeforeMount(() => {
    authListener
})
</script>

<style lang="scss" scoped>
.cst-bg-dark {
    background-color: $clr-bg-dark;
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
        color: green
    }

    &__menu {
        font-size: 28px;
    }

}
</style>