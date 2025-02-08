import serial
from time import sleep, time
from bluetooth.service import ThreadedService, ServiceConfigCharacteristic, ServiceReadNotifyOnlyCharacteristic
from settings import config

class MglRdacVdService(ThreadedService):
    serialPort = '/dev/ttyS0'
    lastValidReading = int(time())
    
    def __init__(self, index):
        ThreadedService.__init__(self, index, '11fafbd4-f9c7-4098-880d-6ce9c9138872', True)
        self.charasteristics = {
            'rpm': ServiceReadNotifyOnlyCharacteristic(self,'4a47079f-4cab-4e10-82fe-60b70e2299b6','Engine RPM, uint32 l-endian', 'uint32'),
            'TC1': ServiceReadNotifyOnlyCharacteristic(self,'930b1f39-7fee-4b43-9a76-4bee84bc0029','Thermocouple 1, uint16 l-endian', 'uint16'),
            'TC2': ServiceReadNotifyOnlyCharacteristic(self,'2254e0a2-a8c7-4ac1-a434-24c75c61d8cf','Thermocouple 2, uint16 l-endian', 'uint16'),
            'TC3': ServiceReadNotifyOnlyCharacteristic(self,'57d1f2df-0d65-4e0f-aa17-31243efad10f','Thermocouple 3, uint16 l-endian', 'uint16'),
            'TC4': ServiceReadNotifyOnlyCharacteristic(self,'6fed1034-d8e6-4dfd-ae17-da17a2fe93a2','Thermocouple 4, uint16 l-endian', 'uint16'),
            'UM1': ServiceReadNotifyOnlyCharacteristic(self,'8d8e14e1-a32a-4ec8-9d13-e2ce32c699f1','Unknown msg 1, uint16 l-endian', 'uint16'),
            'UM2': ServiceReadNotifyOnlyCharacteristic(self,'4f631fb4-ce86-4a24-aed3-fa471cefd7a4','Unknown msg 2, uint16 l-endian', 'uint16'),
            'UM3': ServiceReadNotifyOnlyCharacteristic(self,'2680ca6b-c1eb-4671-a640-a1cb297fba48','Unknown msg 3, uint16 l-endian', 'uint16'),
            'UM4': ServiceReadNotifyOnlyCharacteristic(self,'1769b0d0-5ff4-40eb-9b60-f52cedde5ebd','Unknown msg 4, uint16 l-endian', 'uint16'),
            'UM5': ServiceReadNotifyOnlyCharacteristic(self,'518c9e47-d302-4a1a-bf26-39932dbb01ff','Unknown msg 5, uint16 l-endian', 'uint16'),
            'UM6': ServiceReadNotifyOnlyCharacteristic(self,'366a877b-63e6-4971-a576-bcb7787dbb99','Unknown msg 6, uint16 l-endian', 'uint16'),
            'AT1': ServiceReadNotifyOnlyCharacteristic(self,'3d3e3011-5f16-4489-85e4-12feeed25a89','Analog temperature 1, uint16 l-endian', 'uint16'),
            'AT2': ServiceReadNotifyOnlyCharacteristic(self,'cfe35d01-aab3-4a1d-ba8c-e9fb97fcdda2','Analog temperature 2, uint16 l-endian', 'uint16'),
            'AT3': ServiceReadNotifyOnlyCharacteristic(self,'fffe3aad-176b-4cab-b6d7-66ed6b9ab3d1','Analog temperature 3, uint16 l-endian', 'uint16'),
            'AT4': ServiceReadNotifyOnlyCharacteristic(self,'fe23c8c7-024b-472a-b276-5ee3f8a975ae','Analog temperature 4, uint16 l-endian', 'uint16'),
            'AU1': ServiceReadNotifyOnlyCharacteristic(self,'c0a58ca2-0904-40bf-a80c-6d6d4428a973','Analog unknown 1, uint16 l-endian', 'uint16'),
            'AU2': ServiceReadNotifyOnlyCharacteristic(self,'e4bf5982-010d-4599-8b89-5cc11ef35be5','Analog unknown 2, uint16 l-endian', 'uint16'),
            'AU3': ServiceReadNotifyOnlyCharacteristic(self,'fb05d2b3-6605-4b51-9878-f40d963a5c51','Analog unknown 3, uint16 l-endian', 'uint16'),
            'AET': ServiceReadNotifyOnlyCharacteristic(self,'8a833489-7dab-4251-a2ec-2e7b39c3578b','Analog outside temperature, sint16 l-endian', 'sint16'),
            'AOP': ServiceReadNotifyOnlyCharacteristic(self,'efcf9430-9a85-4d81-91b0-4750e58c393e','Analog oil pressure, uint16 l-endian', 'uint16'),
            'AFL1': ServiceReadNotifyOnlyCharacteristic(self,'9c05bed7-af71-4070-b560-e36b374316a5','Analog fuel level 1, uint16 l-endian', 'uint16'),
            #'AFL2': ServiceReadNotifyOnlyCharacteristic(self,'3473113f-3622-4d60-92f0-1e235bc8f78e','Analog fuel level 2, uint16 l-endian', 'uint16'),
        }

        self.add_characteristic(ServiceConfigCharacteristic(self,'a48bc93d-65e5-428b-a857-7afb11de3184','Number of pulses per revolutions', 'rdac.rev_factor', 'sint16'))
        self.start()
    
    def threadWork(self):
        ser = serial.Serial(self.serialPort, 1250, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE, timeout=5)
        while self.run:
            try:
                dle = ser.read()
                if dle == b'\xd5':
                    start = ser.read()
                    if start != b'\x02':
                        raise Exception('message mismatch')
                    else:
                        msg_type = ser.read()
                        if msg_type == b'\x01':
                            self.fuel(read_data(msg_type, 6, ser))
                        elif msg_type == b'\x02':
                            self.analogMeasures(read_data(msg_type, 24, ser))
                        elif msg_type == b'\x03':
                            self.rpm(self.read_data(msg_type, 4, ser))
                        elif msg_type == b'\x04':
                            self.thermocouple(read_data(msg_type, 10, ser))
                        elif msg_type == b'\x05':
                            self.unknownMsg(read_data(msg_type, 14, ser))
                        else:
                            raise Exception('unknown msg type')
        
                else:
                    raise Exception('not a message start')
            except:
                if self.lastValidReading + 5 < int(time()): # no correct reading last 5 seconds
                    for ch in self.charasteristics:
                        self.charasteristics[ch].setValue(None)
                    
                ser.close()
                ser = serial.Serial(self.serialPort, 1250, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE, timeout=5)
                sleep(0.02)
        
    def read_data(self, msg_type, bytesLength, ser):
        data = ser.read(bytesLength)
        if self.checksum(msg_type+data):
            return data
        else:
            raise Exception('checksum failed')
        
    def checksum(self, data):
        try:
            sumValue = data[-2]
            xorVal = data[-1]
            checkData = data[0:-2]
            sum = 170
            xor = 85
            for b in checkData:
                sum +=b
            for b in checkData:
                xor ^=b
            result = sum % 256 == sumValue and xor == xorVal
            if result:
                self.lastValidReading = int(time())
            return result
    
        except:
            return False
        
    def linearly_approx_from_dict(self, data, dict):
        keys = list(dict.keys())
        keys.sort()
        if data < keys[0]:
            return dict[keys[0]] # lower bound
        elif data > keys[-1]:
            return dict[keys[-1]] # upper bound
        else:
            for i in range(len(keys)):
                if data > keys[i] and data < keys[i+1]: # between points
                    return dict[keys[i]] + (dict[keys[i+1]] - dict[keys[i]]) * (data - keys[i]) / (keys[i+1] - keys[i])
                
    def rpm(self, data):
        revFactor = config['DEFAULT']['rdac.rev_factor']
        rdacVal = int.from_bytes(data[0:2], 'little')
        revFudge = (600 / revFactor)*15586
        rpm = 0
        if rdacVal <=30000 and rdacVal != 0:
            rpm=revFudge/rdacVal
        
        self.charasteristics['rpm'].setValue(int(round(rpm)))
        
    def fuel(self, data):
        pass # not know how to convert parsed data flow1 16b, flow2 16b to representative data
        
    def thermocouple(self, data):
        self.charasteristics['TC1'].setValue(int.from_bytes(data[0:2], 'little'))
        self.charasteristics['TC2'].setValue(int.from_bytes(data[2:4], 'little'))
        self.charasteristics['TC3'].setValue(int.from_bytes(data[4:6], 'little'))
        self.charasteristics['TC4'].setValue(int.from_bytes(data[6:8], 'little'))
        
    def unknownMsg(self, data):
        self.charasteristics['UM1'].setValue(int.from_bytes(data[0:2], 'little'))
        self.charasteristics['UM2'].setValue(int.from_bytes(data[2:4], 'little'))
        self.charasteristics['UM3'].setValue(int.from_bytes(data[4:6], 'little'))
        self.charasteristics['UM4'].setValue(int.from_bytes(data[6:8], 'little'))
        self.charasteristics['UM5'].setValue(int.from_bytes(data[8:10], 'little'))
        self.charasteristics['UM6'].setValue(int.from_bytes(data[10:12], 'little'))
        
    def analogMeasures(self, data):
        self.charasteristics['AT1'].setValue(int.from_bytes(data[0:2], 'little'))
        self.charasteristics['AT2'].setValue(int.from_bytes(data[2:4], 'little'))
        self.charasteristics['AT3'].setValue(int.from_bytes(data[4:6], 'little'))
        self.charasteristics['AT4'].setValue(int.from_bytes(data[6:8], 'little'))
        self.charasteristics['AU1'].setValue(int.from_bytes(data[8:10], 'little'))
        self.charasteristics['AU2'].setValue(int.from_bytes(data[10:12], 'little'))
        self.charasteristics['AU3'].setValue(int.from_bytes(data[20:22], 'little'))
        self.charasteristics['AOP'].setValue(int.from_bytes(data[16:18], 'little'))
        
        temperatureData = int.from_bytes(data[18:20], 'little')
        temperatureVoltage = temperatureData / 4095 * 5
        temperatureC = temperatureVoltage / 0.01 - 273.15
        self.charasteristics['AET'].setValue(int(round(temperatureC)))
        
        fuelLevelTable = ast.literal_eval(settings.config['DEFAULT']['rdac.fuel_level_table1'])
        fuel = int(round(self.linearly_approx_from_dict(int.from_bytes(data[14:16], 'little'), fuelLevelTable), 0))
        # TODO fuel table set by bluetooth
        # TODO fuel level 2 + own table [12:14]
