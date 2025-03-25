import { ModalsKey } from "@/enums/modalsKey";

export interface SectionProps {
  title: string;
  children?: PageProps[];
}

export interface PageProps {
  label: string;
  modal?: ModalsKey;
  icon: string;
  path: string;
}
