import { MultiFactorAuthenticationMethodId } from "@/models/multi-factor-authentication/methods/id"
import { MfaModalProps } from "./props"
import CodeMfaModalContentCode from "./Code"

export default function MfaModalContent(props: MfaModalProps) {
  switch (props?.challenge?.methodId?.toString()) {
    case MultiFactorAuthenticationMethodId.Email.toString():
    default:
      return <CodeMfaModalContentCode {...props} />
  }
}
