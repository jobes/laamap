import asyncio
import psutil
from settings import values, units, setValue

def init():
    values.update({
        "cpuUsage":None,
        "cpuTemp":None,
        "ramUsage":None
    })
    
    units.update({
        "cpuUsage":"%",
        "cpuTemp":"&nbsp;&deg;C",
        "ramUsage":"%"
    })

async def processRpiInfo():
    init()
    while True:
        setValue("cpuUsage", round(psutil.cpu_percent()))
        setValue("ramUsage", round(psutil.virtual_memory().percent))
        setValue("cpuTemp", round(psutil.sensors_temperatures(fahrenheit=False)['cpu_thermal'][0].current))
        await asyncio.sleep(1)
