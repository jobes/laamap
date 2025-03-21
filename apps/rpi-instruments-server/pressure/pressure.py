import asyncio
import math
from .bmp3xx import BMP3XX, ULTRA_PRECISION
from settings import handlers, values, units, setValue



def init():
    values.update({
        "airPressure":None,
        #"airPressureTemperature":None,
        "ias":None
    })
    
    units.update({
        "airPressure":"&nbsp;Pa",
        #"airPressureTemperature":"&nbsp;&deg;C",
        "ias":" m/s"
    })

async def processPressure():
    init()
    sensor1 = BMP3XX(ULTRA_PRECISION, cs=6, bus=0, dev=0, speed=8000000)
    sensor2 = BMP3XX(ULTRA_PRECISION, cs=13, bus=0, dev=0, speed=8000000)
    await sensor1.start()
    await sensor2.start()

    while True:
        currentPressure, currentTemperature = sensor1.values
        setValue("airPressure", currentPressure)
        #setValue("airPressureTemperature", currentTemperature)
        
        currentPressure2, currentTemperature2 = sensor2.values
        
        #https://aerotoolbox.com/airspeed-conversions/
        presssureDiff = currentPressure - currentPressure2
        if presssureDiff < 500:
            presssureDiff = 0
        ias = math.sqrt(2*(presssureDiff)/1.225)
        setValue("ias", ias)
        await asyncio.sleep(0.1)
