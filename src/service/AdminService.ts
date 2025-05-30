// src/service/AdminService.ts
import axios from "@/plugins/axios";
import type { AxiosError } from "axios";

export interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  // Thêm các field khác nếu cần
}

export interface Product {
  id?: number;
  name: string;
  mrpPrice: number;
  sellingPrice: number;
  quantity: number;
  discountPercentage: number;
  description: string;
  category: string;
  color: string[];
  sizes: string[];
}

export interface PageMeta {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Category {
  id: number;
  code: string;
  name: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: PageMeta;
}
//USERS
const URI_GET_ALL_USER = "/api/v1/admin/user/all";
const URI_GET_USER_BY_ID = "/api/v1/admin/user/";
const URI_TOGGLE_USER_STATUS = "/api/v1/admin/user/";
const URI_UPDATE_USER = "/api/v1/user/";
//PRODUCTS
const URI_GET_ALL_PRODUCT = "/api/v1/getAllProducts";
const URI_ADD_PRODUCT = "/api/v1/admin/product";
const URI_UPDATE_PRODUCT = "/api/v1/admin/product/";
const URI_DELETE_PRODUCT = "/api/v1/admin/product/";
const URI_UPLOAD_IMAGE = "/api/v1/admin/image/upload/";

//CATEGORY
const URI_GET_ALL_CATEGORY = "/api/v1/getAllCategories";
const URI_ADD_CATEGORY = "/api/v1/admin/category";
const URI_DELETE_CATEGORY = "/api/v1/admin/category/";

class AdminService {
  // User
  async getAllUsers(
    page = 0,
    size = 10,
    sortBy = "id",
    sortDir = "asc"
  ): Promise<PaginatedResponse<User>> {
    try {
      const res = await axios.get(URI_GET_ALL_USER, {
        params: { page, size, sortBy, sortDir },
      });
      console.log("API response:", res.data); // Debug
      if (res.data.code === "000000" && res.data.msg === "SUCCESS") {
        return res.data.data; // Trả về { content, page }
      }
      throw new Error(`API thất bại: ${res.data.msg}`);
    } catch (error) {
      console.error("Lỗi getAllUsers:", error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const res = await axios.get(`${URI_GET_USER_BY_ID}${id}`);
      if (res.data.code === "000000" && res.data.msg === "SUCCESS") {
        return res.data.data;
      }
      throw new Error(`API thất bại: ${res.data.msg}`);
    } catch (error) {
      console.error("Lỗi getUserById:", error);
      throw error;
    }
  }

  async toggleUserStatus(id: number, isActive: boolean): Promise<void> {
    try {
      const res = await axios.put(`${URI_TOGGLE_USER_STATUS}${id}`, null, {
        params: { isActive },
      });
      if (res.data.code !== "000000" || res.data.msg !== "SUCCESS") {
        throw new Error(`API thất bại: ${res.data.msg}`);
      }
    } catch (error) {
      console.error("Lỗi toggleUserStatus:", error);
      throw error;
    }
  }

  async updateUser(id: number, updateUser: User) {
    try {
      const res = await axios.put(`${URI_UPDATE_USER}${id}`, updateUser);

      if (res.data.code !== "000000" || res.data.msg !== "SUCCESS") {
        throw new Error(`API thất bại: ${res.data.msg}`);
      }
    } catch (error) {
      console.error("Lỗi updateUser:", error);
      throw error;
    }
  }
  //Category

  //Products

  async getAllProducts(
    page = 0,
    size = 10,
    sortBy = "id",
    sortDir = "asc"
  ): Promise<PaginatedResponse<Product>> {
    try {
      const res = await axios.get(URI_GET_ALL_PRODUCT, {
        params: { page, size, sortBy, sortDir },
      });
      console.log("API response:", res.data); // Debug
      if (res.data.code === "000000" && res.data.msg === "SUCCESS") {
        return res.data.data; // Trả về { content, page }
      }
      throw new Error(`API thất bại: ${res.data.msg}`);
    } catch (error) {
      console.error("Lỗi get all product:", error);
      throw error;
    }
  }
  async addProduct(product: Product): Promise<void> {
    try {
      console.log(
        "Adding product with data:",
        JSON.stringify(product, null, 2)
      );
      console.log("Request URL:", URI_ADD_PRODUCT);
      console.log("Request headers:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
      });
      const res = await axios.post(URI_ADD_PRODUCT, product);
      console.log("Add product response:", res.data);
      // Kiểm tra nhiều format response khác nhau
      if (res.data.code === "000000" && res.data.msg === "SUCCESS") {
        return; // Format chuẩn
      } else if (res.status === 200 || res.status === 201) {
        return; // Chấp nhận response thành công với status 200/201
      } else if (res.data && typeof res.data === "object") {
        // Nếu có data trả về nhưng không đúng format chuẩn
        console.log("Product added successfully with custom response format");
        return;
      }
      // Nếu không match với format nào, throw error
      throw new Error(`API thất bại: ${res.data?.msg || "Không xác định"}`);
    } catch (error) {
      console.error("Lỗi addProduct:");
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        console.error("Error details:");
        console.error("- Status:", axiosError.response?.status);
        console.error("- Status text:", axiosError.response?.statusText);
        console.error("- Response data:", axiosError.response?.data);
        console.error("- Request URL:", axiosError.config?.url);
        console.error("- Request method:", axiosError.config?.method);
        console.error("- Request data:", axiosError.config?.data);
      }
      throw error;
    }
  }

  async updateProduct(product: Product): Promise<void> {
    try {
      const res = await axios.put(
        `${URI_UPDATE_PRODUCT}/${product.id}`,
        product
      );
      if (res.data.code !== "000000" || res.data.msg !== "SUCCESS") {
        throw new Error(`API thất bại: ${res.data.msg}`);
      }
    } catch (error) {
      console.error("Lỗi updateProduct:", error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      console.log("Attempting to delete product with ID:", id);
      const url = `${URI_DELETE_PRODUCT}${id}`;
      console.log("Delete URL:", url);
      const res = await axios.delete(url);
      console.log("Delete response:", res.data);
      if (res.data.code !== "000000" || res.data.msg !== "SUCCESS") {
        throw new Error(`API thất bại: ${res.data.msg}`);
      }
    } catch (error: unknown) {
      console.error("Error in deleteProduct:");
      if (error && typeof error === "object" && "isAxiosError" in error) {
        const axiosError = error as AxiosError;
        // Log chi tiết lỗi từ Axios
        console.error("Axios error details:");
        console.error("- Status:", axiosError.response?.status);
        console.error("- Status text:", axiosError.response?.statusText);
        console.error("- Response data:", axiosError.response?.data);
        console.error("- Request URL:", axiosError.config?.url);
        console.error("- Request method:", axiosError.config?.method);
      } else {
        console.error("Non-Axios error:", error);
      }
      throw error;
    }
  }
  // Category

  async getAllCategories(): Promise<Category[]> {
    try {
      const res = await axios.get(URI_GET_ALL_CATEGORY);
      if (res.data.code === "000000" && res.data.msg === "SUCCESS") {
        return res.data.data;
      }
      throw new Error(`API thất bại: ${res.data.msg}`);
    } catch (error) {
      console.error("Lỗi getAllCategories:", error);
      throw error;
    }
  }

  async addCategory(category: Category): Promise<void> {
    try {
      const res = await axios.post(URI_ADD_CATEGORY, category);
      if (res.data.code !== "000000" || res.data.msg !== "SUCCESS") {
        throw new Error(`API thất bại: ${res.data.msg}`);
      }
    } catch (error) {
      console.error("Lỗi addCategory:", error);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      const res = await axios.delete(`${URI_DELETE_CATEGORY}${id}`);
      if (res.data.code !== "000000" || res.data.msg !== "SUCCESS") {
        throw new Error(`API thất bại: ${res.data.msg}`);
      }
    } catch (error) {
      console.error("Lỗi deleteCategory:", error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
