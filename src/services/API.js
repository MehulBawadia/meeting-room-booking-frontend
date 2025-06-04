import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    Authorization: auth?.authUser ? `Bearer ${auth.bearerToken}` : null,
  },
});

export default API;
