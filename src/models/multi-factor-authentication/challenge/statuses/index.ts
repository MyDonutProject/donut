import { BaseEntity } from "@/models/base-entity"
import { LanguageDictionary } from "@/models/language-dictionary"

/**
 * Entity representing the status of a multi-factor authentication challenge
 * @class MultiFactorAuthenticationChallengeStatus
 * @extends {BaseEntity<MultiFactorAuthenticationChallengeStatus>}
 * @description Defines the structure and properties of MFA challenge statuses, including multilingual name and description
 */
export class MultiFactorAuthenticationChallengeStatus extends BaseEntity {
  /**
   * Multilingual name of the MFA challenge status
   * @type {LanguageDictionary}
   * @description Name translations for this status in different languages (e.g. pending, completed, failed)
   * @example
   * {
   *   en: "Pending",
   *   es: "Pendiente",
   *   fr: "En attente"
   * }
   * @required
   */
  name: LanguageDictionary

  /**
   * Multilingual description of the MFA challenge status
   * @type {LanguageDictionary}
   * @description Detailed description explaining the meaning and implications of this status
   * @example
   * {
   *   en: "Challenge is awaiting user response",
   *   es: "El desafío está esperando la respuesta del usuario",
   *   fr: "Le défi attend la réponse de l'utilisateur"
   * }
   * @required
   */
  description: LanguageDictionary
}
