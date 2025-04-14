import { PageProps } from "@/types/navigation";

export default <PageProps[]>[
  {
    label: "dashboard_label",
    path: "/dashboard",
    icon: "fa-duotone fa-home",
  },
  // {
  //   label: 'matrix_label',
  //   path: '/matrix',
  //   icon: 'fa-duotone fa-grid',
  // },
  {
    label: "rewards_label",
    path: "/rewards",
    icon: "fa-duotone fa-star",
  },
  {
    label: "affiliates_label",
    path: "/affiliates",
    icon: "fa-duotone fa-share-nodes",
  },
];
