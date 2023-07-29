import { Products } from "@prisma/client";
import { defineStore } from "pinia";

type UserStore = {
  isMenuOverlay: boolean;
  isLoading: boolean;
  checkout: Products[];
  cart: Products[];
};

export const useUserStore = defineStore("user", {
  state: (): UserStore => ({
    isMenuOverlay: false,
    isLoading: false,
    cart: [],
    checkout: [],
  }),
  persist: true,
});
