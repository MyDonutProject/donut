import { Language } from "@/enums/languageId"
import { BaseEntity } from "../../base-entity"

/**
 * Entity representing a matrix status in the system
 * @class MatrixStatus
 * @extends {BaseEntity<MatrixStatus>}
 * @description Defines the structure and properties of a matrix status entity in the database
 */
export class MatrixStatus extends BaseEntity {
  /**
   * The name of the matrix status in multiple languages
   * @type {Record<Language, string>}
   * @description A dictionary containing translations of the status name in different languages
   */
  name: Record<Language, string>
}
