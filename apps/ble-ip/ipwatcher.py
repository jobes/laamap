import socket
from time import sleep, time
from bluetooth.service import ThreadedService, ServiceReadNotifyOnlyCharacteristic

class IpWatcherService(ThreadedService):
    def __init__(self, index):
        ThreadedService.__init__(self, index, '11fafbd4-f9c7-4098-880d-6ce9c9138872', True)
        self.charasteristics = {
            'ip': ServiceReadNotifyOnlyCharacteristic(self,'1c17dcf4-3689-49cd-b462-ec5ccddf0c7a','Ip address', 'string'),
        }
        self.start()
    
    def threadWork(self):
        while self.run:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.connect(('10.0.0.0', 0))  
                myIp = s.getsockname()[0]
                self.charasteristics['ip'].setValue(myIp)
                s.close()
            except:
                pass
            sleep(30)
