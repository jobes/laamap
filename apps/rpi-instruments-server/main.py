import os
import asyncio
import socket
import tornado
import tornado.web
import tornado.websocket
from settings import initSettings, config, handlers, values, units, log
import psutil
from rpi_info import processRpiInfo
from pressure.pressure import processPressure
from rdac import processRdacInfo
import ssl

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
        items_dict = {k:v for (k,v) in values.items()}

        self.render("main-page.html", title=config['DEFAULT']['name'], items=items_dict, units=units)
        
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
