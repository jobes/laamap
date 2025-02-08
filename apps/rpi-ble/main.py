#!/usr/bin/python

from sys import exit
from bluetooth.advertisement import NameAdvertisement
from bluetooth.service import Application
from pressure.pressureService import PressureService
from rdac.rdacVdService import MglRdacVdService
from settings import initSettings

# TODO rdac - read only
# TODO radio - read and set values
# TODO airspeed - with correction setting for 0 msl, so TAS can be calculated
# TODO CPU usage, CPU temp, wifi state, set wifi connection
# TODO logging

def main() -> int:
    initSettings()
    index = 0 # every service must have unique index
    app = Application()
    index = app.add_service(PressureService(index))
    index = app.add_service(MglRdacVdService(index))
    app.register()

    adv = NameAdvertisement(0, "OMH-737 instruments")
    adv.add_service_uuid('e0833334-0e1d-4b79-ae7f-a4e5792819e9')
    adv.register()
    
    try:
        app.run()
    except KeyboardInterrupt:
        app.quit()
    return 0

if __name__ == '__main__':
    exit(main())
