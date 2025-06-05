import { BaseEntity } from "@/models/base-entity"
import { LanguageDictionary } from "@/models/language-dictionary"

/**
 * Entity representing the reasons for multi-factor authentication in the system
 * @class MultiFactorAuthenticationReason
 * @extends {BaseEntity<MultiFactorAuthenticationReason>}
 * @description Defines the structure and properties of MFA reasons, including multilingual name and description
 */
export class MultiFactorAuthenticationReason extends BaseEntity {
  /**
   * Multilingual name of the MFA reason
   * @type {LanguageDictionary}
   * @description Name translations for this reason in different languages (e.g. login, withdrawal, settings change)
   * @example
   * {
   *   en: "Login Authentication",
   *   es: "Autenticación de inicio de sesión",
   *   fr: "Authentification de connexion"
   * }
   * @required
   */
  name: LanguageDictionary

  /**
   * Multilingual description of the MFA reason
   * @type {LanguageDictionary}
   * @description Detailed description explaining when and why this authentication reason is triggered
   * @example
   * {
   *   en: "Additional verification required when logging into your account",
   *   es: "Verificación adicional requerida al iniciar sesión en su cuenta",
   *   fr: "Vérification supplémentaire requise lors de la connexion à votre compte"
   * }
   * @required
   */
  description: LanguageDictionary
}
