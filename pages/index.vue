<script setup lang="ts">
import MainLayout from "../layouts/MainLayout.vue";
import Loading from "../components/Loading.vue";

const { data, pending, status } = await useFetch(
  "/api/prisma/get-all-products",
  {
    lazy: true,
  }
);
</script>

<template>
  <MainLayout>
    <Loading :loading="pending" />
    <div
      id="IndexPage"
      class="mt-4 max-w-[1200px] mx-auto px-2"
    >
      <div
        class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-4 grid-cols-2 gap-2"
      >
        <div
          v-for="product in data"
          :key="product.id"
          class=""
        >
          <ProductComponent :product="product" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>
