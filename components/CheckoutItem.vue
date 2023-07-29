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
</script>

<template>
  <div class="flex justify-start my-2">
    <img
      :src="product.url"
      :alt="product.title"
      class="rounded-md md:w-[150px] w-[90px]"
    />

    <div class="overflow-hidden pl-2">
      <div class="flex items-center">
        <span
          class="bg-[#fd374f] text-white text-[9px] font-semibold px-1.5 rounded-sm min-w-[80px]"
        >
          Welcome Deal
        </span>
        <div class="truncate pl-2">{{ product.title }}</div>
      </div>

      <div class="text-lg font-semibold mt-2">
        <span class="font-bold"
          >{{
            product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
          }}
        </span>
      </div>
    </div>
  </div>
</template>
