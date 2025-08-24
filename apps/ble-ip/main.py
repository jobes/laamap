#!/usr/bin/python

from sys import exit
from bluetooth.advertisement import NameAdvertisement
from bluetooth.service import Application
from ipwatcher import IpWatcherService




def main() -> int:
    index = 0 # every service must have unique index
    app = Application()
    index = app.add_service(IpWatcherService(index))
    app.register()

    adv = NameAdvertisement(0, "OMH-737 IP Watcher")
    adv.add_service_uuid('4ee32a2e-e2fb-42eb-b8c7-a4a5f8fc8a41')
    adv.register()
    
    try:
        app.run()
    except KeyboardInterrupt:
        app.quit()
    return 0

if __name__ == '__main__':
    exit(main())
