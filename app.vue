<script setup lang="ts">
import MenuOverlay from "./components/MenuOverlay.vue";
import { useUserStore } from "./stores/User";

const userStore = useUserStore();

const route = useRoute();

const windowWidth = ref(process.client ? window.innerWidth : "");

onMounted(() => {
  userStore.isLoading = false;

  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});

watch(
  () => windowWidth.value,
  () => {
    if (Number(windowWidth.value) > 768) {
      userStore.isMenuOverlay = false;
    }
  }
);

watch(
  () => route.fullPath,
  () => {
    userStore.isLoading = true;
  }
);
</script>

<template>
  <div class="fixed z-[-1] bg-[#f2f2f2] w-full h-screen"></div>
  <NuxtPage />

  <MenuOverlay
    :class="[
      {
        'max-h-[100vh] transition-all duration-200 ease-in visible':
          userStore.isMenuOverlay,
      },
      {
        'max-h-0 transition-all duration-200 ease-out invisible':
          !userStore.isMenuOverlay,
      },
    ]"
  />
</template>
