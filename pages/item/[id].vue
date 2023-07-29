<script setup lang="ts">
import { useUserStore } from "../../stores/User";
import MainLayout from "../../layouts/MainLayout.vue";
import { Products } from "@prisma/client";

type ProductData = {
  data: Products | null;
};

const userStore = useUserStore();
const route = useRoute();

const currentImage = ref<string | null>(null);

const images = ref([
  "",
  "https://picsum.photos/id/1/800/800",
  "https://picsum.photos/id/11/800/800",
  "https://picsum.photos/id/12/800/800",
  "https://picsum.photos/id/13/800/800",
  "https://picsum.photos/id/14/800/800",
  "https://picsum.photos/id/15/800/800",
]);
const product = ref<ProductData | null>(null);

onBeforeMount(async () => {
  product.value = (await useFetch(
    `/api/prisma/get-product-by-id/${route.params.id}`
  )) as any;
});

function addToCart() {
  userStore.cart.push(product.value!.data!);
}

const isInCart = computed(() => {
  return userStore.cart.some((item) => route.params.id === item.id);
});

const priceComputed = computed(() => {
  if (product.value && product.value.data) {
    return product.value.data.price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  return "0.00";
});

watchEffect(() => {
  if (product.value && product.value.data) {
    currentImage.value = product.value.data.url;
    images.value[0] = product.value.data.url;
    userStore.isLoading = false;
  }
});
</script>

<template>
  <MainLayout>
    <div
      id="ItemPage"
      class="mt-4 max-w-[1200px] mx-auto px-2"
    >
      <div class="md:flex gap-4 justify-between mx-auto w-full">
        <div class="md:w-[40%]">
          <img
            v-if="currentImage"
            :src="currentImage"
            alt="Item"
            class="rounded-lg object-fit"
          />

          <div
            v-if="images[0] !== ''"
            class="flex items-center justify-center mt-2"
          >
            <div
              v-for="(image, index) in images"
              :key="index"
            >
              <img
                @mouseover="currentImage = image"
                @click="currentImage = image"
                width="70"
                :src="image"
                alt="Item"
                class="rounded-md object-fit border-[3px] cursor-pointer"
                :class="currentImage === image ? 'border-[#ff5353]' : ''"
              />
            </div>
          </div>
        </div>

        <div class="md:w-[60%] bg-white p-3 rounded-lg">
          <div
            v-if="product && product.data"
            class=""
          >
            <p class="mb-2">{{ product.data.title }}</p>
            <p class="font-light text-[12px] mb-2">
              {{ product.data.description }}
            </p>
          </div>
          <div class="flex items-center pt-1.5">
            <span class="h-4 min-w-4 rounded-full p-0.5 bg-[#ffd000] mr-2">
              <Icon
                name="material-symbols:star-rounded"
                class="-mt-[17px]"
                size="12"
              />
            </span>
            <p class="text-[#ff5353]">Extra 5% off</p>
          </div>

          <div class="flex items-center justify-start my-2">
            <Icon
              name="material-symbols:star-rounded"
              color="#ff5353"
            />
            <Icon
              name="material-symbols:star-rounded"
              color="#ff5353"
            />
            <Icon
              name="material-symbols:star-rounded"
              color="#ff5353"
            />
            <Icon
              name="material-symbols:star-rounded"
              color="#ff5353"
            />
            <Icon
              name="material-symbols:star-rounded"
              color="#ff5353"
            />
            <span class="text-[13px] font-light ml-2">
              5 213 Reviews 1,000+ orders
            </span>
          </div>

          <div class="border-b"></div>

          <div class="flex items-center justify-start gap-2 my-2">
            <div class="text-xl font-bold">{{ priceComputed }}</div>
            <span
              class="bg-[#f5f5f5] border text-[#c08562] text-[9px] font-semibold px-1.5 rounded-sm"
            >
              70% off
            </span>
          </div>

          <p class="text-[#009a66] text-xs font-semibold pt-1">
            Free 11-day delivery over $49
          </p>
          <p class="text-[#009a66] text-xs font-semibold pt-1">Free Shipping</p>

          <div class="py-2"></div>

          <button
            @click="addToCart()"
            :disabled="isInCart"
            class="px-6 py-2 rounded-lg text-white text-lg font-semibold bg-gradient-to-r from-[#ff851a] to-[#ffac2c]"
          >
            <div v-if="isInCart">Is Added</div>
            <div v-else>Add to Cart</div>
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
