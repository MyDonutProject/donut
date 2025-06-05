import { CookiesKey } from "@/enums/cookiesKey"
import { interceptorDataParser } from "@/utils/bigint"
import axios from "axios"
import { getCookie } from "cookies-next"

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
})

baseAPI.interceptors.request.use((request) => {
  const langCookie = getCookie(CookiesKey.Lang) as string

  if (langCookie) {
    request.headers["x-lang"] = langCookie.slice(0, 2)
  }

  if (request.headers["x-challenge-id"]) {
    baseAPI.defaults.headers["x-challenge-id"] =
      request.headers["x-challenge-id"]
  }

  return request
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
