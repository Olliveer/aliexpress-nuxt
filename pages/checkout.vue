<script setup lang="ts">
import { useUserStore } from "../stores/User";
import MainLayout from "../layouts/MainLayout.vue";
// import Stripe from "stripe";
import { StripeCardCvcElementChangeEvent } from "@stripe/stripe-js";

type Product = {
  id: number;
  title: string;
  description: string;
  url: string;
  price: number;
};

definePageMeta({ middleware: "auth" });

const user = useSupabaseUser();
const route = useRoute();
const userStore = useUserStore();

let stripe: any = null;
let elements: any = null;
let card: any = null;
const form = ref(null);
const total = ref(0);
const clientSecret = ref("");
const currentAddress = ref<any>(null);
const isProcessing = ref(false);

onBeforeMount(async () => {
  if (userStore.checkout.length < 1) {
    return navigateTo("/cart");
  }

  total.value = 0.0;

  if (user.value) {
    currentAddress.value = await useFetch(
      `/api/prisma/get-address-by-user/${user.value?.id}`
    );
    setTimeout(() => (userStore.isLoading = false), 200);
  }
});

onMounted(() => {
  isProcessing.value = false;

  userStore.checkout.forEach((item) => {
    total.value += item.price;
  });
});

async function stripeInit() {
  const runtimeConfig = useRuntimeConfig();
  // @ts-ignore
  stripe = Stripe(runtimeConfig.public.stripePk as string, {
    apiVersion: "2022-11-15",
    typescript: true,
  });

  const res = await $fetch("/api/stripe/paymentintent", {
    method: "POST",
    body: {
      amount: total.value,
    },
  });

  clientSecret.value = res.client_secret as string;

  if (stripe) {
    //@ts-ignore
    elements = stripe.elements();
  }
  const style = {
    base: {
      fontSize: "18px",
    },
    invalid: {
      fontFamily: "Arial, sans-serif",
      color: "#ee4b2b",
      iconColor: "#ee4b2b",
    },
  };

  card = elements.create("card", { style, hidePostalCode: true });

  card.mount("#card-element");
  card.on("change", (event: StripeCardCvcElementChangeEvent) => {
    const button = document.querySelector("button");
    if (button) {
      button.disabled = event.empty;
    }
    const cardError = document.getElementById("card-error");
    if (cardError) {
      cardError.textContent = event.error ? event.error.message : "";
    }
  });

  isProcessing.value = false;
}

async function pay() {
  if (currentAddress.value && currentAddress.value.data === "") {
    return showError("Please add shippping address");
  }

  isProcessing.value = true;

  const result = await stripe.confirmCardPayment(clientSecret.value, {
    payment_method: { card },
  });

  if (result.error) {
    showError(result.error.message);
    isProcessing.value = false;
  } else {
    await createOrder(result.paymentIntent.id);
    userStore.cart = [];
    userStore.checkout = [];

    setTimeout(() => {
      return navigateTo("/success");
    }, 500);
  }
}

async function createOrder(stripeId: string) {
  await useFetch("/api/prisma/create-order", {
    method: "POST",
    body: {
      stripeId,
      userId: user.value?.id,
      name: currentAddress.value?.data.name,
      address: currentAddress.value?.data.address,
      zipCode: currentAddress.value?.data.zipCode,
      city: currentAddress.value?.data.city,
      country: currentAddress.value?.data.country,
      products: userStore.checkout,
    },
  });
}

function showError(error: string) {
  const cardError = document.getElementById("card-error");
  if (cardError) {
    cardError.textContent = error;
    setTimeout(() => {
      cardError.textContent = "";
    }, 4000);
  }
}

watch(
  () => total.value,
  () => {
    if (total.value > 0) {
      stripeInit();
    }
  }
);
</script>

<template>
  <MainLayout>
    <div
      id="CheckoutPage"
      class="mt-4 max-w-[1200px] mx-auto px-2"
    >
      <div class="md:flex gap-4 justify-between mx-auto w-full">
        <div class="md:w-[65%]">
          <div
            class="bg-white dark:bg-zinc-900 dark:text-gray-200 rounded-lg p-4"
          >
            <div class="text-xl font-semibold mb-2">Shipping Address</div>

            <div
              v-if="currentAddress && currentAddress.data"
              class=""
            >
              <NuxtLink
                to="/address"
                class="flex items-center pb-2 text-blue-500 hover:text-red-400"
              >
                <Icon
                  name="mdi:plus"
                  size="18"
                  class="mr-2"
                />
                Update Address
              </NuxtLink>

              <div class="pt-2 border-t">
                <div class="underline pb-1">Delivery Address</div>

                <ul class="text-xs">
                  <li class="flex items-center gap-2">
                    <div class="">Contact name:</div>
                    <div class="font-bold">{{ currentAddress?.data.name }}</div>
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="">Address</div>
                    <div class="font-bold">
                      {{ currentAddress?.data.address }}
                    </div>
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="">Zip Code:</div>
                    <div class="font-bold">
                      {{ currentAddress?.data.zipCode }}
                    </div>
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="">City:</div>
                    <div class="font-bold">
                      {{ currentAddress?.data.city }}
                    </div>
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="">Country:</div>
                    <div class="font-bold">
                      {{ currentAddress?.data.country }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <NuxtLink
              v-else
              to="/address"
              class="flex items-center pb-2 text-blue-500 hover:text-red-400"
            >
              <Icon
                name="mdi:plus"
                size="18"
                class="mr-2"
              />
              Add New Address
            </NuxtLink>
          </div>

          <div
            id="Items"
            class="bg-white dark:bg-zinc-900 dark:text-gray-200 rounded-lg p-4 mt-4"
          >
            <div
              class=""
              v-for="product in userStore.checkout"
              :key="product.id"
            >
              <CheckoutItem :product="product" />
            </div>
          </div>
        </div>

        <div class="md:hidden block my-4"></div>

        <div class="md:w-[35%]">
          <div
            id="PlaceOrder"
            class="bg-white dark:bg-zinc-900 dark:text-gray-200 rounded-lg p-4"
          >
            <div class="text-2xl font-extrabold mb-2">Summary</div>

            <div class="flex items-center justify-between my-4">
              <div>Total Shipping</div>
              <div class="">Free</div>
            </div>

            <div class="border-t"></div>

            <div class="flex items-center justify-between my-4">
              <div class="font-semibold">Total</div>
              <div class="text-2xl font-semibold">
                <span class="font-extrabold">
                  {{
                    total.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </span>
              </div>
            </div>

            <form @submit.prevent="pay">
              <div
                class="border border-gray-500 p-2 rounded-sm"
                id="card-element"
              ></div>

              <p
                id="card-error"
                role="alert"
                class="text-red-700 text-center font-semibold"
              ></p>

              <button
                type="submit"
                :disabled="isProcessing"
                class="mt-4 bg-gradient-to-r from-[#fe630c] to-[#ff3200] w-full text-white text-[21px] font-semibold p-1.5 rounded-full"
                :class="isProcessing ? 'opacity-70' : 'opacity-100'"
              >
                <Icon
                  v-if="isProcessing"
                  name="eos-icons:loading"
                />
                <div v-else>Place order</div>
              </button>
            </form>
          </div>

          <div
            class="bg-white dark:bg-zinc-900 dark:text-gray-200 rounded-lg p-4 mt-4"
          >
            <div class="text-lg font-semibold mb-2 mt-2">AliExpress</div>
            <p class="my-2">
              AliExpress keeps your information and payment safe
            </p>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
