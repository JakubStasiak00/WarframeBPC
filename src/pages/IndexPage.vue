<template>
  <q-page class="row items-center justify-center q-py-md" style="gap: 40px;">
    <div v-if="!listOfItems" class="row items-center justify-around" style="gap: 1.5rem;">
      <q-file outlined name="pickedScreenshot" v-model="pickedScreenshot">
        <template v-slot:prepend>
          <q-icon name="image" />
        </template>
      </q-file>
      <q-btn square color="primary" icon="send" @click="sendScreenshotToBackend()" />
    </div>
    <div v-if="itemsData.length > 0" class="row items-center justify-center q-py-md" style="gap: 40px;"
      :style="listOfItems ? 'display: grid; grid-template-columns: repeat(4, 1fr); padding-inline: 3rem' : ''">
      <q-card v-for="item, index in itemsData" :key="index" style="min-width: 13rem;">
        <q-card-section class="flex column items-center justify-around" style="gap: 1rem; max-width: 30rem;">
          <div><img :src="`https://warframe.market/static/assets/${itemsInformation[index].data.i18n.en.subIcon}`"
              style="max-height: 5rem;" alt="image"></div>
          <div class="text-h6 text-wrap">{{ itemsInformation[index].data.i18n.en.name }}</div>
        </q-card-section>
        <q-card-section>
          <p>Top sell orders:</p>
          <ol>
            <li>
              {{ item.data.sell[0].platinum }} <img src="../assets/PlatinumLarge.webp" style="max-height: 16px;" alt="">
            </li>
            <li>
              {{ item.data.sell[1].platinum }} <img src="../assets/PlatinumLarge.webp" style="max-height: 16px;" alt="">
            </li>
            <li>
              {{ item.data.sell[2].platinum }} <img src="../assets/PlatinumLarge.webp" style="max-height: 16px;" alt="">
            </li>
            <li>
              {{ item.data.sell[3].platinum }} <img src="../assets/PlatinumLarge.webp" style="max-height: 16px;" alt="">
            </li>
            <li>
              {{ item.data.sell[4].platinum }} <img src="../assets/PlatinumLarge.webp" style="max-height: 16px;" alt="">
            </li>
          </ol>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

defineOptions({
  name: 'IndexPage'
});

interface ItemData {
  data: any;
}

const pickedScreenshot = ref<File | null>(null);
const listOfItems = ref<string[] | null>(null);
const listOfItemsUrlNames = ref<string[] | null>(null);
const itemsData = ref<ItemData[]>([]);
const itemsInformation = ref<ItemData[]>([]);

console.log(itemsData.value);

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
    // process received values to exclude accidental false letters and numbers related to amount of items owned
    listOfItems.value = Array.from(response.data.phrases as Iterable<string>).filter(word => {
      const hasNumber = /\d/;
      const oneLetter = /^[A-Za-z]$/;
      return !hasNumber.test(word as string) && !oneLetter.test(word as string);
    });
    // separate displayed names from url names used to make the next api call
    listOfItemsUrlNames.value = listOfItems.value.map(e => e.replace(/ /g, '_'));

    for (const e of listOfItemsUrlNames.value) {
      console.log(e);
      const itemResponse = await axios.post('http://localhost:3000/tradable-items', { e });
      console.log(itemResponse);
      itemsData.value.push(itemResponse.data.itemResponse);

      itemsInformation.value.push(itemResponse.data.itemInformation)
    }
    console.log(itemsData);
  } catch (err) {
    console.log(err);
  }
}

</script>
