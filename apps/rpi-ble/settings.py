import configparser
import os

config = configparser.ConfigParser()
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
