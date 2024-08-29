<template>
    <q-page class="row items-center justify-center" style="gap: 40px;">
        <h2 @click="logout()">Verify</h2>
    </q-page>
</template>

<script setup lang="ts">
import { auth } from 'src/firebaseD/firebase-config';
import { useRouter } from 'vue-router';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { onMounted } from 'vue';

const router = useRouter()

const logout = async () => {
    await auth.signOut();
    router.push('/login')

}

onMounted(() => {
    if (auth.currentUser && auth.currentUser.emailVerified === false) {
        sendEmailVerification(auth.currentUser)
            .then(() => console.log('email sent'))
    } else {
        router.push('/')
    }
})

onAuthStateChanged(auth, user => {
    if (user?.emailVerified) {
        router.push('/')
    }
})


</script>