import { BlockiesOptions, BlockiesAPI } from './props';

const seedrand = (seed: string, randseed: number[]): void => {
  for (let i = 0; i < randseed?.length; i++) {
    randseed[i] = 0;
  }
  for (let i = 0; i < seed?.length; i++) {
    randseed[i % 4] =
      (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
  }
};

const rand = (randseed: number[]): number => {
  const t = randseed[0] ^ (randseed[0] << 11);
  randseed[0] = randseed[1];
  randseed[1] = randseed[2];
  randseed[2] = randseed[3];
  randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);
  return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
};

const createColor = (randseed: number[]): string => {
  const h = Math.floor(rand(randseed) * 360);
  const s = `${rand(randseed) * 60 + 40}%`;
  const l = `${(rand(randseed) + rand(randseed) + rand(randseed) + rand(randseed)) * 25}%`;
  return `hsl(${h}, ${s}, ${l})`;
};

const createImageData = (size: number, randseed: number[]): number[] => {
  const width = size;
  const height = size;
  const dataWidth = Math.ceil(width / 2);
  const mirrorWidth = width - dataWidth;
  const data: number[] = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < dataWidth; x++) {
      row[x] = Math.floor(rand(randseed) * 2.3);
    }
    const r = row.slice(0, mirrorWidth);
    r.reverse();
    row.push(...r);
    data.push(...row);
  }

  return data;
};

const buildOpts = (opts: BlockiesOptions): BlockiesOptions => {
  const randseed = new Array(4).fill(0);
  seedrand(opts.seed, randseed);

  return {
    seed: opts.seed,
    size: opts.size || 8,
    scale: opts.scale || 4,
    color: opts.color || createColor(randseed),
    bgcolor: opts.bgcolor || createColor(randseed),
    spotcolor: opts.spotcolor || createColor(randseed),
  };
};

const renderIcon = (
  inopts: BlockiesOptions,
  canvas: HTMLCanvasElement,
): HTMLCanvasElement => {
  if (typeof document === 'undefined') {
    return null as any;
  }

  const opts = buildOpts(inopts);
  const randseed = new Array(4).fill(0);
  seedrand(opts.seed, randseed);

  const imageData = createImageData(opts.size!, randseed);
  const width = Math.sqrt(imageData.length);

  canvas.width = canvas.height = opts.size! * opts.scale!;

  const cc = canvas.getContext('2d')!;
  cc.fillStyle = opts.bgcolor!;
  cc.fillRect(0, 0, canvas.width, canvas.height);
  cc.fillStyle = opts.color!;

  for (let i = 0; i < imageData.length; i++) {
    if (imageData[i]) {
      const row = Math.floor(i / width);
      const col = i % width;
      cc.fillStyle = imageData[i] === 1 ? opts.color! : opts.spotcolor!;
      cc.fillRect(
        col * opts.scale!,
        row * opts.scale!,
        opts.scale!,
        opts.scale!,
      );
    }
  }

  return canvas;
};

const createIcon = (opts: BlockiesOptions): HTMLCanvasElement => {
  if (typeof document === 'undefined') {
    return null as any;
  }

  const canvas = document.createElement('canvas');
  return renderIcon(opts, canvas);
};

export const blockies: BlockiesAPI = {
  create: createIcon,
  render: renderIcon,
};
