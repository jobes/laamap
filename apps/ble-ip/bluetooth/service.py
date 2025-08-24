"""Copyright (c) 2019, Douglas Otwell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

import dbus
import dbus.mainloop.glib
import dbus.exceptions
import threading
import struct
try:
  from gi.repository import GObject
except ImportError:
    import gobject as GObject
from .bletools import BleTools

BLUEZ_SERVICE_NAME = "org.bluez"
GATT_MANAGER_IFACE = "org.bluez.GattManager1"
DBUS_OM_IFACE =      "org.freedesktop.DBus.ObjectManager"
DBUS_PROP_IFACE =    "org.freedesktop.DBus.Properties"
GATT_SERVICE_IFACE = "org.bluez.GattService1"
GATT_CHRC_IFACE =    "org.bluez.GattCharacteristic1"
GATT_DESC_IFACE =    "org.bluez.GattDescriptor1"

class InvalidArgsException(dbus.exceptions.DBusException):
    _dbus_error_name = "org.freedesktop.DBus.Error.InvalidArgs"

class NotSupportedException(dbus.exceptions.DBusException):
    _dbus_error_name = "org.bluez.Error.NotSupported"

class NotPermittedException(dbus.exceptions.DBusException):
    _dbus_error_name = "org.bluez.Error.NotPermitted"

class Application(dbus.service.Object):
    def __init__(self):
        dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
        self.mainloop = GObject.MainLoop()
        self.bus = BleTools.get_bus()
        self.path = "/"
        self.services = []
        self.next_index = 0
        dbus.service.Object.__init__(self, self.bus, self.path)

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_service(self, service):
        self.services.append(service)
        return len(self.services)

    @dbus.service.method(DBUS_OM_IFACE, out_signature = "a{oa{sa{sv}}}")
    def GetManagedObjects(self):
        response = {}

        for service in self.services:
            response[service.get_path()] = service.get_properties()
            chrcs = service.get_characteristics()
            for chrc in chrcs:
                response[chrc.get_path()] = chrc.get_properties()
                descs = chrc.get_descriptors()
                for desc in descs:
                    response[desc.get_path()] = desc.get_properties()

        return response

    def register_app_callback(self):
        print("GATT application registered")

    def register_app_error_callback(self, error):
        print("Failed to register application: " + str(error))

    def register(self):
        adapter = BleTools.find_adapter(self.bus)

        service_manager = dbus.Interface(
                self.bus.get_object(BLUEZ_SERVICE_NAME, adapter),
                GATT_MANAGER_IFACE)

        service_manager.RegisterApplication(self.get_path(), {},
                reply_handler=self.register_app_callback,
                error_handler=self.register_app_error_callback)

    def run(self):
        self.mainloop.run()

    def quit(self):
        print("\nGATT application terminated")
        self.mainloop.quit()
        for serv in self.services:
            serv.stop()

class Service(dbus.service.Object):
    PATH_BASE = "/org/bluez/example/service"

    def __init__(self, index, uuid, primary):
        self.bus = BleTools.get_bus()
        self.path = self.PATH_BASE + str(index)
        self.uuid = uuid
        self.primary = primary
        self.characteristics = []
        self.next_index = 0
        self.run = True
        dbus.service.Object.__init__(self, self.bus, self.path)

    def get_properties(self):
        return {
                GATT_SERVICE_IFACE: {
                        'UUID': self.uuid,
                        'Primary': self.primary,
                        'Characteristics': dbus.Array(
                                self.get_characteristic_paths(),
                                signature='o')
                }
        }

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_characteristic(self, characteristic):
        self.characteristics.append(characteristic)

    def get_characteristic_paths(self):
        result = []
        for chrc in self.characteristics:
            result.append(chrc.get_path())
        return result

    def get_characteristics(self):
        return self.characteristics

    def get_bus(self):
        return self.bus

    def get_next_index(self):
        idx = self.next_index
        self.next_index += 1

        return idx

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='s',
                         out_signature='a{sv}')
    def GetAll(self, interface):
        if interface != GATT_SERVICE_IFACE:
            raise InvalidArgsException()

        return self.get_properties()[GATT_SERVICE_IFACE]
        
    def stop(self):
        self.run = False

class Characteristic(dbus.service.Object):
    """
    org.bluez.GattCharacteristic1 interface implementation
    """
    def __init__(self, uuid, flags, service):
        index = service.get_next_index()
        self.path = service.path + '/char' + str(index)
        self.bus = service.get_bus()
        self.uuid = uuid
        self.service = service
        self.flags = flags
        self.descriptors = []
        self.next_index = 0
        dbus.service.Object.__init__(self, self.bus, self.path)

    def get_properties(self):
        return {
                GATT_CHRC_IFACE: {
                        'Service': self.service.get_path(),
                        'UUID': self.uuid,
                        'Flags': self.flags,
                        'Descriptors': dbus.Array(
                                self.get_descriptor_paths(),
                                signature='o')
                }
        }

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_descriptor(self, descriptor):
        self.descriptors.append(descriptor)

    def get_descriptor_paths(self):
        result = []
        for desc in self.descriptors:
            result.append(desc.get_path())
        return result

    def get_descriptors(self):
        return self.descriptors

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='s',
                         out_signature='a{sv}')
    def GetAll(self, interface):
        if interface != GATT_CHRC_IFACE:
            raise InvalidArgsException()

        return self.get_properties()[GATT_CHRC_IFACE]

    @dbus.service.method(GATT_CHRC_IFACE,
                        in_signature='a{sv}',
                        out_signature='ay')
    def ReadValue(self, options):
        print('Default ReadValue called, returning error')
        raise NotSupportedException()

    @dbus.service.method(GATT_CHRC_IFACE, in_signature='aya{sv}')
    def WriteValue(self, value, options):
        print('Default WriteValue called, returning error')
        raise NotSupportedException()

    @dbus.service.method(GATT_CHRC_IFACE)
    def StartNotify(self):
        print('Default StartNotify called, returning error')
        raise NotSupportedException()

    @dbus.service.method(GATT_CHRC_IFACE)
    def StopNotify(self):
        print('Default StopNotify called, returning error')
        raise NotSupportedException()

    @dbus.service.signal(DBUS_PROP_IFACE,
                         signature='sa{sv}as')
    def PropertiesChanged(self, interface, changed, invalidated):
        pass

    def get_bus(self):
        bus = self.bus

        return bus

    def get_next_index(self):
        idx = self.next_index
        self.next_index += 1
        return idx
        
    def _serializeString(self, data):
        value = []
        for c in str(data):
            value.append(dbus.Byte(c.encode()))
        return value
    
    def _deserializeString(self, data):
        value = ''
        for b in data:
            value+=str(b)
        return value
        
    def convertToDbus(self, byteData):
        return [dbus.Byte(b) for b in byteData]
        
    def serialize(self, value, valueType):
        result = []
        if value == '' or value == None:
            return result
        
        match valueType:
            case 'string':
                result = self._serializeString(value)
            case 'uint8':
                number = int(value)
                result = self.convertToDbus(number.to_bytes(1, 'little', signed=False))
            case 'uint16':
                number = int(value)
                result = self.convertToDbus(number.to_bytes(2, 'little', signed=False))
            case 'uint32':
                number = int(value)
                result = self.convertToDbus(number.to_bytes(4, 'little', signed=False))
            case 'sint8':
                number = int(value)
                result = self.convertToDbus(number.to_bytes(1, 'little', signed=True))
            case 'sint16':
                number = int(value)
                result = self.convertToDbus(number.to_bytes(2, 'little', signed=True))
            case 'sint32':
                number = int(value)
                result = self.convertToDbus(number.to_bytes(4, 'little', signed=True))
            case 'float':
                number = float(value)
                result = self.convertToDbus(struct.pack("<f", number))
            case 'double':
                number = float(value)
                result = self.convertToDbus(struct.pack("<d", number))
                
        return result

class Descriptor(dbus.service.Object):
    def __init__(self, uuid, flags, characteristic):
        index = characteristic.get_next_index()
        self.path = characteristic.path + '/desc' + str(index)
        self.uuid = uuid
        self.flags = flags
        self.chrc = characteristic
        self.bus = characteristic.get_bus()
        dbus.service.Object.__init__(self, self.bus, self.path)

    def get_properties(self):
        return {
                GATT_DESC_IFACE: {
                        'Characteristic': self.chrc.get_path(),
                        'UUID': self.uuid,
                        'Flags': self.flags,
                }
        }

    def get_path(self):
        return dbus.ObjectPath(self.path)

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='s',
                         out_signature='a{sv}')
    def GetAll(self, interface):
        if interface != GATT_DESC_IFACE:
            raise InvalidArgsException()

        return self.get_properties()[GATT_DESC_IFACE]

    @dbus.service.method(GATT_DESC_IFACE,
                        in_signature='a{sv}',
                        out_signature='ay')
    def ReadValue(self, options):
        print ('Default ReadValue called, returning error')
        raise NotSupportedException()

    @dbus.service.method(GATT_DESC_IFACE, in_signature='aya{sv}')
    def WriteValue(self, value, options):
        print('Default WriteValue called, returning error')
        raise NotSupportedException()

class StaticDescriptor(Descriptor):
    staticValue = ''

    def __init__(self, uuid, value, characteristic):
        self.staticValue = value
        Descriptor.__init__(
                self, uuid,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.staticValue

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value

class ServiceReadNotifyOnlyCharacteristic(Characteristic):
    notifyEnabled = False
    value = None
    def __init__(self, service, uuid, description, valueType):
        Characteristic.__init__(
                self, uuid,
                ["notify", "read"], service)
        self.type = valueType
        self.add_descriptor(StaticDescriptor("2901", description, self))
        
    def ReadValue(self, options):
        return self.serialize(self.value, self.type)
        
    def StartNotify(self):
        self.notifyEnabled = True
        
    def StopNotify(self):
        self.notifyEnabled = False

    def setValue(self, value):
        if self.value != value:
            self.value = value
            if self.notifyEnabled:
                self.PropertiesChanged(GATT_CHRC_IFACE, {"Value": self.ReadValue(None)}, [])
     
class ThreadedService(Service):   
    def __init__(self, index, uuid, primary):
        Service.__init__(self, index, uuid, primary)
        self.charasteristics = {}
        
    def start(self):
        for charasteristic in self.charasteristics:
            self.add_characteristic(self.charasteristics[charasteristic])

        threading.Thread(target=self.threadWork).start()
    
    def threadWork(self):
        pass
        
