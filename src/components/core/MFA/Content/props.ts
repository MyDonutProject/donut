import { MultiFactorAuthenticationChallenge } from "@/models/multi-factor-authentication/challenge"
import { MultiFactorAuthenticationMethod } from "@/models/multi-factor-authentication/methods"

export interface MfaModalProps {
  usePartialForm?: boolean
  isContainerColor?: boolean
  challenge?: MultiFactorAuthenticationChallenge
  onMethodSelected?: (method: MultiFactorAuthenticationMethod) => void
  onCodeChanged?: (code: string) => void
  onCodeResend?: VoidFunction
  callback?: VoidFunction
  isInitialLoading?: boolean
  isPending?: boolean
}
