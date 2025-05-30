<template>
  <div class="product-manager">
    <!-- Category Management Section -->
    <div class="quanly-wrapper">
      <div class="quanly">
        <h2>Quản lý danh mục</h2>
        <el-button type="primary" @click="openCategoryDialog()"
          >Thêm danh mục</el-button
        >
      </div>
    </div>

    <el-table :data="categories" border stripe style="margin-bottom: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="code" label="Mã danh mục" />
      <el-table-column prop="name" label="Tên danh mục" />
      <el-table-column label="Hành động" width="160" align="center">
        <template #default="{ row }">
          <el-button
            size="mini"
            type="danger"
            @click="confirmDeleteCategory(row)"
            >Xoá</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="categoryDialogVisible" title="Danh mục">
      <el-form :model="categoryForm" label-width="120px">
        <el-form-item label="Tên danh mục" required>
          <el-input
            v-model="categoryForm.name"
            placeholder="Nhập tên danh mục"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="categoryDialogVisible = false">Huỷ</el-button>
        <el-button type="primary" @click="saveCategory">Lưu</el-button>
      </div>
    </el-dialog>

    <!-- Product Management Section -->
    <div class="quanly-wrapper" style="margin-top: 40px">
      <div class="quanly">
        <h2>Quản lý sản phẩm</h2>
        <el-button type="primary" @click="openDialog()"
          >Thêm sản phẩm</el-button
        >
      </div>
    </div>

    <el-table :data="products" border stripe style="margin-bottom: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Tên sản phẩm" />
      <el-table-column prop="code" label="Mac sản phẩm" />
      <el-table-column prop="category.name" label="Danh mục" />
      <el-table-column prop="sellingPrice" label="Giá bán" />
      <el-table-column label="Màu sắc">
        <template #default="{ row }">
          {{ row.color ? row.color.join(", ") : "" }}
        </template>
      </el-table-column>
      <el-table-column label="Kích cỡ">
        <template #default="{ row }">
          {{ row.sizes ? row.sizes.join(", ") : "" }}
        </template>
      </el-table-column>
      <el-table-column label="Hành động" width="160">
        <template #default="{ row }">
          <el-button size="mini" @click="openDialog(row)">Sửa</el-button>
          <el-button size="mini" type="danger" @click="confirmDelete(row)"
            >Xoá
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="pagination.totalElements"
      :page-size="pagination.size"
      :current-page="pagination.number + 1"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />

    <el-dialog :visible.sync="dialogVisible" title="Sản phẩm">
      <el-form :model="form" label-width="240px">
        <el-form-item label="Tên">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Giá gốc">
          <el-input-number v-model="form.mrpPrice" :min="0" />
        </el-form-item>
        <el-form-item label="Giá bán">
          <el-input-number v-model="form.sellingPrice" :min="0" />
        </el-form-item>
        <el-form-item label="Số lượng">
          <el-input-number v-model="form.quantity" :min="0" />
        </el-form-item>
        <el-form-item label="Giảm giá (%)">
          <el-input-number
            v-model="form.discountPercentage"
            :min="0"
            :max="100"
          />
        </el-form-item>
        <el-form-item label="Danh mục">
          <el-select
            v-model="form.category"
            placeholder="Chọn danh mục"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Màu sắc (phân cách dấu phẩy)">
          <el-input v-model="form.colorString" placeholder="vd: đỏ,xanh,đen" />
        </el-form-item>
        <el-form-item label="Kích cỡ (phân cách dấu phẩy)">
          <el-input v-model="form.sizesString" placeholder="vd: M,L,XL" />
        </el-form-item>
        <el-form-item label="Mô tả">
          <el-input type="textarea" v-model="form.description" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <el-button>Thêm ảnh</el-button>
        <div>
          <el-button @click="dialogVisible = false">Huỷ</el-button>
          <el-button type="primary" @click="saveProduct">Lưu</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { adminService, Product, Category } from "@/service/AdminService";

@Component
export default class ProductManagerPage extends Vue {
  // Category management
  categories: Category[] = [];
  categoryDialogVisible = false;
  categoryForm: Partial<Category> = {};

  // Product management
  products: Product[] = [];
  pagination = { number: 0, size: 10, totalElements: 0 };
  dialogVisible = false;
  form: Partial<Product> & {
    colorString?: string;
    sizesString?: string;
    category?: Category | string;
  } = {};

  async mounted() {
    await Promise.all([
      this.fetchCategories(),
      this.fetchProducts(),
      this.fetchCategories(),
    ]);
  }

  async fetchCategories() {
    try {
      this.categories = await adminService.getAllCategories();
    } catch (e) {
      this.$message.error("Lỗi tải danh mục");
    }
  }

  openCategoryDialog(category?: Category) {
    if (category) {
      this.$message.warning("Chức năng cập nhật danh mục đang được phát triển");
      return;
    }

    this.categoryForm = {
      name: "",
    };
    this.categoryDialogVisible = true;
  }

  async saveCategory() {
    try {
      if (!this.categoryForm.name) {
        this.$message.error("Vui lòng nhập tên danh mục");
        return;
      }

      if (!this.categoryForm.id) {
        await adminService.addCategory({
          ...this.categoryForm,
        } as Category);
        this.$message.success("Thêm danh mục thành công");
      } else {
        this.$message.warning(
          "Chức năng cập nhật danh mục đang được phát triển"
        );
        return;
      }

      this.categoryDialogVisible = false;
      await this.fetchCategories();
    } catch (e) {
      this.$message.error("Lỗi khi lưu danh mục");
    }
  }

  async confirmDeleteCategory(category: Category) {
    try {
      await this.$confirm("Bạn có chắc muốn xoá danh mục này?", "Cảnh báo", {
        confirmButtonText: "Xoá",
        cancelButtonText: "Huỷ",
        type: "warning",
      });
      await adminService.deleteCategory(category.id!);
      await this.fetchCategories();
      this.$message.success("Đã xoá danh mục");
    } catch (e) {
      if (e !== "cancel") this.$message.error("Lỗi khi xoá danh mục");
    }
  }

  async fetchProducts(page = 0) {
    const res = await adminService.getAllProducts(page, this.pagination.size);
    this.products = res.content;
    this.pagination = {
      number: res.page.number,
      size: res.page.size,
      totalElements: res.page.totalElements,
    };
  }

  openDialog(product?: Product) {
    if (product) {
      const categoryId = parseInt(product.category as string);
      const categoryObj = this.categories.find((c) => c.id === categoryId);

      const formData = {
        ...product,
        category: categoryObj,
        colorString: product.color ? product.color.join(",") : "",
        sizesString: product.sizes ? product.sizes.join(",") : "",
      };

      this.form = formData as typeof this.form;
    } else {
      this.form = {
        name: "",
        mrpPrice: 0,
        sellingPrice: 0,
        quantity: 1,
        discountPercentage: 0,
        description: "",
        category: undefined,
        colorString: "",
        sizesString: "",
      };
    }
    this.dialogVisible = true;
  }

  async saveProduct() {
    // Validate required fields
    if (!this.form.name?.trim()) {
      this.$message.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!this.form.mrpPrice || this.form.mrpPrice <= 0) {
      this.$message.error("Vui lòng nhập giá gốc hợp lệ");
      return;
    }
    if (!this.form.sellingPrice || this.form.sellingPrice <= 0) {
      this.$message.error("Vui lòng nhập giá bán hợp lệ");
      return;
    }
    if (!this.form.quantity || this.form.quantity < 0) {
      this.$message.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }

    // Process color and sizes
    if (this.form.colorString) {
      this.form.color = this.form.colorString.split(",").map((c) => c.trim());
    } else {
      this.form.color = [];
    }

    if (this.form.sizesString) {
      this.form.sizes = this.form.sizesString.split(",").map((s) => s.trim());
    } else {
      this.form.sizes = [];
    }

    try {
      let category: Category | undefined;
      if (typeof this.form.category === "string") {
        const categoryId = parseInt(this.form.category);
        category = this.categories.find((c) => c.id === categoryId);
        if (!category) {
          this.$message.error("Danh mục không hợp lệ");
          return;
        }
      } else if (this.form.category) {
        category = this.form.category;
      }

      if (!category) {
        this.$message.error("Vui lòng chọn danh mục");
        return;
      }

      const productData = {
        ...this.form,
        category: category.name,
      };

      console.log("Saving product data:", productData);

      const productToSave = productData as unknown as Product;

      try {
        if (this.form.id) {
          await adminService.updateProduct(productToSave);
          this.$message.success("Cập nhật sản phẩm thành công");
        } else {
          await adminService.addProduct(productToSave);
          // Nếu không có lỗi throw ra, coi như thêm thành công
          this.$message.success("Thêm sản phẩm thành công");
        }
        this.dialogVisible = false;
        await this.fetchProducts(this.pagination.number);
      } catch (e) {
        // Kiểm tra nếu sản phẩm đã được thêm thành công
        if (e && typeof e === "object" && "response" in e) {
          const error = e as any;
          // Nếu status là 200/201, coi như thành công
          if (
            error.response?.status === 200 ||
            error.response?.status === 201
          ) {
            this.$message.success("Thêm sản phẩm thành công");
            this.dialogVisible = false;
            await this.fetchProducts(this.pagination.number);
            return;
          }
          console.error("Error response:", error.response?.data);
          this.$message.error(
            `Lỗi khi lưu sản phẩm: ${
              error.response?.data?.msg || "Không xác định"
            }`
          );
        } else {
          this.$message.error("Lỗi khi lưu sản phẩm");
        }
      }
    } catch (e) {
      console.error("Lỗi khi lưu sản phẩm:", e);
      this.$message.error("Lỗi khi lưu sản phẩm");
    }
  }

  async confirmDelete(product: Product) {
    try {
      await this.$confirm("Bạn có chắc muốn xoá sản phẩm này?", "Cảnh báo", {
        confirmButtonText: "Xoá",
        cancelButtonText: "Huỷ",
        type: "warning",
      });
      await adminService.deleteProduct(product.id!);
      this.$message.success("Đã xoá sản phẩm");
      this.fetchProducts(this.pagination.number);
    } catch (e) {
      if (e !== "cancel") this.$message.error("Lỗi khi xoá sản phẩm");
    }
  }

  handlePageChange(page: number) {
    this.fetchProducts(page - 1);
  }
}
</script>

<style scoped lang="scss">
.product-manager {
  padding: 20px;
}
.quanly-wrapper {
  width: 100%;
  padding: 0 20px;

  .quanly {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
