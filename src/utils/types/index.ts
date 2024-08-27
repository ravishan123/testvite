import { QueryObserver } from '@tanstack/query-core';

export type GenderType = 'FEMALE' | 'MALE' | string;

export type JSONBody = Record<string, unknown>;

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export interface Availability {
  day: string;
  times: string[];
}

export type Action = {
  type: 'refetch';
  force?: boolean;
  options?: Parameters<QueryObserver['refetch']>[0];
};
