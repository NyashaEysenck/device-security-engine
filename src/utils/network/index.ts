
export type { NetworkDevice } from './types';
export { getDeviceIcon, getDeviceType } from './deviceIcons';
export { 
  fetchNetworkDevices, 
  simulateNetworkScan,
  getNetworkStatus 
} from './networkOperations';
export { 
  authorizeDevice, 
  blockDevice 
} from './deviceManagement';
