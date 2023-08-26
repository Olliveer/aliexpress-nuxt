<script setup lang="ts">
import { useUserStore } from "../stores/User";
import MainLayout from "../layouts/MainLayout.vue";

type Order = {
  id: string;
  userId: string;
  stripeId: string;
  name: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  orderItem: [
    {
      id: string;
      orderId: string;
      createdAt: string;
      product: {
        id: string;
        title: string;
        description: string;
        price: number;
        url: string;
        createdAt: string;
      };
    }
  ];
};

const userStore = useUserStore();
const user = useSupabaseUser();

const { data } = await useFetch<Order[]>(
  `/api/prisma/get-all-orders-by-user/${user.value?.id}`
);

onMounted(() => {
  if (!user.value) {
    return navigateTo("/auth");
  }

  setTimeout(() => {
    userStore.isLoading = false;
  }, 200);
});
</script>

<template>
  <MainLayout>
    <div
      id="OrdersPage"
      class="mt-4 max-w-[1200px] mx-auto px-2 min-h-[50vh]"
    >
      <div
        class="bg-white dark:bg-zinc-900 dark:text-gray-200 w-full p-6 min-h-[150px]"
      >
        <div class="flex items-center text-xl">
          <Icon
            name="carbon:delivery"
            color="#5fcb04"
            size="35"
          />
          <span class="pl-4">Orders</span>
        </div>
        <div
          class="text-sm pl-[50px]"
          v-if="data && data.length"
          v-for="order in data"
          :key="order.id"
        >
          <div class="border-b py-1">
            <p class="">Stripe ID: {{ order.stripeId }}</p>

            <div
              class="pt-2"
              v-for="item in order.orderItem"
              :key="item.id"
            >
              <NuxtLink
                class="flex items-center gap-3 p-1 hover:underline hover:text-blue-500"
                :to="`/item/${item.product.id}`"
              >
                <img
                  :src="item.product.url"
                  class="w-10 h-10 object-cover"
                />
                <p class="text-sm">{{ item.product.title }}</p>
              </NuxtLink>
            </div>

            <div class="pt-2 pb-5">
              Delivery Address: {{ order.name }}, {{ order.address }},
              {{ order.city }}, {{ order.zipCode }}
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex items-center justify-center"
        >
          You have no orders history.
        </div>
      </div>
    </div>
  </MainLayout>
</template>
