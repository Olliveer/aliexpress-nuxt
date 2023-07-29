<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

async function handleSignIn(provider: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });
}

watchEffect(() => {
  if (user.value) {
    return navigateTo("/");
  }
});
</script>

<template>
  <div
    id="AuthPage"
    class="w-full h-[100vh] bg-white"
  >
    <div
      class="w-full flex items-center justify-center p-5 border-b border-b-gray-300"
    >
      <NuxtLink to="/">
        <img
          src="/aliExpress-logo.png"
          alt="logo"
          width="170"
        />
      </NuxtLink>
    </div>

    <div class="max-w-[400px] mx-auto px-2">
      <div class="text-center my-6">Login / Register</div>

      <button
        @click="handleSignIn('google')"
        class="flex items-center justify-center gap-3 p-1.5 w-full border hover:bg-gray-100 rounded-full text-lg font-semibold"
      >
        <img
          src="/google-logo.png"
          alt="google"
          class="w-full max-w-[30px]"
        />
        <span>Google</span>
      </button>

      <button
        @click="handleSignIn('github')"
        class="mt-4 flex items-center justify-center gap-3 p-1.5 w-full border hover:bg-gray-100 rounded-full text-lg font-semibold"
      >
        <img
          src="/github-logo.png"
          alt="google"
          class="w-full max-w-[30px]"
        />
        <span> Github </span>
      </button>
    </div>
  </div>
</template>
