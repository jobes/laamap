import asyncio
import serial
import ast
from time import time
from settings import config, handlers, values, units, setValue, log as logger
from numpy import log as ln

initValues = {
    "rpm":None,
    "thermoCouple1":None,
    "thermoCouple2":None,
    "thermoCouple3":None,
    "thermoCouple4":None,
    "um1":None,
    "um2":None,
    "um3":None,
    "um4":None,
    "um5":None,
    "um6":None,
    "analogTemp1":None,
    "analogTemp2":None,
    "analogTemp3":None,
    "analogTemp4":None,
    "au4":None,
    "cht1Temp":None,
    "cht2Temp":None,
    "oilTemp":None,
    "oilPressure":None,
    "outsideTemperature":None,
    "fuelLevel1":None,
    "fuelLevel2":None,
    "fuel1":None,
    "fuel2":None,
}

def init():
    values.update(initValues)
    
    units.update({
        "rpm":" &nbsp;RPM",
        "thermoCouple1":"&nbsp;&deg;C",
        "thermoCouple2":"&nbsp;&deg;C",
        "thermoCouple3":"&nbsp;&deg;C",
        "thermoCouple4":"&nbsp;&deg;C",
        "um1":"&nbsp;&deg;C",
        "um2":"&nbsp;&deg;C",
        "um3":"&nbsp;&deg;C",
        "um4":"&nbsp;&deg;C",
        "um5":"",
        "um6":"",
        "analogTemp1":"&nbsp;&deg;C",
        "analogTemp2":"&nbsp;&deg;C",
        "analogTemp3":"&nbsp;&deg;C",
        "analogTemp4":"&nbsp;&deg;C",
        "au4":"",
        "cht1Temp":"&nbsp;&deg;C",
        "cht2Temp":"&nbsp;&deg;C",
        "oilTemp":"&nbsp;&deg;C",
        "oilPressure":" BAR",
        "outsideTemperature":"&nbsp;&deg;C",
        "fuelLevel1":"&nbsp;L",
        "fuelLevel2":"&nbsp;L",
        "fuel1":"",
        "fuel2":"",
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
                        fuel(read_data(msg_type, 6, ser))
                    elif msg_type == b'\x02':
                        analogMeasures(read_data(msg_type, 24, ser))
                    elif msg_type == b'\x03':
                        rpm(read_data(msg_type, 4, ser))
                    elif msg_type == b'\x04':
                        thermocouple(read_data(msg_type, 10, ser))
                    elif msg_type == b'\x05':
                        unknownMsg(read_data(msg_type, 14, ser))
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
    
def rpm(data):
    revFactor = float(config['DEFAULT']['rdac.rev_factor'])
    rdacVal = int.from_bytes(data[0:2], 'little')
    revFudge = (600 / revFactor)*15586
    rpm = 0
    if rdacVal <=30000 and rdacVal != 0:
        rpm=revFudge/rdacVal
        
    setValue("rpm", int(round(rpm)))
        
def fuel(data):
    setValue("fuel1", int.from_bytes(data[0:2], 'little'))
    setValue("fuel2", int.from_bytes(data[2:4], 'little'))
        
def thermocouple(data):
    setValue("thermoCouple1", int.from_bytes(data[0:2], 'little'))
    setValue("thermoCouple2", int.from_bytes(data[2:4], 'little'))
    setValue("thermoCouple3", int.from_bytes(data[4:6], 'little'))
    setValue("thermoCouple4", int.from_bytes(data[6:8], 'little'))
        
def unknownMsg(data):
    setValue('um1', int.from_bytes(data[0:2], 'little'))
    setValue('um2', int.from_bytes(data[2:4], 'little'))
    setValue('um3', int.from_bytes(data[4:6], 'little'))
    setValue('um4', int.from_bytes(data[6:8], 'little'))
    setValue('um5', int.from_bytes(data[8:10], 'little'))
    setValue('um6', int.from_bytes(data[10:12], 'little'))
        
def analogMeasures(data):
    setValue('analogTemp1', int.from_bytes(data[0:2], 'little'))
    setValue('analogTemp2', int.from_bytes(data[2:4], 'little'))
    setValue('analogTemp3', int.from_bytes(data[4:6], 'little'))
    setValue('analogTemp4', int.from_bytes(data[6:8], 'little'))
    setValue('au4', int.from_bytes(data[16:18], 'little'))
    
    oilTempData = int.from_bytes(data[8:10], 'little')
    oilTemp = getOilTemp(oilTempData)
    setValue('oilTemp', oilTemp)
    
    cht1Data = int.from_bytes(data[10:12], 'little')
    cht1Temp = getChtTemp(cht1Data)
    setValue('cht1Temp', cht1Temp)
    
    cht2Data = int.from_bytes(data[20:22], 'little')
    cht2Temp = getChtTemp(cht2Data)
    setValue('cht2Temp', cht2Temp)
        
    temperatureData = int.from_bytes(data[18:20], 'little')
    temperatureVoltage = temperatureData / 4095 * 5
    temperatureC = temperatureVoltage / 0.01 - 273.15
    setValue("outsideTemperature", int(round(temperatureC)))
    
    fuelLevelTable1 = ast.literal_eval(config['DEFAULT']['rdac.fuel_level_table1'])
    fuelLevelTable2 = ast.literal_eval(config['DEFAULT']['rdac.fuel_level_table2'])
    fuel1 = int(round(linearly_approx_from_dict(int.from_bytes(data[14:16], 'little'), fuelLevelTable1), 0))
    fuel2 = int(round(linearly_approx_from_dict(int.from_bytes(data[12:14], 'little'), fuelLevelTable2), 0))
    setValue("fuelLevel1", fuel1)
    setValue("fuelLevel2", fuel2)
