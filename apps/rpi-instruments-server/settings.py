import configparser
import os
import logging
from systemd.journal import JournalHandler

log = logging.getLogger('aircraft_instruments')
log.addHandler(JournalHandler())
log.setLevel(logging.INFO)

handlers = []
arrivalMessagesHandlers = []
values = {}
units = {}
config = configparser.ConfigParser()

def setValue(name, value):
    if value != values[name]:
        values[name] = value
        for handler in handlers:
            handler.write_message({"name":name, "value":value})
            
def gotValue(name, value):
    for handler in arrivalMessagesHandlers:
        handler(name, value)
        

def initConfigparser():
    global config
    configFileName = os.path.dirname(__file__) + '/config.ini'
    def saveConfig():
        with open(configFileName, 'w') as configFile:
            config.write(configFile)
    config.read(configFileName)
    config.save = saveConfig

def initSettings():
    initConfigparser()
