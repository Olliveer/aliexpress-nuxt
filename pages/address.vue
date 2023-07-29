<script setup lang="ts">
import { useUserStore } from "../stores/User";
import Input from "../components/Input.vue";
import MainLayout from "../layouts/MainLayout.vue";
import { FILE } from "dns";

type Error = {
  type: string;
  message: string;
};

const userStore = useUserStore();
const user = useSupabaseUser();

const addressEdit = ref({
  contactName: "",
  address: "",
  zipCode: "",
  city: "",
  country: "",
});

const currentAddress = ref<any | null>();
const isWorking = ref(false);
const isUpdate = ref(false);
const error = ref<Error | null>(null);

async function handleSaveAddress() {
  isWorking.value = true;
  error.value = null;

  const { contactName, address, zipCode, city, country } = addressEdit.value;

  if (!contactName) {
    error.value = {
      type: "contactName",
      message: "Contact name is required.",
    };
  } else if (!address) {
    error.value = {
      type: "address",
      message: "Address is required.",
    };
  } else if (!zipCode) {
    error.value = {
      type: "zipCode",
      message: "Zip code is required.",
    };
  } else if (!city) {
    error.value = {
      type: "city",
      message: "City is required.",
    };
  } else if (!country) {
    error.value = {
      type: "country",
      message: "Country is required.",
    };
  }

  if (error.value) {
    isWorking.value = false;
    return;
  }

  if (isUpdate.value) {
    await useFetch(`/api/prisma/update-address/${currentAddress.value.id}`, {
      method: "PATCH",
      body: {
        userId: user.value?.id,
        name: contactName,
        address,
        zipCode,
        city,
        country,
      },
    });

    isWorking.value = false;

    return navigateTo("/checkout");
  }

  await useFetch(`/api/prisma/add-address`, {
    method: "POST",
    body: {
      userId: user.value?.id,
      name: contactName,
      address,
      zipCode,
      city,
      country,
    },
  });

  isWorking.value = false;

  return navigateTo("/checkout");
}

watchEffect(async () => {
  currentAddress.value = (await useFetch(
    `/api/prisma/get-address-by-user/${user.value?.id}`
  )) as any;

  if (currentAddress.value.data) {
    addressEdit.value = currentAddress.value;
    isUpdate.value = true;
  }

  userStore.isLoading = false;
});
</script>

<template>
  <MainLayout>
    <div
      id="AddressPage"
      class="mt-4 max-w-[500px] mx-auto px-2"
    >
      <div class="mx-auto bg-white rounded-lg p-3">
        <div class="text-xl text-bold mb-2">Address Details</div>

        <form @submit.prevent="handleSaveAddress">
          <Input
            class="w-full"
            placeholder="Contact Name"
            v-model:input="addressEdit.contactName"
            type="text"
            :error="error && error.type === 'contactName' ? error.message : ''"
            :max="50"
          />
          <Input
            class="w-full mt-2"
            placeholder="Address"
            v-model:input="addressEdit.address"
            type="text"
            :error="error && error.type === 'address' ? error.message : ''"
          />
          <Input
            class="w-full mt-2"
            placeholder="Zip Code"
            v-model:input="addressEdit.zipCode"
            type="text"
            :error="error && error.type === 'zipCode' ? error.message : ''"
          />
          <Input
            class="w-full mt-2"
            placeholder="City"
            v-model:input="addressEdit.city"
            type="text"
            :error="error && error.type === 'city' ? error.message : ''"
          />
          <Input
            class="w-full mt-2"
            placeholder="Country"
            v-model:input="addressEdit.country"
            type="text"
            :error="error && error.type === 'country' ? error.message : ''"
          />

          <button
            :disabled="isWorking"
            type="submit"
            class="mt-6 bg-gradient-to-r from-[#fe630c] to-[#ff3200] w-full text-white text-[21px] font-semibold p-1.5 rounded-full"
          >
            <span v-if="!isWorking">Update Address</span>
            <Icon
              v-else
              name="eos-icons:loading"
              size="25"
              class="mr-2"
            />
          </button>
        </form>
      </div>
    </div>
  </MainLayout>
</template>
