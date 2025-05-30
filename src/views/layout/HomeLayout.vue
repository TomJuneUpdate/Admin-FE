<template>
  <el-container class="home-layout" style="height: 100vh">
    <!-- Header -->
    <el-header class="header">
      <div class="logo">
        <router-link to="/">TOM MART++</router-link>
      </div>
      <el-menu
        mode="horizontal"
        :default-active="$route.path"
        background-color="transparent"
        text-color="#000"
        active-text-color="#409EFF"
        class="nav-menu"
        router
      >
        <el-menu-item index="/">Trang chủ</el-menu-item>
        <el-menu-item index="/products">Sản phẩm</el-menu-item>
        <el-menu-item index="/about">Giới thiệu</el-menu-item>
        <el-menu-item index="/contact">Liên hệ</el-menu-item>
      </el-menu>

      <div class="auth">
        <el-button
          v-if="!isAuthenticated"
          type="primary"
          size="small"
          @click="goLogin"
        >
          Đăng nhập
        </el-button>
        <el-dropdown v-else @command="handleCommand">
          <span class="user-dropdown">
            <el-avatar icon="el-icon-user-solid" size="small" />
            {{ userName }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">Hồ sơ</el-dropdown-item>
              <el-dropdown-item v-if="isAdmin" command="admin"
                >Quản trị</el-dropdown-item
              >
              <el-dropdown-item command="logout">Đăng xuất</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- Main Content -->
    <el-main class="main-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";

@Component
export default class HomeLayout extends Vue {
  get isAuthenticated(): boolean {
    return store.getters["auth/isAuthenticated"];
  }

  get isAdmin(): boolean {
    return store.getters["auth/isAdmin"];
  }

  get userName(): string {
    return store.getters["auth/userName"] || "Người dùng";
  }

  goLogin() {
    this.$router.push("/login");
  }

  handleCommand(command: string) {
    if (command === "logout") {
      store.dispatch("auth/logout");
      localStorage.removeItem("jwttoken");
      this.$router.push("/login");
    } else if (command === "admin" && this.isAdmin) {
      this.$router.push("/admin");
    } else if (command === "profile") {
      this.$router.push("/profile");
    }
  }
}
</script>

<style scoped>
.home-layout {
  background-color: #f5f5f5;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
  height: 60px;
}
.logo a {
  font-weight: bold;
  font-size: 18px;
  text-decoration: none;
  color: #409eff;
}
.nav-menu {
  flex: 1;
  margin-left: 40px;
}
.auth {
  display: flex;
  align-items: center;
}
.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.main-content {
  padding: 20px;
}
</style>
