<script setup lang="ts">
import { useUserStore } from "../stores/User";
import MainLayout from "../layouts/MainLayout.vue";
import { Products } from "@prisma/client";

type ProductsData = {
  data: Products[];
};

const userStore = useUserStore();
const products = ref<ProductsData>({ data: [] } as ProductsData);

onBeforeMount(async () => {
  products.value = (await useFetch("/api/prisma/get-all-products")) as any;
  setTimeout(() => (userStore.isLoading = false), 1000);
});
</script>

<template>
  <MainLayout>
    <div
      id="IndexPage"
      class="mt-4 max-w-[1200px] mx-auto px-2"
    >
      <div
        class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-4 grid-cols-2 gap-2"
      >
        <div
          v-for="product in products.data"
          :key="product.id"
          class=""
        >
          <ProductComponent :product="product" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>
