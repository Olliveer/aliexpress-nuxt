<script setup lang="ts">
type InputProps = {
  input: string;
  error: string;
  placeholder: string;
  max?: number;
};

const emit = defineEmits(["update:input"]);

const props = defineProps<InputProps>();
const { error, input, max, placeholder } = toRefs(props);

const isFocused = ref(false);

const inputComputed = computed({
  get: () => input.value,
  set: (value: string) => emit("update:input", value),
});
</script>

<template>
  <div>
    <ClientOnly>
      <input
        class="w-full bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 border text-sm border-[#eff0eb] rounded-lg p-3 placeholder-gray-500 dark:placeholder-gray-200 focus:outline-none"
        :placeholder="placeholder"
        :maxlength="max"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :class="{
          'border-gray-900 dark:border-gray-200': isFocused,
          'border-red-500': error,
        }"
        v-model="inputComputed"
        autocomplete="off"
      />
    </ClientOnly>

    <span
      v-if="error"
      class="text-red-500 text-[14px] font-semibold"
    >
      {{ error }}
    </span>
  </div>
</template>
