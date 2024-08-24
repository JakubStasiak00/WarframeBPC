<template>
    <q-page>
        <q-card class="register-banner">
            <div class="register-banner__dummy"></div>
            <div class="register">
                <h2 class="register__heading">Join our cause Tenno!</h2>
                <h3 class="register__encouragement"> Create an account below</h3>
                <q-form class="register__form" @submit.prevent="authenticateregister">

                    <q-input class="register__input register__input--username" v-model="username" outlined
                        name="username" required placeholder="username" id="username" :rules="usernameRules" lazy-rules
                        dense>
                        <template v-slot:prepend>
                            <q-icon name="person" />
                        </template>
                    </q-input>

                    <q-input class="register__input register__input--email" v-model="email" outlined type="email"
                        placeholder="email" id="email" :rules="emailRules" lazy-rules dense>
                        <template v-slot:prepend>
                            <q-icon name="email" />
                        </template>
                    </q-input>

                    <q-input class="register__input register__input--password" v-model="password" outlined
                        type="password" placeholder="password" id="password" :rules="passwordRules" lazy-rules dense>
                        <template v-slot:prepend>
                            <q-icon name="lock" />
                        </template>
                    </q-input>

                    <q-btn class="register__button" label="Register" type="submit" color="primary" />

                    <div class="register__swap">Already have an account ? <router-link class="register__link"
                            to="/login">Sign in
                            here</router-link>
                    </div>

                </q-form>
            </div>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const username = ref('');
const password = ref('');
const email = ref('');

const usernameRules = ref([
    (val: string) => /^[a-zA-Z0-9]+$/.test(val) || 'Only letters and numbers',
    (val: string) => val.length >= 4 || 'Use at least 4 characters',
    (val: string) => val.length <= 18 || 'Use maximum of 18 characters'
])

const passwordRules = ref([
    (val: string) => /[a-z]/.test(val) || 'At least one lowercase letter',
    (val: string) => /[A-Z]/.test(val) || 'At least one uppercase letter',
    (val: string) => /[0-9]/.test(val) || 'At least one number',
    (val: string) => val.length >= 8
])

const emailRules = ref([
    (val: string) => /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(val) || 'E-mail format is incorrect'
])

const authenticateregister = () => {
    console.log('register succesful !');
}

</script>

<style lang="scss" scoped>
$text-dark: rgb(17, 17, 17);
$text-grey: rgb(77, 77, 77);
$text-light: rgb(173, 173, 173);

.register-banner {
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
    .register-banner {
        grid-template-columns: 1fr;
        grid-template-rows: 150px 1fr;
        width: min(80rem, 80%);
        background-position: -270px -230px;
    }
}

.register {
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
        line-height: clamp(0.5rem, 1rem + 6vw, 2rem);
    }

    &__form {
        width: min(90%, 350px);
        display: flex;
        flex-direction: column;

    }

    &__input {
        margin-bottom: 0.1rem;
    }

    &__button {
        width: 7rem;
        align-self: center;
        margin-top: 0.5rem;
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
