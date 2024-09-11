<template>
    <q-page class="verification">
        <div class="verification__content">
            <h2 @click="logout()" class="verification__title">Verify</h2>
            <p class="verification__paragraph">Verification email has been sent to your inbox.</p>
            <p class="verification__paragraph">If you haven't received the email press Send Again</p>
            <q-btn class="verification__bttn" @click="sendEmailVerificationToUser()"
                :disabled="sendTimestamp !== 0">Send
                again <span class="verification__seconds" v-if="sendTimestamp">({{ sendTimestamp }}s)</span></q-btn>
        </div>
    </q-page>
</template>

<style lang="scss">
.verification {

    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

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
        background-color: rgb(47, 51, 54);
        padding: 0.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 0.3rem;
        box-shadow: 0px 5px 8px -5px rgba(66, 68, 90, 1);
        color: rgb(240, 240, 240)
    }

    &__title {
        margin-block: 0.3rem;
    }

}
</style>

<script setup lang="ts">
import { auth } from 'src/firebaseD/firebase-config';
import { useRouter } from 'vue-router';
import { sendEmailVerification } from 'firebase/auth';
import { onMounted, ref } from 'vue';

const router = useRouter()
let sendTimestamp = ref<number>(0)

const logout = async () => {
    await auth.signOut();
    router.push('/login')

}

const sendEmailVerificationToUser = async () => {
    if (auth.currentUser && auth.currentUser.emailVerified === false) {
        await sendEmailVerification(auth.currentUser)
            .then(() => {
                sendTimestamp.value = 60
                timeCounter(60)
            })
    } else {
        router.push('/')
    }
}

const timeCounter = async (i: number) => {
    if (sendTimestamp.value !== 0) {
        sendTimestamp.value--
        setTimeout(() => timeCounter(i - 1), 1000)
    }
}


onMounted(async () => {
    sendEmailVerificationToUser()
})

auth.onAuthStateChanged(user => {
    if (user && user.emailVerified) {
        router.push('/')
    }
})


</script>