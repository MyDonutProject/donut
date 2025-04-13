import { ModalsKey } from "@/enums/modalsKey";
import { useModal } from "@/hooks/modal";
import { setCookie } from "cookies-next";
import useTranslation from "next-translate/useTranslation";
import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { FormGroup } from "../FormGroup";
import { Input } from "../Input";
import { ModalLayout } from "../Modal/Layout";
import styles from "./styles.module.scss";

export default function SponsorModal() {
  const { t } = useTranslation("common");
  const { register, handleSubmit } = useForm<{ sponsor: string }>();
  const { onClose } = useModal(ModalsKey.Sponsor);

  function onSubmit(data: { sponsor: string }) {
    setCookie("sponsor", data.sponsor, {
      maxAge: 60 * 60 * 24 * 30,
    });
    onClose();
  }

  return (
    <ModalLayout title="Sponsor" modal={ModalsKey.Sponsor} fitContent>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <FormGroup label={t("sponsor_label")}>
          <Input {...register("sponsor")} />
        </FormGroup>
        <Button type="submit">{t("confirm")}</Button>
      </form>
    </ModalLayout>
  );
}
