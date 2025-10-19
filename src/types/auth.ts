import { EventContext, UserRole, __Timestamp } from './common';

export interface User {
  id: bigint;
  username: string;
  role: UserRole;
  outlet_id?: bigint;
  created_at: Date;
  last_login?: Date;
}