import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/models/JwtPayload";

interface AuthState {
  token: string | null;
  roles: string[];
  userEmail: string;
}

const state: AuthState = {
  token: localStorage.getItem("jwttoken"),
  roles: [],
  userEmail: "",
};

const mutations = {
  setToken(state: AuthState, token: string) {
    state.token = token;
    localStorage.setItem("jwttoken", token);
    const decoded: JwtPayload = jwtDecode(token);
    state.roles = decoded.roles || [];
  },
  logout(state: AuthState) {
    state.token = null;
    state.roles = [];
    localStorage.removeItem("jwttoken");
  },
  setUserName(state: AuthState, userEmail: string) {
    state.userEmail = userEmail;
  },
};

const actions = {
  logout({ commit }: any) {
    commit("logout");
  },
};

const getters = {
  isAuthenticated: (state: AuthState) => !!state.token,
  isAdmin: (state: AuthState) => state.roles.includes("ROLE_ADMIN"),
  isUser: (state: AuthState) => state.roles.includes("ROLE_USER"),
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
