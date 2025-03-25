import axios from 'axios';

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
});

export default baseAPI;
