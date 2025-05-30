<template>
  <div class="s-login-page">
    <el-form ref="loginForm" autocomplete="on">
      <h1>Đăng Nhập</h1>
      <el-form-item label="Email">
        <el-input v-model="email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="password" type="password" />
      </el-form-item>
      <el-button type="primary" @click="handleLogin">Đăng Nhập</el-button>
      <el-button @click="goToRegister">Đăng Ký</el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { authService } from "@/service/AuthService";

@Component
export default class Login extends Vue {
  email = "";
  password = "";

  async handleLogin() {
    try {
      const token = await authService.login(this.email, this.password);
      this.$store.commit("auth/setToken", token);
      this.$store.commit("auth/setEmail", this.email);

      const isAdmin = this.$store.getters["auth/isAdmin"];
      const isUser = this.$store.getters["auth/isUser"];

      if (isAdmin) this.$router.push("/admin");
      else if (isUser) this.$router.push("/");
      else this.$router.push("/unauthorized");
    } catch (e) {
      this.$message.error("Đăng nhập thất bại!");
    }
  }
  goToRegister() {
    this.$router.push("/register");
  }
}
</script>
<style>
.s-login-page {
  max-width: 400px;
  margin: auto;
  margin-top: 25vh;
}
.s-group {
  display: grid;
  grid-template-columns: 1.5fr 4fr;
}
.s-group label {
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
