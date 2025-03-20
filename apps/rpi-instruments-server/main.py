import os
import asyncio
import socket
import tornado
import tornado.web
import tornado.websocket
from settings import initSettings, config, handlers, values, units, log
from rpi_info import processRpiInfo
from pressure.pressure import processPressure
from rdac import processRdacInfo

class InstrumentsWebSocket(tornado.websocket.WebSocketHandler):
    async def open(self):
        self.set_nodelay(True)
        handlers.append(self)
        log.info("WebSocket opened")

    def on_close(self):
        handlers.remove(self)
        log.info("WebSocket closed")
        
    def check_origin(self, origin):
        return True

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        canBeIgnored = ['thermoCouple1', 'thermoCouple2', 'thermoCouple3', 'thermoCouple4', 'um1', 'um2', 'um3', 'um4', 'analogTemp1', 'analogTemp2', 'analogTemp3', 'analogTemp4', 'fuelLevel2', 'um5', 'um6']
        needed_dict = {k:v for (k,v) in values.items() if k not in canBeIgnored}
        ignored_dict = {k:v for (k,v) in values.items() if k in canBeIgnored}

        self.render("main-page.html", title=config['DEFAULT']['name'], items=needed_dict, ignoredItems = ignored_dict, units=units)
        
class AllValuesHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.write(values)
        
class SettingsHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("settings-page.html", config=config['DEFAULT'])

    def post(self):
        config['DEFAULT'][self.get_body_argument("setting")] = self.get_body_argument("value")
        config.save()
        self.render("settings-page.html", config=config['DEFAULT'])
    
def make_app():
    settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
}
    return tornado.web.Application([
        (r"/instruments", InstrumentsWebSocket),
        (r"/values", AllValuesHandler),
        (r"/settings", SettingsHandler),
        (r"/", MainHandler),
    ], **settings)

async def main():
    port = 8888
    app = make_app()
    app.listen(port)
    
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('10.0.0.0', 0))  
        myIp = s.getsockname()[0]
        
        log.info('listening on '+ myIp+':'+str(port))
    except:
        pass
    
    asyncio.create_task(processRpiInfo())
    asyncio.create_task(processPressure())
    asyncio.create_task(processRdacInfo())
    await asyncio.Event().wait()

if __name__ == "__main__":
    initSettings()
    asyncio.run(main())
