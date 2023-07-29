<script setup lang="ts">
import { useUserStore } from "../stores/User";
import MainLayout from "../layouts/MainLayout.vue";

type Product = {
  id: string;
  title: string;
  description: string;
  url: string;
  price: number;
};

const user = useSupabaseUser();

const cards = ref([
  "/visa.png",
  "/mastercard.png",
  "/applepay.png",
  "/paypal.png",
]);

const userStore = useUserStore();

const selectedArray = ref<Product[]>([]);

const totalPriceComputed = computed(() => {
  let price = 0;
  userStore.cart.forEach((item) => {
    price += item.price;
  });

  return price;
});

function selectedRadio(product: Product) {
  if (!selectedArray.value.length) {
    return selectedArray.value.push(product);
  }

  selectedArray.value.forEach((item, index) => {
    if (product.id !== item.id) {
      selectedArray.value.push(product);
    } else {
      selectedArray.value.splice(index, 1);
    }
  });
}

function goToCheckout() {
  const ids: string[] = [];
  userStore.checkout = [];
  selectedArray.value.forEach((item) => ids.push(item.id));

  const res = userStore.cart.filter((item) => ids.indexOf(item.id) !== -1);

  res.forEach((item) => userStore.checkout.push(toRaw(item)));

  return navigateTo("/checkout");
}

onMounted(() => {
  setTimeout(() => (userStore.isLoading = false), 200);
});
</script>

<template>
  <MainLayout>
    <div
      id="ShoppingCartPage"
      class="mt-4 max-w-[1200px] mx-auto px-2"
    >
      <div
        v-if="!userStore.cart.length"
        class="h-[500px] flex items-center justify-center"
      >
        <div class="pt-20">
          <img
            src="/cart-empty.png"
            alt="Cart"
            width="250"
            class="mx-auto"
          />

          <div class="text-xl text-center mt-4">No items yet?</div>

          <div
            v-if="!user"
            class="flex text-center"
          >
            <NuxtLink
              to="/auth"
              class="bg-[#fd374f] w-full text-white text-[21px] font-semibold p-1.5 rounded-full mt-4"
            >
              Sign in
            </NuxtLink>
          </div>
        </div>
      </div>
      <div
        v-else
        class="md:flex gap-4 justify-between mx-auto w-full"
      >
        <div class="md:w-[65%]">
          <div class="bg-white rounded-lg p-4">
            <div class="text-2xl font-bold mb-2">
              Shopping Cart ({{ userStore.cart.length }})
            </div>
          </div>

          <div class="bg-[#feeeef] rounded-lg p-4 mt-4">
            <div class="text-red-500 font-bold">
              Welcome Deal applicable on 1 item only
            </div>

            <div
              id="Items"
              class="bg-white rounded-lg p-4 mt-4"
            >
              <div
                v-for="product in userStore.cart"
                :key="product.id"
                class=""
              >
                <CartItem
                  :product="product"
                  :selectedArray="selectedArray"
                  @selectedRadio="selectedRadio"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="md:hidden block my-4"></div>

        <div class="md:w-[35%]">
          <div
            id="Summary"
            class="bg-white rounded-lg p-4"
          >
            <div class="text-2xl font-extrabold mb-2">Summary</div>

            <div class="flex items-center justify-between my-4">
              <div class="font-semibold">Total</div>
              <div class="text-2xl font-semibold">
                <span class="font-extrabold">
                  {{
                    totalPriceComputed.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </span>
              </div>
            </div>

            <button
              type="button"
              @click="goToCheckout"
              class="flex items-center justify-center bg-[#fd374f] text-white text-[21px] font-semibold p-1.5 rounded-full w-full mt-4"
            >
              Checkout
            </button>
          </div>

          <div
            id="PaymentProtection"
            class="bg-white rounded-lg p-4 mt-4"
          >
            <div class="text-lg font-semibold mb-2">Payment methods</div>
            <div class="flex items-center justify-start gap-8 my-4">
              <div
                class=""
                v-for="card in cards"
                :key="card"
              >
                <img
                  :src="card"
                  alt="Payment"
                  class="h-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
