#!/usr/bin/python3

"""Copyright (c) 2019, Douglas Otwell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

import dbus

from advertisement import Advertisement
from service import Application, Service, Characteristic, StaticDescriptor, ServiceReadNotifyOnlyCharacteristic
from gpiozero import CPUTemperature
from bmp3xx import BMP3XX, ULTRA_PRECISION
try:
  from gi.repository import GObject
except ImportError:
    import gobject as GObject

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"
NOTIFY_TIMEOUT = 5000

class PlaneAdvertisement(Advertisement):
    def __init__(self, index, name):
        Advertisement.__init__(self, index, "peripheral")
        self.add_local_name(name)
        self.include_tx_power = True

class CpuTemperatureService(Service):
    data = {'temperature': 0}
    
    def __init__(self, index):
        Service.__init__(self, index, '135fbb98-380f-48c9-843d-e241930fa730', True)
        self.temperatureCharacteristic = ServiceReadNotifyOnlyCharacteristic(self,'180f81a3-aeb7-4cd0-aa3c-76057b121e86','RPi processor temperature in Celsius', 'temperature')
        self.add_characteristic(self.temperatureCharacteristic)
        GObject.timeout_add(1000, self.refreshTemperatureValues)
        
    def refreshTemperatureValues(self):
        cpu = CPUTemperature()
        currentTemperature = cpu.temperature
        
        if self.data['temperature'] != currentTemperature:
            self.temperatureCharacteristic.notify(currentTemperature)

        self.data['temperature'] = currentTemperature

        return True
        

class InstrumentService(Service):
    data = {'temperature':0, 'pressure':0}
    refreshRate = 100 # every 100ms check for refresh
    forceNotifyFrames = 1000 / refreshRate * 5 # every 5 seconds force a notify
    currentFrame = 0
    
    def __init__(self, index):
        self.sensor = BMP3XX(ULTRA_PRECISION, cs=6, bus=0, dev=0, speed=8000000)
        Service.__init__(self, index, 'e0833334-0e1d-4b79-ae7f-a4e5792819e9', True)
        self.pressureCharacteristic = ServiceReadNotifyOnlyCharacteristic(self,'1e49540c-448c-44e7-a518-0a28151b3779','Pressure in Pa', 'pressure')
        self.temperatureCharacteristic = ServiceReadNotifyOnlyCharacteristic(self,'3e5047b4-131a-4b31-8bc3-5e338fed6c08','Temperature in Celsius', 'temperature')
        self.add_characteristic(self.pressureCharacteristic)
        self.add_characteristic(self.temperatureCharacteristic)
        GObject.timeout_add(self.refreshRate, self.refreshPressureValues)
    
    def refreshPressureValues(self):
        currentPressure, currentTemperature = self.sensor.values
        forceNotify = False
        if self.refreshRate == 0:
            forceNotify = True
            self.currentFrame = self.forceNotifyFrames
        else:
            self.currentFrame -= 1
        
        if self.data['pressure'] != currentPressure or forceNotify:
            self.pressureCharacteristic.notify(currentPressure)
            
        if self.data['temperature'] != currentTemperature or forceNotify:
            self.temperatureCharacteristic.notify(currentTemperature)
            
        self.data['pressure'] = currentPressure
        self.data['temperature'] = currentTemperature

        return True
        
app = Application()
app.add_service(CpuTemperatureService(0))
app.add_service(InstrumentService(1))
app.register()

adv = PlaneAdvertisement(0, "OMH-737 instruments")
adv.add_service_uuid('e0833334-0e1d-4b79-ae7f-a4e5792819e9')
adv.register()

try:
    app.run()
except KeyboardInterrupt:
    app.quit()
