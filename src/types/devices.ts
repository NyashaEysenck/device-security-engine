
export interface DeviceType {
  id: string;
  name: string;
  type: string;
  status: string;
  ip: string;
  port: string;
  firmware: string;
  description: string;
  user_id?: string; // Made optional to match with database
  last_active?: string;
  active?: boolean;
  created_at?: string;
  first_seen?: string;
  mac?: string;
}
