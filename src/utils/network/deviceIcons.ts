
export const getDeviceIcon = (type: string) => {
  const typeLower = type.toLowerCase();
  const iconMap = {
    'router': 'Router',
    'computer': 'Monitor',
    'mobile': 'Smartphone',
    'laptop': 'Laptop',
    'server': 'HardDrive',
    'iot': 'Wifi',
    'default': 'Wifi'
  };
  
  // Match type to appropriate icon
  if (typeLower.includes('router')) return iconMap['router'];
  if (typeLower.includes('pc') || typeLower.includes('desktop') || typeLower.includes('computer')) return iconMap['computer'];
  if (typeLower.includes('phone') || typeLower.includes('mobile')) return iconMap['mobile'];
  if (typeLower.includes('laptop')) return iconMap['laptop'];
  if (typeLower.includes('server')) return iconMap['server'];
  
  return iconMap['default'];
};

export const getDeviceType = (deviceName: string): string => {
  const nameLower = deviceName.toLowerCase();
  
  if (nameLower.includes('router')) return 'router';
  if (nameLower.includes('pc') || nameLower.includes('desktop')) return 'computer';
  if (nameLower.includes('laptop')) return 'laptop';
  if (nameLower.includes('phone')) return 'mobile';
  if (nameLower.includes('server')) return 'server';
  if (nameLower.includes('camera') || nameLower.includes('sensor')) return 'iot';
  
  return 'iot';
};
