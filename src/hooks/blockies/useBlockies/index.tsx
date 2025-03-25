import { useMemo } from 'react';
import { BlockiesOptions } from './props';
import { blockies } from './helpers';

const useBlockies = (
  seed: string,
  options: Partial<BlockiesOptions> = {},
): HTMLCanvasElement => {
  const icon = useMemo(() => {
    const opts: BlockiesOptions = { seed, ...options };
    return blockies.create(opts);
  }, [seed, options]);

  return icon;
};

export default useBlockies;
