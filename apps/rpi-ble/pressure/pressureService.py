from time import sleep
from .bmp3xx import BMP3XX, ULTRA_PRECISION
from bluetooth.service import ThreadedService, ServiceReadNotifyOnlyCharacteristic

class PressureService(ThreadedService):
    '''
    Sends pressure and temperature values using Bluetooth when changed, checked every 100ms
    '''
    refreshRate = 100
    
    def __init__(self, index):
        ThreadedService.__init__(self, index, 'e0833334-0e1d-4b79-ae7f-a4e5792819e9', True)
        self.charasteristics = {
            'pressure': ServiceReadNotifyOnlyCharacteristic(self,'1e49540c-448c-44e7-a518-0a28151b3779','Pressure in Pa, uint32 l-endian', 'uint32'),
            'template': ServiceReadNotifyOnlyCharacteristic(self,'3e5047b4-131a-4b31-8bc3-5e338fed6c08','Temperature in Celsius, sint16 l-endian', 'sint16')
        }
        self.start()
    
    def threadWork(self):
        self.sensor = BMP3XX(ULTRA_PRECISION, cs=6, bus=0, dev=0, speed=8000000)
        while self.run:
            self.refreshPressureValues()
            sleep(self.refreshRate / 1000)
    
    
    def refreshPressureValues(self):
        currentPressure, currentTemperature = self.sensor.values
        self.charasteristics['pressure'].setValue(currentPressure)
        self.charasteristics['template'].setValue(currentTemperature)

