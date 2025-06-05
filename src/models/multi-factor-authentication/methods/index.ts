import { BaseEntity } from "@/models/base-entity"
import { LanguageDictionary } from "@/models/language-dictionary"

/**
 * Entity representing multi-factor authentication methods available in the system
 * @class MultiFactorAuthenticationMethod
 * @extends {BaseEntity<MultiFactorAuthenticationMethod>}
 * @description Defines the structure and properties of MFA methods, including multilingual name, description and attempt limits
 */
export class MultiFactorAuthenticationMethod extends BaseEntity {
  /**
   * Multilingual name of the MFA method
   * @type {LanguageDictionary}
   * @description Name translations for this authentication method in different languages (e.g. SMS, Email, Authenticator App)
   * @example
   * {
   *   en: "SMS Authentication",
   *   es: "Autenticación por SMS",
   *   fr: "Authentification par SMS"
   * }
   * @required
   */
  name: LanguageDictionary

  /**
   * Multilingual description of the MFA method
   * @type {LanguageDictionary}
   * @description Detailed description explaining how this authentication method works and how to use it
   * @example
   * {
   *   en: "Verify your identity using a code sent via SMS to your registered phone number",
   *   es: "Verifique su identidad usando un código enviado por SMS a su número de teléfono registrado",
   *   fr: "Vérifiez votre identité à l'aide d'un code envoyé par SMS à votre numéro de téléphone enregistré"
   * }
   * @required
   */
  description: LanguageDictionary

  /**
   * Maximum number of failed verification attempts allowed
   * @type {number}
   * @description Defines how many times a user can attempt to verify using this method before being locked out
   * @default 5
   * @required
   */
  maxAttempts: number
}
