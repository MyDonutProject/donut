import { interceptorDataParser } from "@/utils/bigint"
import axios from "axios"

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
})

baseAPI.interceptors.response.use(
  (response) => {
    return {
      ...response,
      data: interceptorDataParser(response.data),
    }
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default baseAPI
