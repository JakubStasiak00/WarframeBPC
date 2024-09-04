<template>
  <q-page class="row items-center justify-center q-py-md base-font-size" style="gap: 40px;">
    <div v-if="!listOfItems" class="row items-center justify-around file-upload" style="gap: 1.5rem;">
      <q-file outlined name="pickedScreenshot" class="file-upload__field" v-model="pickedScreenshot" accept="image/*"
        label="Upload screenshot">
        <template v-slot:prepend>
          <q-icon name="image" />
        </template>
      </q-file>
      <q-btn square color="primary" icon="send" @click="sendScreenshotToBackend()" />
    </div>
    <div v-if="itemsData.length > 0" class="row items-center justify-center q-py-md"
      style="gap: 40px; display: grid; padding-inline: 3rem" :style="defineCardGrid()">
      <q-card v-for="item, index in itemsData" :key="index" style="min-width: 13rem; " class="itemCardLayout">

        <q-card-section class="flex column items-center justify-around"
          style="gap: 1rem; max-width: 30rem; grid-area: itemIcon;">
          <div><img
              :src="`https://warframe.market/static/assets/${itemsInformation[index].data.i18n.en.subIcon || itemsInformation[index].data.i18n.en.icon}`"
              style="max-height: 5rem;" alt="image"></div>
          <div class="text-h6 text-wrap">{{ itemsInformation[index].data.i18n.en.name }}</div>
        </q-card-section>

        <q-card-section v-if="itemsInformation[index].data.ducats" style="grid-area: ducats;">
          <p class="flex text-h6 justify-center"><span>{{ itemsInformation[index].data.ducats }}</span><img
              src="../assets/OrokinDucats.webp" style="max-height: 32px;" alt="ducat"></p>
        </q-card-section>

        <q-card-section class="flex items-center text-h6" v-if="itemsInformation[index].data.ducats"
          style="grid-area: ducsPerPlat;">
          <p>{{ calculateDucatToPlatinumRatio(itemsInformation[index].data.ducats,
            getAveragePlatinum(item.data)) }}
          </p>
          <p class="flex items-center">
            <img src="../assets/OrokinDucats.webp" style="max-height: 32px;" alt="ducat">
            <span>/</span>
            <img src="../assets/PlatinumLarge.webp" style="max-height: 24px;" alt="platinum">
            <q-icon name="info" class="text-subtitle2 self-start">
              <q-tooltip anchor="top middle" self="bottom left" :offset="[10, 10]">
                Ducat per platinum ratio according to the top 5 sale orders. <br />
                For greater accuracy use warframe.market ducanator !
              </q-tooltip>
            </q-icon>
          </p>
        </q-card-section>

        <q-card-section style="grid-area: sellOrders;">
          <p class="text-subtitle2">Top sell orders:</p>
          <ol>
            <li v-for="index in item.data.sell.length" :key="index">
              Sold by <a target=”_blank” style="text-decoration: none;"
                :href="`https://warframe.market/profile/${item.data.sell[index - 1].user.ingameName}`"
                class="text-accent">{{ item.data.sell[index - 1].user.ingameName }}</a> for {{
                  item.data.sell[index - 1].platinum }} <img src="../assets/PlatinumLarge.webp" style="max-height: 16px;"
                alt="platinum">
            </li>
          </ol>
          <br v-if="item.data.sell.length < 5" />
          <br v-if="item.data.sell.length < 4" />
          <br v-if="item.data.sell.length < 3" />
          <br v-if="item.data.sell.length < 2" />
        </q-card-section>

      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { RootOrders, Data } from 'src/types/TopOrders';
import { RootInfo } from 'src/types/ItemInformation';
import { useQuasar } from 'quasar';
import { auth } from 'src/firebaseD/firebase-config';

defineOptions({
  name: 'IndexPage'
});

const $q = useQuasar();
const pickedScreenshot = ref<File | null>(null);
const listOfItems = ref<string[] | null>(null);
const listOfItemsUrlNames = ref<string[] | null>(null);
const itemsData = ref<RootOrders[]>([]);
const itemsInformation = ref<RootInfo[]>([]);

const cardStyles = {
  small: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  medium: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  large: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
};

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

const defineCardGrid = () => {
  if ($q.screen.gt.md) {
    return cardStyles.large
  }
  if ($q.screen.lt.md) {
    return cardStyles.small
  }
  return cardStyles.medium
}

const getAveragePlatinum = (itemOrderData: Data): number => {
  let x = 0;
  for (let iterator = 0; iterator < itemOrderData.sell.length; iterator++) {
    x += itemOrderData.sell[iterator].platinum;
  }
  return parseFloat((x / itemOrderData.sell.length).toFixed(2));
}

const calculateDucatToPlatinumRatio = (ducat: number, platinum: number) => {
  return (ducat / platinum).toFixed(2);
}

onMounted(() => {
  console.log(auth);
})

</script>

<style lang="scss">
.file-upload {
  &__field {
    background-color: rgb(241, 241, 241);
    border: 2px solid black;
    border-radius: 0.5rem;
  }
}

.itemCardLayout {
  display: grid;
  grid-template-areas:
    "itemIcon itemIcon itemIcon itemIcon itemIcon itemIcon"
    "ducats ducats ducats ducsPerPlat ducsPerPlat ducsPerPlat"
    "sellOrders sellOrders sellOrders sellOrders sellOrders sellOrders ";
  grid-template-columns: 1fr 1fr 10fr 10fr 2fr 2fr;
  outline: 3px solid rgb(56, 56, 56);
  border-radius: 0.8rem;
}

ol {
  padding-left: 1rem;
}
</style>