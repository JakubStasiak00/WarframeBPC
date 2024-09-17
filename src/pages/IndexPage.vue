<template>
  <q-page class="main">
    <div v-if="!listOfItems" class="file-upload">
      <q-file outlined name="pickedScreenshot" class="file-upload__field" v-model="pickedScreenshot" accept="image/*"
        label="Upload screenshot">
        <template v-slot:prepend>
          <q-icon name="image" class="file-upload__icon" />
        </template>
      </q-file>
      <q-btn square class="file-upload-button" icon="send" @click="sendScreenshotToBackend()" />
    </div>
    <div v-if="itemsData.length > 0" class="items">
      <q-card v-for="item, index in itemsData" :key="index" class="card">

        <q-card-section class="item-image">
          <img class="item-image__picture"
            :src="`https://warframe.market/static/assets/${itemsInformation[index].data.i18n.en.subIcon || itemsInformation[index].data.i18n.en.icon}`"
            :alt="itemsInformation[index].data.i18n.en.name" />
        </q-card-section>

        <q-card-section class="ducats" v-if="itemsInformation[index].data.ducats">
          <div class="ducats__price">
            <span class="ducats__amount">{{ itemsInformation[index].data.ducats }}</span><img
              class="ducats__image  ducats__image--big" src="../assets/OrokinDucats.webp" alt="ducats">
          </div>
          <div class="ducs-per-plat">
            <p class="ducs-per-plat__amount">{{ calculateDucatToPlatinumRatio(itemsInformation[index].data.ducats,
              getAveragePlatinum(item.data)) }}
            </p>
            <span class="items__ducs-per-plat-image">
              <img class="ducats__image ducats__image--big" src="../assets/OrokinDucats.webp" alt="ducat">
              <span style="font-size: 36px;">/</span>
              <img src="../assets/PlatinumLarge.webp" class="ducats__image ducats__image--big" alt="platinum">
              <q-icon name="info" class="text-subtitle2 self-start">
                <q-tooltip anchor="top middle" self="bottom left" :offset="[10, 10]">
                  Ducat per platinum ratio according to the top 5 sale orders. <br />
                  For greater accuracy use warframe.market ducanator !
                </q-tooltip>
              </q-icon>
            </span>
          </div>
        </q-card-section>

        <q-card-section class="item-name">
          <h2 class="item-name__heading">{{ itemsInformation[index].data.i18n.en.name }}</h2>
        </q-card-section>

        <q-card-section class="orders" v-if="item.data.sell.length > 0">
          <h2 class="orders__heading">Top sell orders:</h2>
          <ol class="orders__list">
            <li v-for="index in item.data.sell.length" :key="index" class="orders__item">
              Sold by <a target=”_blank”
                :href="`https://warframe.market/profile/${item.data.sell[index - 1].user.ingameName}`"
                class="orders__user">{{ item.data.sell[index - 1].user.ingameName }}</a> for {{
                  item.data.sell[index - 1].platinum }} <img src="../assets/PlatinumLarge.webp" class="ducats__image"
                alt="platinum">
            </li>
          </ol>
          <br v-if="item.data.sell.length < 5" />
          <br v-if="item.data.sell.length < 4" />
          <br v-if="item.data.sell.length < 3" />
          <br v-if="item.data.sell.length < 2" />
        </q-card-section>
        <q-card-section class="orders" v-else>
          <div>There are no online orders for this item</div>
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
import { auth } from 'src/firebaseD/firebase-config';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'IndexPage'
});

const pickedScreenshot = ref<File | null>(null);
const listOfItems = ref<string[] | null>(null);
const listOfItemsUrlNames = ref<string[] | null>(null);
const itemsData = ref<RootOrders[]>([]);
const itemsInformation = ref<RootInfo[]>([]);
const $q = useQuasar()

const sendScreenshotToBackend = async () => {
  if (!pickedScreenshot.value) {
    alert('Pick an inventory screenshot first !');
    return;
  }

  const checkCredits = await axios.post('http://localhost:3000/has-credits', { uid: auth.currentUser?.uid });
  if (!checkCredits.data.shouldAllowRequest) {
    alert(`${checkCredits.data.message}`)
    return;
  }

  const formData = new FormData();

  formData.append('screenshot', pickedScreenshot.value);

  try {
    const response = await axios.post('http://localhost:3000/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // process received values to exclude accidental false letters and numbers related to amount of items owned
    listOfItems.value = Array.from(response.data.phrases as Iterable<string>).filter(word => {
      const isOnlyNumbers = /^x?\d+$/i;
      const oneLetter = /^[A-Za-z]$/;
      return !isOnlyNumbers.test(word as string) && !oneLetter.test(word as string);
    });
    // separate displayed names from url names used to make the next api call
    listOfItemsUrlNames.value = listOfItems.value.map(e => e.replace(/ /g, '_'));

    for (const e of listOfItemsUrlNames.value) {
      try {
        const itemResponse = await axios.post('http://localhost:3000/tradable-items', { e });
        if (itemResponse.data.sendNext) {
          console.warn(`Skipping item: ${e} because it doesn't exist.`);
          $q.notify({
            message: `Error fetching item: ${e}`,
            position: 'top-left',
            timeout: 1500
          });
          continue;
        }

        itemsData.value.push(itemResponse.data.itemResponse);

        itemsInformation.value.push(itemResponse.data.itemInformation)
      } catch (err2) {
        console.error(`Error processing item ${e}:`, err2);
        continue;
      }

    }
    console.log(itemsData);
  } catch (err) {
    console.log(err);
  }
}

const getAveragePlatinum = (itemOrderData: Data): number => {
  let x = 0;
  for (let i = 0; i < itemOrderData.sell.length; i++) {
    x += itemOrderData.sell[i].platinum;
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

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: center;
  container-type: inline-size;
  container-name: main-container;
}

.file-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  &__field {
    background-color: rgb(211, 215, 247);
    border: 2px solid $primary;
    border-radius: 0.5rem;
  }
}

.items {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  height: fit-content;
}

@container main-container (max-width: 1740px) {
  .items {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

@container main-container (max-width: 1400px) {
  .items {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@container main-container (max-width: 1050px) {
  .items {
    grid-template-columns: 1fr 1fr;
  }
}

@container main-container (max-width: 680px) {
  .items {
    grid-template-columns: 1fr;
  }
}

.card {
  display: grid;
  grid-template-areas:
    "image ducats"
    "name name"
    "orders orders";
  padding: 1rem;
  grid-template-rows: max-content max-content max-content;
  justify-content: center;
  align-items: start;
  width: clamp(330px, calc(4rem + 4vw), 500px);
  min-height: 400px;
  background-color: $primary;
  color: $text-primary;
  box-shadow: 8px 8px 5px -2px rgba(0, 0, 0, 1);
  border-radius: 0.6rem;
}

.item-image {
  grid-area: image;

  &__picture {
    max-height: 5rem;
  }
}

.q-card__section {
  padding-block: 0px;
}

.ducats {
  grid-area: ducats;

  &__image {
    height: 15px;
  }

  &__image--big {
    height: 36px;
  }
}

.item-image,
.ducats {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ducats__price,
.ducs-per-plat {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ducs-per-plat__amount,
.ducats__amount {
  font-size: 22px;
  margin-bottom: 0;
}

.items__ducs-per-plat-image {
  display: flex;
  align-items: center;
}

.item-name {
  grid-area: name;
}

.item-name__heading,
.orders__heading {
  font-size: clamp(1rem, 0.8rem + 1vw, 2rem);
  line-height: 1.7rem;
  text-wrap: stable;
}

.orders {
  grid-area: orders;
}

.orders__user {
  color: $clr-link-dormant;

  &:hover {
    color: $clr-link-hover;
  }
}

ol {
  padding-left: 1rem;
}
</style>