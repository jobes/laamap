import asyncio
import math
from .bmp3xx import BMP3XX, ULTRA_PRECISION
from settings import config, values, units, setValue, log as logger



def init():
    values.update({
        "airPressure":None,
        "ias":None
    })
    
    units.update({
        "airPressure":"&nbsp;Pa",
        "ias":" m/s"
    })

async def processPressure():
    init()
    sensor1 = BMP3XX(ULTRA_PRECISION, cs=6, bus=0, dev=0, speed=8000000)
    sensor2 = BMP3XX(ULTRA_PRECISION, cs=13, bus=0, dev=0, speed=8000000)
    await sensor1.start()
    await sensor2.start()

    while True:
        try:
            currentPressure, currentTemperature = sensor1.values
            setValue("airPressure", currentPressure)
            
            currentPressure2, currentTemperature2 = sensor2.values
            
            #https://aerotoolbox.com/airspeed-conversions/
            presssureDiff = currentPressure2 - currentPressure
            if presssureDiff < 70:
                presssureDiff = 0
            ias = math.sqrt(2*(presssureDiff)/1.225)
            setValue("ias", ias)
            logger.debug("airPressure:"+ str(currentPressure)+", ias:"+str(ias))
            
            if config['DEFAULT']['outside_temp_source'] == 'pressure1':
                setValue('airTemperature', currentTemperature)
            if config['DEFAULT']['outside_temp_source'] == 'pressure2':
                setValue('airTemperature', currentTemperature2)

            await asyncio.sleep(0.1)
        except Exception as err:
            logger.error('AIR pressure error' + str(err))
