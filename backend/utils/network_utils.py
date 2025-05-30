from scapy.all import ARP, Ether, srp
from fastapi import HTTPException

def perform_arp_scan(ip_range: str) -> list[dict]:
    """Perform an ARP scan and return list of devices"""
    try:
        arp = ARP(pdst=ip_range)
        ether = Ether(dst="ff:ff:ff:ff:ff:ff")
        packet = ether/arp
        result = srp(packet, timeout=3, verbose=0)[0]
        
        return [{
            'ip': received.psrc,
            'mac': received.hwsrc.lower()
        } for sent, received in result]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")