import { Products } from "@prisma/client";
import { defineStore } from "pinia";

type Product = Omit<Products, "createdAt">;

type UserStore = {
  isMenuOverlay: boolean;
  isLoading: boolean;
  checkout: Product[];
  cart: Product[];
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
