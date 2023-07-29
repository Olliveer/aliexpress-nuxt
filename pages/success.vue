<script setup lang="ts">
import { useUserStore } from "../stores/User";
import MainLayout from "../layouts/MainLayout.vue";

const userStore = useUserStore();

onMounted(() => {
  setTimeout(() => {
    userStore.isLoading = false;
  }, 300);
});
</script>

<template>
  <MainLayout>
    <div
      id="SuccessPage"
      class="mt-4 max-w-[1200px] mx-auto px-2 min-h-[50vh]"
    >
      <div class="bg-white w-full p-6 min-h-[150px]">
        <div class="flex items-center text-xl">
          <Icon
            name="clarity:success-standard-line"
            color="#5fcb04"
            size="35"
          />
          <span class="pl-4"> Payment Successful </span>
        </div>
        <p class="text-sm pl-[50px]">
          Thank you for your payment. Your transaction has been completed and a
          receipt for your purchase has been emailed to you. You may log into
          your account.
        </p>
      </div>
    </div>
  </MainLayout>
</template>
