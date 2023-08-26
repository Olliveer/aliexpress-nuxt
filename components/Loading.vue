<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    required: true,
    default: false,
  },
});
</script>

<template>
  <div
    v-if="loading"
    class="fixed bg-black/40 inset-0 w-full z-40 flex items-center justify-center h-[100vh] overflow-hidden"
  >
    <div class="p-3 rounded-md bg-black/20">
      <Icon
        name="eos-icons:bubble-loading"
        size="100"
        color="#fd374f"
      />
      <div class="text-center pt-5 text-xl font-bold text-white">
        Loading...
      </div>
    </div>
  </div>
</template>
