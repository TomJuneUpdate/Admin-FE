import axios from "@/plugins/axios";

class AuthService {
  async login(email: string, password: string): Promise<string> {
    const res = await axios.post("/api/v1/auth/login", { email, password });
    console.log(res.data.data);
    return res.data.data; // Trả về token từ API
  }
  async register(payload: RegisterPayload): Promise<void> {
    return await axios.post("/api/v1/auth/register", payload);
  }
}

export const authService = new AuthService();
