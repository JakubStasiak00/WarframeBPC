<template>
  <q-page class="row items-center justify-center q-py-md" style="gap: 40px;"
    :style="listOfItems ? 'display: grid; grid-template-columns: repeat(4, 1fr); padding-inline: 3rem' : ''">
    <div v-if="!listOfItems" class="row items-center justify-around" style="gap: 1.5rem;">
      <q-file outlined name="pickedScreenshot" v-model="pickedScreenshot">
        <template v-slot:prepend>
          <q-icon name="image" />
        </template>
      </q-file>
      <q-btn square color="primary" icon="send" @click="sendScreenshotToBackend()" />
    </div>
    <q-card v-for="item, index in listOfItems" :key="index">
      <q-card-section class="flex column items-center justify-around" style="gap: 1rem; max-width: 30rem;">
        <div><img src="https://placehold.co/400x400" style="max-height: 5rem;" alt="image"></div>
        <div class="text-h6 text-wrap">{{ item }}</div>
      </q-card-section>

      <q-card-section>
        <p>Lowest in-game price: </p>
        <p>Lowest online price: </p>
        <p>Average in-game price: </p>
        <p>Average online price: </p>
        <p>Ducats per platinum ratio: </p>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

defineOptions({
  name: 'IndexPage'
});

const pickedScreenshot = ref<File | null>(null);
const listOfItems = ref<string[] | null>(null);
const listOFItemsUrlNames = ref<string[] | null>(null);


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
    // process received values to exclude accidental false letters and numbers related to amount of items owned
    listOfItems.value = Array.from(response.data.phrases as Iterable<string>).filter(word => {
      const hasNumber = /\d/;
      const oneLetter = /^[A-Za-z]$/;
      return !hasNumber.test(word as string) && !oneLetter.test(word as string);
    });
    listOFItemsUrlNames.value = listOfItems.value.map(e => e.replace(/ /g, '_'));
    console.log(listOfItems.value, listOFItemsUrlNames.value);
  } catch (err) {
    console.log(err);
  }
}

const getListOfTradableItems = async () => {
  console.log('connecting to node js server');
  const response = await axios.get('http://localhost:3000/tradable-items');
  console.log(response);
}

onMounted(() => {
  getListOfTradableItems()
})

</script>
