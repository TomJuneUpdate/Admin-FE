<template>
  <div class="register-container">
    <el-form :model="form" ref="registerForm" label-width="120px">
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>

      <el-form-item label="Username">
        <el-input v-model="form.username" />
      </el-form-item>

      <el-form-item label="Password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>

      <el-form-item label="Họ">
        <el-input v-model="form.firstName" />
      </el-form-item>

      <el-form-item label="Tên">
        <el-input v-model="form.lastName" />
      </el-form-item>

      <el-form-item label="SĐT">
        <el-input v-model="form.phone" />
      </el-form-item>

      <el-form-item label="Ngày sinh">
        <el-date-picker
          v-model="form.dateOfBirth"
          type="date"
          placeholder="Chọn ngày"
          format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleRegister">Đăng ký</el-button>
        <el-button type="primary" @click="handleLogin">Đăng Nhập</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { authService } from "@/service/AuthService";
// Define RegisterPayload type locally
interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
}
@Component
export default class RegisterPage extends Vue {
  form: RegisterPayload = {
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
  };
  handleLogin() {
    this.$router.push("/login");
  }
  async handleRegister() {
    if (!this.form.username || this.form.username.trim() === "") {
      this.$message.warning("Vui lòng nhập Username!");
      return;
    }

    if (!this.form.email || !this.form.password) {
      this.$message.warning("Email và mật khẩu là bắt buộc!");
      return;
    }
    try {
      const payload = {
        ...this.form,
        username: this.form.username.trim(),
        dateOfBirth: new Date(this.form.dateOfBirth).toISOString(),
      };

      console.log(payload);
      await authService.register(payload);
      this.$message.success("Đăng ký thành công!");
      this.$router.push("/login");
    } catch (err) {
      this.$message.error("Đăng ký thất bại!");
    }
  }
}
</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: auto;
  padding-top: 100px;
}
</style>
