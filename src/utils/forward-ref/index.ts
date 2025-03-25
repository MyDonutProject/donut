import { forwardRef } from 'react';


export function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  return forwardRef(render as any) as any;
}
