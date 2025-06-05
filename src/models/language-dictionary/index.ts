import { Language } from "@/enums/languageId"

export type LanguageDictionary<T extends string = Language> = Record<
  T,
  string
>
