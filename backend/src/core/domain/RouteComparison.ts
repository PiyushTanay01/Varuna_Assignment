import { Route } from './route';

export type RouteComparison = Route & {
  percentDiff: number;
  compliant: boolean;
};