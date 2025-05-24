import { Language } from "@/enums/languageId"
import { BaseEntity } from "../base-entity"

/**
 * Entity representing user ranks in the system
 * @class Rank
 * @extends {BaseEntity<Rank>}
 * @description Defines the structure and properties of user rank data stored in the database
 */
export class Rank extends BaseEntity {
  /**
   * Multi-language name of the rank
   * @type {LanguageDictionary}
   * @description Stores rank name translations in different languages
   */
  name: Record<Language, string>

  /**
   * Number of matrices required for this rank
   * @type {number}
   * @description Specifies how many matrices a user needs to achieve this rank
   */
  matrixCount: number

  /**
   * URL or path to the rank's image/icon
   * @type {string}
   * @description Visual representation of the rank
   */
  image: string
}
