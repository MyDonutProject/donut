import { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser';

/**
 * Metadata for face recognition challenges
 * @interface MultiFactorAuthenticationChallengeMetadataFaceRecognition
 * @property {string} url - The URL of the face recognition challenge
 */
export interface MultiFactorAuthenticationChallengeMetadataFaceRecognition {
  url: string;
}

export type MultiFactorAuthenticationChallengeMetadata =
  | MultiFactorAuthenticationChallengeMetadataFaceRecognition
  | PublicKeyCredentialRequestOptionsJSON;
