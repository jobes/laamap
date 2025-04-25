import serial
import asyncio
from settings import values, units, setValue, log as logger

radioActiveFreq = None
radioActiveFreqName = None
radioStandbyFreq = None
radioStandbyFreqName = None
ser = None

def init():
	values.update({
		"radioActiveFreq":None,
		"radioActiveFreqName":None,
		"radioStandbyFreq":None,
		"radioStandbyFreqName":None,
		"radioRxState":False,
		"radioTxState":False,
		"radioError":False,
	})

	units.update({
		"radioActiveFreq": "&nbsp;MHz",
		"radioActiveFreqName":"",
		"radioStandbyFreq":"&nbsp;MHz",
		"radioStandbyFreqName":"",
		"radioRxState":"",
		"radioTxState":"",
		"radioError":"",
    })

def mainFreq():
	global radioActiveFreq
	global radioActiveFreqName
	
	data = ser.read(11)
	freq = data[0]+data[1]*0.005
	name = data[2:10].decode('ascii')
	checkSumOk = data[0] ^ data[1] == data[10]
	logger.debug('[radio] set main freq' + str(freq) + ', name:'+name+',checkSumOk: '+str(checkSumOk))
	
	if checkSumOk:
		radioActiveFreq = freq
		radioActiveFreqName = name
		setValue("radioActiveFreq", radioActiveFreq)
		setValue("radioActiveFreqName", radioActiveFreqName)
		
def stbyFreq():
	global radioStandbyFreq
	global radioStandbyFreqName
	
	data = ser.read(11)
	freq = data[0]+data[1]*0.005
	name = data[2:10].decode('ascii')
	checkSumOk = data[0] ^ data[1] == data[10]
	logger.debug('[radio] set stby freq' + str(freq) + ', name:'+name+',checkSumOk: '+str(checkSumOk))
	
	if checkSumOk:
		radioStandbyFreq = freq
		radioStandbyFreqName = name
		setValue("radioStandbyFreq", radioStandbyFreq)
		setValue("radioStandbyFreqName", radioStandbyFreqName)
		
def exchangeActiveAndradioStandbyFreq():
	global radioActiveFreq
	global radioActiveFreqName
	global radioStandbyFreq
	global radioStandbyFreqName
	
	logger.debug('[radio] exchanging stdby and active freq')
	oldActive = radioActiveFreq
	oldActiveName = radioActiveFreqName
	radioActiveFreq = radioStandbyFreq
	radioActiveFreqName = radioStandbyFreqName
	radioStandbyFreq = oldActive
	radioStandbyFreqName = oldActiveName
	setValue("radioActiveFreq", radioActiveFreq)
	setValue("radioActiveFreqName", radioActiveFreqName)
	setValue("radioStandbyFreq", radioStandbyFreq)
	setValue("radioStandbyFreqName", radioStandbyFreqName)
	
def saveToMemory():
	data = ser.read(12)
	freq = data[0]+data[1]*0.005
	name = data[2:10].decode('ascii')
	position = data[10]
	checkSumOk = data[0] ^ data[1] == data[11]
	logger.debug('[radio] save freq' + str(freq) + ', name:'+str(name)+',checkSumOk: '+str(checkSumOk)+', position'+str(position))
	
def volume():	
	data = ser.read(1)
	logger.debug('[radio] volume' + str(data))
		
def pptButton():
	data = ser.read(1)
	logger.debug('[radio] PPT set, 0 = pilot only, 1 = copilot only, 2 = both; value='+ str(data[0]))

def intercomVolume():
	data = ser.read(1) # 1 to 9
	logger.debug('[radio] intercomVolume '+ str(data[1]))

async def processRadio():
	global ser
	
	init()
	while True:
		try:
			ser = serial.Serial('/dev/ttyUSB0', baudrate=9600)
			while True:
				while ser.in_waiting < 1:
					await asyncio.sleep(0.01)
				msgStart = ser.read()
				if msgStart == b'S': # ping
					logger.debug('[radio] ping')
					ser.write(b'S')
				elif msgStart == b'\x02':
					msgType = ser.read()
					if msgType == b'\x43':
						exchangeActiveAndradioStandbyFreq()
					elif msgType == b'\x55':
						mainFreq()
					elif msgType == b'\x52':
						stbyFreq()
					elif msgType == b'\x5A':
						saveToMemory()
					elif msgType == b'\x41':
						volume()
					elif msgType == b'\x32':
						pptButton()
					elif msgType == b'\x33':
						intercomVolume()
					elif msgType == b'\x42':
						logger.debug('[radio] low battery')
					elif msgType == b'\x44':
						logger.debug('[radio] low battery end')
					elif msgType == b'\x4A':
						setValue("radioRxState", True)
						logger.debug('[radio] radioRxState true')
					elif msgType == b'\x56':
						setValue("radioRxState", False)
						logger.debug('[radio] radioRxState false')
					elif msgType == b'\x4B':
						setValue("radioTxState", True)
						logger.debug('[radio] radioTxState true')
					elif msgType == b'\x59':
						setValue("radioRxState", False)
						setValue("radioTxState", False)
						logger.debug('[radio] radioRxState false, radioTxState false')
					elif msgType == b'\x4C':
						logger.debug('[radio] radioError 4C')
						setValue("radioError", True)
					elif msgType == b'\x61':
						logger.debug('[radio] radioError 61')
						setValue("radioError", True)
					elif msgType == b'\x62':
						logger.debug('[radio] radioError 62')
						setValue("radioError", True)
					elif msgType == b'\x63':
						logger.debug('[radio] radioError 63')
						setValue("radioError", True)
					elif msgType == b'\x64':
						logger.debug('[radio] radioError 64')
						setValue("radioError", True)
					elif msgType == b'\x65':
						logger.debug('[radio] radioError 65')
						setValue("radioError", True)
					elif msgType == b'\x66':
						logger.debug('[radio] radioError 66')
						setValue("radioError", True)
					elif msgType == b'\x67':
						logger.debug('[radio] radioError 67')
						setValue("radioError", True)
					elif msgType == b'\x68':
						logger.debug('[radio] radioError 68')
						setValue("radioError", True)
					elif msgType == b'\x46':
						logger.debug('[radio] radioError cancel')
						setValue("radioError", False)
					elif msgType == b'\x34':
						logger.debug('[radio] External Audio Input Volume' + str(ser.read(1)))
					elif msgType == b'\x34':
						logger.debug('[radio] Set Sidetone Level' + str(ser.read(1)))
					elif msgType == b'\x38':
						logger.debug('[radio] Channel Spacing to 8.33kHz')
					elif msgType == b'\x36':
						logger.debug('[radio] Set Channel Spacing to 25kHz')
					else:
						logger.debug('[radio] communication unknown '+str(msgType))
						
				elif msgStart == b'\x06':
					logger.debug('[radio] ACK')
				elif msgStart == b'\x15':
					logger.debug('[radio] NACK')
				elif msgStart == b'\x01':
					logger.debug('[radio] connection ACK')
				else:
					logger.debug('[radio] unknown msg start '+str(msgStart))
		except Exception as err:
			logger.error('[radio]: '+str(err))
