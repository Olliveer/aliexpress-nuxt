<script setup lang="ts">
type Product = {
  id: string;
  title: string;
  description: string;
  url: string;
  price: number;
};

type ProductProps = {
  product: Product;
};

const props = defineProps<ProductProps>();

const { product } = toRefs(props);

const priceComputed = computed(() => {
  return product.value.price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
});

const oldPriceComputed = computed(() => {
  const res = product.value.price + product.value.price / 20 / 100;
  return res.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
});
</script>

<template>
  <div
    :id="`ProductComponent${product.id}`"
    class="bg-white dark:bg-zinc-900 inline-block rounded hover:shadow-md cursor-pointer p-1 w-full"
  >
    <NuxtLink :to="`/item/${product.id}`">
      <img
        :src="product.url"
        :alt="product.title"
        class="rounded-t"
      />

      <div id="ProductDetails">
        <span class="flex items-center justify-start gap-3 px-1 pt-1">
          <span class="text-[#ff6674] font-semibold">
            {{ priceComputed }}
          </span>
          <span
            class="text-gray-500 dark:text-gray-200 text-sm text-light line-through"
          >
            {{ oldPriceComputed }}
          </span>
        </span>

        <span
          class="px-1 relative -top-1.5 text-[#ff6674] text-xs font-semibold"
        >
          Extra 20% Off
        </span>

        <div class="flex items-center gap-1 px-1 relative -top-1">
          <span
            class="bg-[#fd374f] text-white text-[9px] font-semibold px-1.5 rounded-sm"
          >
            Wellcome Deal
          </span>
          <span
            class="bg-[#f5f5f5] border text-[#c08562] text-[9px] font-semibold rounded-sm"
          >
            Top Selling
          </span>
        </div>

        <p
          class="flex items-center px-1 pt-0.5 text-xs text-[#252525] dark:text-gray-200"
        >
          5,000 sold
          <Icon
            name="material-symbols:star-rate"
            class="ml-1.5 dark:text-yellow-300"
          />
          4.7
        </p>

        <p class="px-1 pt-0.5 text-xs text-[#252525] dark:text-gray-200">
          {{ product.title.substring(0, 60) }}
        </p>

        <p class="px-1 pb-1">
          <span class="text-[#009a66] text-xs font-semibold">
            Free Shipping
          </span>
        </p>
      </div>
    </NuxtLink>
  </div>
</template>
