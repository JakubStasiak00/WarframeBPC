<template>
    <q-page>
        <div class="login">
            <h2 class="login__heading">Welcome back Tenno</h2>
            <h3 class="login__encouragement"> Sign in below !</h3>
            <q-form class="login__form" @submit.prevent="authenticateLogin">
                <label class="login__label" for="username">Username :</label>
                <q-input class="login__input login__input--username" v-model="username" outlined name="username"
                    :rules="usernameRules" required placeholder="username">
                    <template v-slot:prepend>
                        <q-icon name="person" />
                    </template>
                </q-input>
                <label class="login__label" for="password">Password :</label>
                <q-input class="login__input login__input--password" v-model="password" outlined type="password"
                    :rules="passwordRules" placeholder="password">
                    <template v-slot:prepend>
                        <q-icon name="lock" />
                    </template>
                </q-input>

                <q-btn class="login__button" label="Log in" type=submit color="primary" />

            </q-form>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const username = ref('');
const password = ref('');
const usernameRules = ref([
    (val: string) => /^[a-zA-Z0-9]+$/.test(val) || 'Username should only contain letters and numbers',
    (val: string) => val.length >= 4 || 'Username has to be at least 4 characters long',
    (val: string) => val.length <= 18 || 'Username can not exceed 18 characters'
])
const passwordRules = ref([
    (val: string) => /[a-z]/.test(val) || 'password must contain at least one lowercase letter',
    (val: string) => /[A-Z]/.test(val) || 'password must contain at least one uppercase letter',
    (val: string) => /[0-9]/.test(val) || 'password must contain at least one number',
    (val: string) => val.length >= 8
])

const authenticateLogin = () => {
    console.log('Login succesful !');
}

</script>

<style lang="scss" scoped>
$text-dark: rgb(17, 17, 17);
$text-grey: rgb(77, 77, 77);
$text-light: rgb(173, 173, 173);

.login {
    width: min(90%, 550px);
    display: flex;
    flex-direction: column;
    margin-inline: auto;

    &__heading {
        font-size: clamp(1.8rem, 1rem + 4vw, 3.2rem);
        margin-bottom: 0;
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

    &__label {
        margin-left: 0.3rem;
        margin-bottom: 0.4rem;
        font-size: 1rem;
    }

    &__button {
        width: 7rem;
        align-self: center;
        margin-top: 1rem;
    }
}
</style>