<template>
    <q-page>
        <q-card class="login-banner">
            <div class="login-banner__dummy"></div>
            <div class="login">
                <h2 class="login__heading">Welcome back Tenno!</h2>
                <h3 class="login__encouragement"> Sign in below</h3>
                <q-form class="login__form" @submit.prevent="loginUser(email, password)">

                    <q-input class="login__input login__input--email" v-model="email" outlined name="email" required
                        placeholder="email" id="email" dense>
                        <template v-slot:prepend>
                            <q-icon name="mail" />
                        </template>
                    </q-input>

                    <q-input class="login__input login__input--password" v-model="password" outlined type="password"
                        placeholder="password" id="password" dense>
                        <template v-slot:prepend>
                            <q-icon name="lock" />
                        </template>
                    </q-input>

                    <q-checkbox class="login__persistance" v-model="shouldPersist" label="Remember me"
                        color="primary" />

                    <q-btn class="login__button" label="Log in" type="submit" color="primary" />

                    <div class="login__swap">Dont have an account yet ? <router-link class="login__link"
                            to="/register">Register
                            here</router-link>
                    </div>

                </q-form>
            </div>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'src/firebaseD/firebase-config';
import { useRouter } from 'vue-router';


const email = ref('');
const password = ref('');
const shouldPersist = ref(true);
const isPending = ref(true);
const router = useRouter()

const loginUser = async (email: string, password: string) => {

    try {
        const response = await signInWithEmailAndPassword(auth, email, password)
        if (!response) {
            throw new Error('login failed, try again later')
        }
        isPending.value = false
        router.push('/')
    } catch (err: unknown) {
        if (err instanceof Error) {
            alert(err.message)
        }

        isPending.value = false
    }

}

</script>

<style lang="scss" scoped>
$text-dark: rgb(17, 17, 17);
$text-grey: rgb(77, 77, 77);
$text-light: rgb(173, 173, 173);

.login-banner {
    background-image: url(../assets/warframe-scene.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin-inline: auto;
    margin-block: clamp(1rem, 0.2rem + 8vw, 10rem);
    width: clamp(40rem, 20rem + 40vw, 100rem);
    border-radius: 1rem;
}

@media screen and (max-width: 700px) {
    .login-banner {
        grid-template-columns: 1fr;
        grid-template-rows: 150px 1fr;
        width: min(80rem, 80%);
        background-position: -270px -230px;
    }
}

.login {
    display: flex;
    flex-direction: column;
    margin-inline: auto;
    background-color: white;
    padding-left: min(3rem, 7vw);
    padding-bottom: 2rem;
    width: 100%;
    border-bottom-left-radius: 0px !important;

    &__heading {
        font-size: clamp(1.5rem, 1rem + 4vw, 3.2rem);
        margin-bottom: 0;
        line-height: clamp(2rem, 1rem + 3vw, 3.5rem);
    }

    &__encouragement {
        font-size: clamp(0.8rem, 0.4rem + 2vw, 1.2rem);
        margin-top: 0;
        color: $text-light;
    }

    &__form {
        width: min(90%, 350px);
        display: flex;
        flex-direction: column;

    }

    &__input {
        margin-bottom: 1rem;
    }

    &__persistance {
        padding-left: 1rem;
        margin-bottom: 1rem;
    }

    &__button {
        width: 7rem;
        align-self: center;
    }

    &__swap {
        text-align: center;
        margin-top: 1rem;
    }

    &__link {
        color: rgb(93, 72, 247);

        &:hover {
            color: rgb(193, 189, 255);
        }
    }


}
</style>