export interface PoolMember {
  id: string;
  pool_id: string;
  ship_id: string;
  cb_before: number;
  cb_after: number;
}

export interface Pool {
  id: string;
  year: number;
  createdAt: string;
  members: PoolMember[];
}