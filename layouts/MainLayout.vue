<script setup lang="ts">
import { useUserStore } from "~/stores/User";
const colorMode = useColorMode();

const userStore = useUserStore();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const isAccountMenu = ref(false);
const searchItem = ref("");
const isSearching = ref(false);
const isCartHover = ref(false);
const items = ref<any>();

const searchByName = useDebounce(async () => {
  isSearching.value = true;

  items.value = await useFetch(
    `/api/prisma/search-by-name/${searchItem.value}`
  );

  isSearching.value = false;
}, 100);

function handleToggleTheme(theme: string) {
  colorMode.preference = theme;
  localStorage.setItem("theme", theme);
}

watch(
  () => searchItem.value,
  async () => {
    if (!searchItem.value) {
      setTimeout(() => {
        items.value = "";
        isSearching.value = false;
        return;
      }, 500);
    }
    searchByName();
  }
);
</script>

<template>
  <div
    id="MainLayout"
    class="w-full fixed z-50"
  >
    <div
      id="TopMenu"
      class="w-full bg-[#fafafa] dark:bg-zinc-900 border-b dark:border-b-zinc-600 md:block hidden"
    >
      <ul
        class="flex items-center justify-end text-xs text-[#333333] dark:text-gray-200 font-light px-2 h-10 max-w-[1200px]"
      >
        <li
          class="border-r border-r-gray-400 px-3 hover:text-[#ff4646] cursor-pointer"
        >
          Sell on AlieExpress
        </li>
        <li
          class="border-r border-r-gray-400 px-3 hover:text-[#ff4646] cursor-pointer"
        >
          Cookie Preferences
        </li>
        <li
          class="border-r border-r-gray-400 px-3 hover:text-[#ff4646] cursor-pointer"
        >
          Help
        </li>
        <li
          class="border-r border-r-gray-400 px-3 hover:text-[#ff4646] cursor-pointer"
        >
          Buyer Protection
        </li>
        <li class="px-3 hover:text-[#ff4646] cursor-pointer">
          <Icon
            name="ic:sharp-install-mobile"
            size="17"
          />
          App
        </li>

        <li
          @mouseenter="isAccountMenu = true"
          @mouseleave="isAccountMenu = false"
          class="relative flex items-center px-2.5 hover:text-[#ff4646] h-full cursor-pointer"
          :class="
            isAccountMenu
              ? 'bg-white dark:bg-zinc-900 border z-40 shadow-[0_15px_100px_40px_rgba(0,0,0,0.3)]'
              : 'border border-[#fafafa] dark:border-zinc-500'
          "
        >
          <Icon
            name="ph:user-thin"
            size="17"
          />
          Account
          <Icon
            name="mdi:chevron-down"
            size="15"
            class="ml-5"
          />

          <div
            id="AccountMenu"
            class="absolute bg-white w-[220px] dark:bg-zinc-900 text-[#333333] dark:text-gray-200 -40 top-[38px] -left-[100px] border-b border-x dark:border-zinc-900 rounded-sm shadow-sm"
            v-if="isAccountMenu"
          >
            <div v-if="!user">
              <div class="text-semibold text-[15px] my-4 px-3">
                Wellcome to AliExpress!
              </div>
              <div class="flex items-center gap-1 px-3 mb-3">
                <NuxtLink
                  to="/auth"
                  class="bg-[#ff4646] text-center w-full text-[16px] rounded-sm text-white font-semibold p-2"
                >
                  Login / Register
                </NuxtLink>
              </div>
            </div>
            <div class="border-b" />
            <ul class="bg-white dark:bg-gray-950">
              <li
                @click="navigateTo('/orders')"
                class="text-[13px] py-2 px-4 w-full hover:bg-gray-200 dark:hover:bg-transparent dark:hover:text-[#ff4646]"
              >
                My Orders
              </li>

              <li
                v-if="user"
                @click="supabase.auth.signOut()"
                class="text-[13px] py-2 px-4 w-full hover:bg-gray-200 dark:hover:bg-transparent dark:hover:text-[#ff4646]"
              >
                Sign Out
              </li>
            </ul>
          </div>
        </li>

        <li class="px-3">
          <Icon
            v-if="colorMode.value === 'light'"
            name="ph:sun"
            size="20"
            @click="handleToggleTheme('dark')"
          />
          <Icon
            v-else
            name="ph:moon-stars"
            size="20"
            @click="handleToggleTheme('light')"
          />
        </li>
      </ul>
    </div>
    <div
      id="MainHeader"
      class="flex items-center w-full bg-white dark:bg-zinc-900"
    >
      <div
        class="flex lg:justify-start justify-between gap-10 max-w-[1150px] w-full px-3 py-5 mx-auto"
      >
        <NuxtLink
          to="/"
          class="min-w-[170px]"
        >
          <img
            src="/aliExpress-logo.png"
            width="170"
            alt="logo"
          />
        </NuxtLink>
        <div class="max-w-[700px] w-full md:block hidden">
          <div
            class="flex items-center border-2 border-[#ff4646] rounded-md w-full"
          >
            <input
              class="w-full dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-200 text-sm pl-3 dark:bg-zinc-900 focus:outline-none"
              placeholder="Kitchen acessories"
              type="text"
              v-model="searchItem"
            />
            <Icon
              v-if="isSearching"
              name="eos-icons:loading"
              size="25"
              class="mr-2"
            />
            <button class="flex items-center h-[100%] p-1.5 bg-[#ff4646]">
              <Icon
                name="ph:magnifying-glass"
                size="20"
                color="#ffffff"
              />
            </button>
          </div>
          <div
            class="absolute bg-white dark:bg-zinc-900 dark:text-gray-200 max-w-[700px] h-auto w-full shadow-md rounded"
          >
            <div
              v-if="items && items.data"
              v-for="item in items.data"
              :key="item.id"
              class="p-1"
            >
              <NuxtLink
                :to="`/item/${item.id}`"
                class="flex items-center justify-between w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <div class="flex items-center">
                  <img
                    :src="item.url"
                    width="40"
                    alt=""
                    class="rounded-md"
                  />
                  <div class="truncate ml-2">{{ item.title }}</div>
                </div>
                <div class="truncate">
                  {{
                    item.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
        <NuxtLink
          to="/cart"
          class="flex items-center"
        >
          <button
            type="button"
            class="relative md:block hidden"
            @mouseenter="isCartHover = true"
            @mouseleave="isCartHover = false"
          >
            <span
              class="absolute flex items-center justify-center -right-[3px] top-0 bg-[#ff4646] h-[17px] min-w-[17px] text-xs text-white px-0.5 rounded-full"
            >
              {{ userStore.cart.length }}
            </span>
            <div class="min-w-[40px]">
              <Icon
                name="ph:shopping-cart-simple-light"
                size="33"
                :color="isCartHover ? '#ff4646' : ''"
                class="text-black dark:text-white"
              />
            </div>
          </button>
        </NuxtLink>
      </div>

      <button
        @click="userStore.isMenuOverlay = true"
        class="md:hidden block rounded-full p-1.5 -mt-[4px] hover:bg-gray-200"
      >
        <Icon
          name="radix-icons:hamburger-menu"
          size="33"
          class="dark:text-gray-200"
        />
      </button>
    </div>
  </div>

  <div class="lg:pt-[150px] md:pt-[130px] pt-[80px]"></div>
  <slot />

  <Footer />
</template>
