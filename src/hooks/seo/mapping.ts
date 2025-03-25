import { Metadata } from 'next';

export const seoMapping: Map<string, Metadata> = new Map([
  [
    '/',
    {
      title: 'title',
      description: 'description',
    },
  ],
  [
    '/dashboard',
    {
      title: 'dashboard_title',
      description: 'description',
    },
  ],
  [
    '/matrix',
    {
      title: 'matrix_title',
      description: 'description',
    },
  ],
  [
    '/rewards',
    {
      title: 'rewards_title',
      description: 'description',
    },
  ],
  [
    '/affiliates',
    {
      title: 'affiliates_title',
      description: 'description',
    },
  ],
]);
