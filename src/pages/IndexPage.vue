<template>
  <q-page class="row items-center justify-center" style="gap: 40px;">
    <div v-if="!listOfItems" class="row items-center justify-around" style="gap: 1.5rem;">
      <q-file outlined name="pickedScreenshot" v-model="pickedScreenshot">
        <template v-slot:prepend>
          <q-icon name="image" />
        </template>
      </q-file>
      <q-btn square color="primary" icon="send" @click="sendScreenshotToBackend()" />
    </div>
    <q-card v-for="item, index in listOfItems" :key="index">
      <q-card-section>
        <h6>{{ item }}</h6>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

defineOptions({
  name: 'IndexPage'
});

const pickedScreenshot = ref<File | null>(null);
const listOfItems = ref<string[] | null>(null);

const sendScreenshotToBackend = async () => {
  const formData = new FormData();

  if (!pickedScreenshot.value) {
    alert('Pick an inventory screenshot first !');
    return;
  }

  formData.append('screenshot', pickedScreenshot.value);

  try {
    const response = await axios.post('http://localhost:3000/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data)
    listOfItems.value = Array.from(response.data.phrases as Iterable<string>).filter(word => {
      const hasNumber = /\d/;
      const oneLetter = /^[A-Za-z]$/;
      return !hasNumber.test(word as string) && !oneLetter.test(word as string);
    });
    console.log(listOfItems.value);
  } catch (err) {
    console.log(err);
  }
}

</script>
