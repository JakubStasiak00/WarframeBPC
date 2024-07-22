<template>
  <q-page class="row items-center justify-center" style="gap: 40px;">
    <q-file outlined name="pickedScreenshot" v-model="pickedScreenshot">
      <template v-slot:prepend>
        <q-icon name="image" />
      </template>
    </q-file>
    <q-btn square color="primary" icon="send" @click="sendScreenshotToBackend()" />
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

defineOptions({
  name: 'IndexPage'
});

const pickedScreenshot = ref<File | null>(null);

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
  } catch (err) {
    console.log(err);
  }
}

</script>
