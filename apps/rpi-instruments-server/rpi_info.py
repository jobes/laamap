import asyncio
import psutil
import time
from settings import values, units, setValue, log as logger

def init():
    values.update({
        "cpuUsage":None,
        "cpuTemp":None,
        "ramUsage":None,
        "currentTime":None
    })
    
    units.update({
        "cpuUsage":"%",
        "cpuTemp":"&nbsp;&deg;C",
        "ramUsage":"%",
        "currentTime":""
    })

async def processRpiInfo():
    init()
    while True:
        setValue("currentTime", time.strftime("%H:%M:%S"))
        setValue("cpuUsage", round(psutil.cpu_percent()))
        setValue("ramUsage", round(psutil.virtual_memory().percent))
        setValue("cpuTemp", round(psutil.sensors_temperatures(fahrenheit=False)['cpu_thermal'][0].current))
        logger.debug("cpuUsage:"+ str(round(psutil.cpu_percent()))+", ramUsage:"+str(round(psutil.virtual_memory().percent))+", cpuTemp:"+str(round(psutil.sensors_temperatures(fahrenheit=False)['cpu_thermal'][0].current)))
        await asyncio.sleep(1)
