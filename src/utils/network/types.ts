
// Network device type to replace Supabase NetworkDevice
export type NetworkDevice = {
  id: string;
  name: string;
  type: string;
  ip: string;
  mac: string;
  active: boolean;
  status: string;
  firstSeen: string;
  isAuthorized: boolean | null;
};
