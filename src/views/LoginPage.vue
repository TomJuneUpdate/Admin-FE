<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <input
        type="text"
        v-model="username"
        placeholder="Tên đăng nhập"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Mật khẩu"
        required
      />
      <button type="submit">Đăng nhập</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const error = ref("");
const store = useStore();
const router = useRouter();

const handleLogin = async () => {
  const success = await store.dispatch("login", {
    username: username.value,
    password: password.value,
  });
  if (success) {
    router.push("/dashboard");
  } else {
    error.value = "Đăng nhập thất bại!";
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
button {
  width: 100%;
  padding: 0.75rem;
}
.error {
  color: red;
}
</style>
