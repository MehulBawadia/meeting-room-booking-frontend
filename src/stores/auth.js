import { computed, ref } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_API_URL;

export const useAuthStore = defineStore(
  'auth',
  () => {
    let user = ref(null);
    let accessToken = ref(null);

    const authUser = computed(() => {
      return user.value;
    });

    const bearerToken = computed(() => {
      return accessToken.value;
    });

    async function registerUser(data) {
      const response = await axios.post(`${baseUrl}/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      if (response.data.status === 'success') {
        user.value = response.data.user;
        accessToken.value = response.data.access_token;
      }
    }

    async function loginUser(data) {
      const response = await axios.post(`${baseUrl}/login`, {
        email: data.email,
        password: data.password,
      });

      if (response.data.status === 'success') {
        user.value = response.data.user;
        accessToken.value = response.data.access_token;
      }
    }

    function updateUserDetails(data) {
      user.value = data;
    }

    async function logoutUser() {
      const response = await axios.post(
        `${baseUrl}/logout`,
        { _method: 'DELETE' },
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );

      if (response.data.status === 'success') {
        user.value = null;
        accessToken.value = null;
      }
    }

    return {
      // state properties
      user,
      accessToken,

      // getters
      authUser,
      bearerToken,

      // actions
      registerUser,
      loginUser,
      updateUserDetails,
      logoutUser,
    };
  },
  {
    persist: true,
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
