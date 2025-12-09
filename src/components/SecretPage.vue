<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const password = ref('')
const contentType = ref('')
const router = useRouter()

function checkPassword() {
    const val = password.value.toLowerCase()
    if(val === "riho"){
        router.push('/OBXXK5TPNFZA====')
    }
    else if (["cat", "amogus", "goon", "feur", "coubeh", "dog", "vilnius"].includes(val)) {
        contentType.value = val
    } else {
        contentType.value = ''
    }
}
</script>

<template>
    <div class="secret-page">
        <div class="password-container">
            <input type="password" v-model="password" placeholder="Password (lowercase)" />
            <button @click="checkPassword">Submit</button>
        </div>

        <div class="secret-content" v-if="contentType === 'cat'">
            <img src="../assets/cat-spinning.gif" alt="Secret"/>
        </div>
        <div class="secret-content" v-if="contentType === 'amogus'">
            <img src="../assets/amogus.gif" alt="Secret" />
        </div>
        <div class="secret-content" v-if="contentType === 'goon'">
            <img src="../assets/goon.gif" alt="Secret" />
            <p>Tom arrête.</p>
        </div>
        <div class="secret-content" v-if="contentType === 'feur'">
            coubeh.
        </div>
        <div class="secret-content" v-if="contentType === 'coubeh'">
            feur.
        </div>
        <div class="secret-content" v-if="contentType === 'dog'">
            <img src="../assets/dog.gif" alt="Secret" />
        </div>
        <div class="secret-content" v-if="contentType === 'vilnius'">
            <img src="../assets/vilnius.jpg" alt="Secret" />
            <p>My Slattina</p>
        </div>
    </div>
</template>

<style scoped>
.password-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.password-container input {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.password-container button {
    padding: 10px 15px;
    background-color: #0000007f;
    color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
}

.password-container button:hover {
    background-color: #3b3f4478;
}

.secret-content {
    margin-top: 20px;
    text-align: center;
}

.secret-content img {
    max-width: 200px;
    height: auto;
    border-radius: 10px;
}
.secret-page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
