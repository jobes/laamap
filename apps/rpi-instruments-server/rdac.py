import asyncio
import serial
import ast
from time import time
from settings import config, handlers, values, units, setValue, log as logger
from numpy import log as ln

initValues = {
    "rpm":None,
    "cht1Temp":None,
    "cht2Temp":None,
    "oilTemp":None,
    "oilPressure":None,
    #"outsideTemperature":None,
    "fuelLevel":None,
}

def init():
    values.update(initValues)
    
    units.update({
        "rpm":" &nbsp;RPM",
        "cht1Temp":"&nbsp;&deg;C",
        "cht2Temp":"&nbsp;&deg;C",
        "oilTemp":"&nbsp;&deg;C",
        "oilPressure":"&nbsp;BAR",
        #"outsideTemperature":"&nbsp;&deg;C",
        "fuelLevel":"&nbsp;L",
    })
    
lastValidReading = int(time())

async def processRdacInfo():
    global lastValidReading
    try:
        init()
        serialPort = '/dev/ttyS0'
        ser = serial.Serial(serialPort, 1250, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE, timeout=0.5)
        logger.info('RDAC serial opened')
    except Exception as err:
        logger.error('RDAC error' + str(err))
    while True:
        try:
            dle = ser.read()
            if dle == b'\xd5':
                start = ser.read()
                if start != b'\x02':
                    raise Exception('message mismatch')
                else:
                    msg_type = ser.read()
                    if msg_type == b'\x01':
                        #fuel flow - ignore
                        read_data(msg_type, 6, ser)
                    elif msg_type == b'\x02':
                        analogMeasures(read_data(msg_type, 24, ser))
                    elif msg_type == b'\x03':
                        rpm(read_data(msg_type, 4, ser))
                    elif msg_type == b'\x04':
                        #thermocouple - ignore
                        read_data(msg_type, 10, ser)
                    elif msg_type == b'\x05':
                        # unknown - ignore
                        read_data(msg_type, 14, ser)
                    else:
                        raise Exception('unknown msg type')
            else:
                raise Exception('not a message start')
        except:
            if lastValidReading + 2 < int(time()): # no correct reading last 2 seconds
                logger.warning('RDAC disconnected')
                lastValidReading = int(time()+60)
                for key in initValues:
                    setValue(key, None)
				
            ser.close()
            try:
                ser = serial.Serial(serialPort, 1250, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE, timeout=0.5)
            except Exception as err:
                logger.error('RDAC can not connect: '+str(err))
                for key in initValues:
                    setValue(key, None)
            await asyncio.sleep(0.05)


def read_data(msg_type, bytesLength, ser):
    data = ser.read(bytesLength)
    if checksum(msg_type+data):
        return data
    else:
        raise Exception('checksum failed')
        
def checksum(data):
    global lastValidReading
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
            lastValidReading = int(time())
        return result
    
    except:
        return False
        
def linearly_approx_from_dict(data, dict):
    keys = list(dict.keys())
    keys.sort()
    if data < keys[0]:
        return dict[keys[0]] # lower bound
    elif data > keys[-1]:
        return dict[keys[-1]] # upper bound
    elif data in keys:
        return dict[data]
    else:
        for i in range(len(keys)):
            if data > keys[i] and data < keys[i+1]: # between points
                return dict[keys[i]] + (dict[keys[i+1]] - dict[keys[i]]) * (data - keys[i]) / (keys[i+1] - keys[i])

def getChtTemp(value):
    return round(252.0677-31.04685*ln(value-10))
    
def getOilTemp(value):
    return round(268.2977 - 35.32168*ln(value/1.2))
    
def getOilpressure(value):
    rawPressure = 0.0000166377*value*value+0.0145214*value-0.467939
    return round(max(0, rawPressure), 1)
    
def rpm(data):
    revFactor = float(config['DEFAULT']['rdac.rev_factor'])
    rdacVal = int.from_bytes(data[0:2], 'little')
    revFudge = (600 / revFactor)*15586
    rpm = 0
    if rdacVal <=30000 and rdacVal != 0:
        rpm=revFudge/rdacVal
        
    setValue("rpm", int(round(rpm)))
        
def analogMeasures(data):   
    oilTempData = int.from_bytes(data[8:10], 'little')
    oilTemp = getOilTemp(oilTempData)
    setValue('oilTemp', oilTemp)
    
    cht1Data = int.from_bytes(data[10:12], 'little')
    cht1Temp = getChtTemp(cht1Data)
    setValue('cht1Temp', cht1Temp)
    
    cht2Data = int.from_bytes(data[20:22], 'little')
    cht2Temp = getChtTemp(cht2Data)
    setValue('cht2Temp', cht2Temp)
        
    #temperatureData = int.from_bytes(data[18:20], 'little')
    #temperatureVoltage = temperatureData / 4095 * 5
    #temperatureC = temperatureVoltage / 0.01 - 273.15
    #setValue("outsideTemperature", int(round(temperatureC)))
    
    fuelLevelTable = ast.literal_eval(config['DEFAULT']['rdac.fuel_level_table'])
    fuelLevel = int(round(linearly_approx_from_dict(int.from_bytes(data[14:16], 'little'), fuelLevelTable), 0))
    setValue("fuelLevel", fuelLevel)
    
    oilPressureData = int.from_bytes(data[12:14], 'little')
    oilPressure = getOilpressure(oilPressureData)
    setValue('oilPressure', oilPressure)
