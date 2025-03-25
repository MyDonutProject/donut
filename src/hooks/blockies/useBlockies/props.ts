export type BlockiesOptions = {
  seed: string;
  size?: number;
  scale?: number;
  color?: string;
  bgcolor?: string;
  spotcolor?: string;
};

export type BlockiesAPI = {
  create: (opts: BlockiesOptions) => HTMLCanvasElement;
  render: (
    opts: BlockiesOptions,
    canvas: HTMLCanvasElement,
  ) => HTMLCanvasElement;
};
