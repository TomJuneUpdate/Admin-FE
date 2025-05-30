<template>
  <div class="user-manager">
    <h2>Quản lý người dùng</h2>
    <el-table
      v-loading="loading"
      :data="users"
      stripe
      border
      :empty-text="emptyText"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="Username" width="120">
        <template v-slot="scope">
          {{ scope.row.username || "N/A" }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="Email" min-width="180" />
      <el-table-column prop="firstName" label="Họ" width="120">
        <template v-slot="scope">
          {{ scope.row.firstName || "N/A" }}
        </template>
      </el-table-column>
      <el-table-column prop="lastName" label="Tên" width="120">
        <template v-slot="scope">
          {{ scope.row.lastName || "N/A" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="SĐT" width="120">
        <template v-slot="scope">
          {{
            scope.row.phone && scope.row.phone !== "string"
              ? scope.row.phone
              : "N/A"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="dateOfBirth" label="Ngày sinh" width="120">
        <template v-slot="scope">
          {{ formatDate(scope.row.dateOfBirth) }}
        </template>
      </el-table-column>
      <el-table-column label="Kích hoạt" width="100" align="center">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleActive(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="Hành động" width="180" align="center">
        <template v-slot="scope">
          <el-button type="primary" size="mini" @click="editUser(scope.row)">
            Sửa
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="Sửa người dùng"
      :visible.sync="isDialogEditUser"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        label-width="120px"
        :model="editUserData"
        v-loading="isLoadingForm"
      >
        <el-form-item label="Username">
          <el-input v-model="editUserData.username" />
        </el-form-item>

        <el-form-item label="Email">
          <el-input v-model="editUserData.email" disabled />
        </el-form-item>

        <el-form-item label="Họ">
          <el-input v-model="editUserData.firstName" />
        </el-form-item>

        <el-form-item label="Tên">
          <el-input v-model="editUserData.lastName" />
        </el-form-item>

        <el-form-item label="Số điện thoại">
          <el-input v-model="editUserData.phone" />
        </el-form-item>

        <el-form-item label="Ngày sinh">
          <el-date-picker
            v-model="editUserData.dateOfBirth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="Chọn ngày sinh"
            style="width: 100%"
          />
        </el-form-item>

        <div style="text-align: right; margin-top: 20px">
          <el-button @click="isDialogEditUser = false">Hủy</el-button>
          <el-button type="primary" @click="updateUser">Lưu</el-button>
        </div>
      </el-form>
    </el-dialog>
    <div class="pagination" v-if="pagination.totalElements > 0">
      <el-pagination
        layout="prev, pager, next"
        :total="pagination.totalElements"
        :page-size="pagination.size"
        :current-page="pagination.number + 1"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { adminService } from "@/service/AdminService";
import { User } from "@/service/AdminService";

@Component
export default class UserManagerPage extends Vue {
  users: any[] = [];
  loading = false;
  emptyText = "Không có dữ liệu người dùng";

  // Biến để hiển thị dialog sửa người dùng
  isDialogEditUser = false;

  pagination = {
    number: 0,
    size: 10,
    totalElements: 0,
  };

  editUserData: User = {
    id: 0, // ID phải luôn là số
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "", // dùng chuỗi rỗng thay vì null
    isActive: false,
  };

  isLoadingForm = false;

  async mounted() {
    await this.fetchUsers();
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  }

  async fetchUsers(page = 0) {
    this.loading = true;
    try {
      const res = await adminService.getAllUsers(page, this.pagination.size);
      this.users = res.content;
      console.log(res.content);
      this.pagination = {
        number: res.page.number,
        size: res.page.size,
        totalElements: res.page.totalElements,
      };
    } catch (e: any) {
      this.$message.error(
        e.code === "ERR_NETWORK"
          ? "Không thể kết nối tới server. Vui lòng kiểm tra backend."
          : "Không thể tải danh sách người dùng!"
      );
      console.error("Lỗi fetchUsers:", e);
    } finally {
      this.loading = false;
    }
  }

  async toggleActive(user: any) {
    const prevStatus = !user.isActive; // Vì v-model đã đổi rồi
    try {
      await adminService.toggleUserStatus(user.id, user.isActive);
      this.$message.success("Cập nhật trạng thái thành công!");
    } catch (err: any) {
      this.$message.error("Lỗi khi cập nhật trạng thái!");
      user.isActive = prevStatus; // Quay lại trạng thái cũ nếu lỗi
      console.error("Lỗi toggleActive:", err);
    }
  }

  async updateUser() {
    this.isLoadingForm = true;
    try {
      const dataToSend: User = {
        ...this.editUserData,
        dateOfBirth: this.editUserData.dateOfBirth
          ? new Date(this.editUserData.dateOfBirth).toISOString()
          : "", // sửa null → ""
      };

      await adminService.updateUser(this.editUserData.id!, dataToSend);
      this.$message.success("Cập nhật người dùng thành công!");
      this.isDialogEditUser = false;
      await this.fetchUsers();
    } catch (error: any) {
      this.$message.error("Lỗi khi cập nhật người dùng!");
      console.error("updateUser error:", error);
    } finally {
      this.isLoadingForm = false;
    }
  }

  handlePageChange(page: number) {
    this.fetchUsers(page - 1);
  }

  async confirmDelete(user: any) {
    null;
  }
  editUser(user: User) {
    this.editUserData = {
      ...user,
      dateOfBirth: user.dateOfBirth ?? "", // giữ nguyên string
    };
    this.isDialogEditUser = true;
  }
}
</script>

<style scoped>
.user-manager {
  padding: 20px;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
.el-table {
  margin-top: 20px;
}
</style>
