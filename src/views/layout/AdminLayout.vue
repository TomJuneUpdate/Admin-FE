<template>
  <el-container class="admin-layout" style="height: 100vh">
    <!-- Sidebar -->
    <el-aside width="200px" class="sidebar">
      <div class="logo" @click="goHome">TOM CMS</div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/admin">
          <i class="el-icon-s-home"></i>
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/admin/user-management">
          <i class="el-icon-user"></i>
          <span slot="title">Người dùng</span>
        </el-menu-item>
        <el-menu-item index="/admin/product-management">
          <i class="el-icon-goods"></i>
          <span slot="title">Sản phẩm</span>
        </el-menu-item>
        <el-menu-item>
          <i class="el-icon-s-order"></i>
          <span slot="title">Đơn hàng</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main Content -->
    <el-container>
      <el-header class="header">
        <div class="header-title">Trang quản trị</div>
        <el-button
          type="text"
          class="logout-button"
          @click="handleLogout"
          icon="el-icon-switch-button"
        >
          Đăng xuất
        </el-button>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";

@Component
export default class AdminLayout extends Vue {
  handleLogout() {
    store.dispatch("auth/logout");
    this.$router.push("/login");
    localStorage.removeItem("jwttoken");
  }
  goHome() {
    this.$router.push("/");
  }
}
</script>

<style scoped>
.admin-layout {
  background-color: #f0f2f5;
}
.sidebar {
  background-color: #001529;
  color: white;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  background: #002140;
  color: #fff;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.header-title {
  font-size: 18px;
  font-weight: bold;
}
.logout-button {
  color: #f56c6c;
}
.main-content {
  padding: 20px;
}
</style>
