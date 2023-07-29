<script setup lang="ts">
import { useUserStore } from "../stores/User";

const userStore = useUserStore();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

function goTo(path: string) {
  userStore.isMenuOverlay = false;
  return navigateTo(`/${path}`);
}

async function handleSignOut() {
  await supabase.auth.signOut();
  userStore.isMenuOverlay = false;

  return navigateTo("/");
}

function handleSignIn() {
  userStore.isMenuOverlay = false;
  return navigateTo("/auth");
}
</script>

<template>
  <div
    id="MenuOverlay"
    class="fixed z-50 bottom-0 h-full w-full bg-white px-3"
  >
    <div class="flex items-center justify-between py-5">
      <NuxtLink
        to="/"
        @click="userStore.isMenuOverlay = false"
      >
        <img
          src="/aliExpress-logo.png"
          alt="logo"
          width="170"
        />
      </NuxtLink>

      <button
        @click="userStore.isMenuOverlay = false"
        type="button"
        class="rounded-full p-1 hover:bg-gray-200"
      >
        <Icon
          name="mdi:close"
          size="30"
        />
      </button>
    </div>

    <div class="flex items-center justify-between pt-5">
      <ul class="w-full">
        <li
          @click="goTo('orders')"
          class="relative flex items-center justify-between py-2.5 border-b px-3 hover;bg-gray-100 cursor-pointer"
        >
          <div class="flex items-center text-[20px] font-semibold">
            <Icon
              name="ph:pen-light"
              size="33"
            />
            <span class="pl-4">My Orders</span>
          </div>
        </li>
        <li
          @click="goTo('cart')"
          class="relative flex items-center justify-between py-2.5 border-b px-3 hover;bg-gray-100 cursor-pointer"
        >
          <div class="flex items-center text-[20px] font-semibold">
            <Icon
              name="ph:shopping-cart-simple-light"
              size="33"
            />
            <span class="pl-4">Cart</span>
          </div>

          <div
            class="flex items-center justify-center bg-[#ff4646] h-[35px] min-w-[35px] text-lg text-white rounded-full"
          >
            {{ userStore.cart.length }}
          </div>
        </li>
        <li
          v-if="user"
          @click="handleSignOut"
          class="relative flex items-center justify-between py-2.5 border-b px-3 hover;bg-gray-100 cursor-pointer"
        >
          <div class="flex items-center text-[20px] font-semibold">
            <Icon
              name="ph:sign-out-light"
              size="33"
            />
            <span class="pl-4">Sign Out</span>
          </div>
        </li>
        <li
          v-else
          @click="handleSignIn"
          class="relative flex items-center justify-between py-2.5 border-b px-3 hover;bg-gray-100 cursor-pointer"
        >
          <div class="flex items-center text-[20px] font-semibold">
            <Icon
              name="ph:sign-in-light"
              size="33"
            />
            <span class="pl-4">Sign In / Register</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
