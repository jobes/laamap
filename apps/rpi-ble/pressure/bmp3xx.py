# -*- coding: utf-8 -*
'''!
  based on @url  https://github.com/DFRobot/DFRobot_BMP3XX
'''
import time

import spidev
import RPi.GPIO as GPIO

import logging
from ctypes import *

logger = logging.getLogger()
# logger.setLevel(logging.INFO)   # Display all print information
logger.setLevel(logging.FATAL)   # If you don’t want to display too many prints, only print errors, please use this option
ph = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - [%(filename)s %(funcName)s]:%(lineno)d - %(levelname)s: %(message)s")
ph.setFormatter(formatter) 
logger.addHandler(ph)

## I2C communication address when SDO is grounded
DFROBOT_BMP3XX_I2C_ADDR_SDO_GND = 0x76
## I2C communication address when SDO is connected to power
DFROBOT_BMP3XX_I2C_ADDR_SDO_VDD = 0x77

## BMP388 chip version
BMP388_CHIP_ID = 0x50
## BMP390L chip version
BMP390L_CHIP_ID = 0x60

# BMP3XX register address
## The “CHIP_ID” register contains the chip identification code.
BMP3XX_CHIP_ID = 0x00
## The “Rev_ID” register contains the mask revision of the ASIC.
BMP3XX_REV_ID = 0x01
## Sensor Error conditions are reported in the “ERR_REG” register.
BMP3XX_ERR_REG = 0x02
## The Sensor Status Flags are stored in the “STATUS” register.
BMP3XX_STATUS = 0x03
## The 24Bit pressure data is split and stored in three consecutive registers.
BMP3XX_P_DATA_PA = 0x04
## The 24Bit temperature data is split and stored in three consecutive registered.
BMP3XX_T_DATA_C = 0x07
## The 24Bit sensor time is split and stored in three consecutive registers.
BMP3XX_TIME = 0x0C
## The “EVENT” register contains the sensor status flags.
BMP3XX_EVENT = 0x10
## The “INT_STATUS” register shows interrupt status and is cleared after reading.
BMP3XX_INT_STATUS = 0x11
## The FIFO byte counter indicates the current fill level of the FIFO buffer.
BMP3XX_FIFO_LENGTH = 0x12
## The “FIFO_DATA” is the data output register.
BMP3XX_FIFO_DATA = 0x14
## The FIFO Watermark size is 9 Bit and therefore written to the FIFO_WTM_0 and FIFO_WTM_1 registers.
BMP3XX_FIFO_WTM_0 = 0x15
## The FIFO Watermark size is 9 Bit and therefore written to the FIFO_WTM_0 and FIFO_WTM_1 registers.
BMP3XX_FIFO_WTM_1 = 0x16
## The “FIFO_CONFIG_1” register contains the FIFO frame content configuration.
BMP3XX_FIFO_CONF_1 = 0x17
## The “FIFO_CONFIG_2” register extends the FIFO_CONFIG_1 register.
BMP3XX_FIFO_CONF_2 = 0x18
## Interrupt configuration can be set in the “INT_CTRL” register.
BMP3XX_INT_CTRL = 0x19
## The “IF_CONF” register controls the serial interface settings.
BMP3XX_IF_CONF = 0x1A
## The “PWR_CTRL” register enables or disables pressure and temperature measurement.
BMP3XX_PWR_CTRL = 0x1B
## The “OSR” register controls the oversampling settings for pressure and temperature measurements.
BMP3XX_OSR = 0x1C
## The “ODR” register set the configuration of the output data rates by means of setting the subdivision/subsampling.
BMP3XX_ODR = 0x1D
## The “CONFIG” register controls the IIR filter coefficients
BMP3XX_IIR_CONFIG = 0x1F
## 0x31-0x45 is calibration data
BMP3XX_CALIB_DATA = 0x31
## Command register, can soft reset and clear all FIFO data
BMP3XX_CMD = 0x7E

# Sensor configuration
## Sleep mode: It will be in sleep mode by default after power-on reset. In this mode, no measurement is performed and power consumption is minimal. 
##             All registers are accessible for reading the chip ID and compensation coefficient.
SLEEP_MODE  = 0x00
## Forced mode: In this mode, the sensor will take a single measurement according to the selected measurement and filtering options. After the
##              measurement is completed, the sensor will return to sleep mode, and the measurement result can be obtained in the register.
FORCED_MODE = 0x10
## Normal mode: Continuously loop between the measurement period and the standby period. The output data rates are related to the ODR mode setting.
NORMAL_MODE = 0x30

## pressure oversampling settings
BMP3XX_PRESS_OSR_SETTINGS = (0x00, 0x01, 0x02, 0x03, 0x04, 0x05)
## temperature oversampling settings
BMP3XX_TEMP_OSR_SETTINGS = (0x00, 0x08, 0x10, 0x18, 0x20, 0x28)

## Filter coefficient is 0 ->Bypass mode
BMP3XX_IIR_CONFIG_COEF_0   = 0x00
## Filter coefficient is 1
BMP3XX_IIR_CONFIG_COEF_1   = 0x02
## Filter coefficient is 3
BMP3XX_IIR_CONFIG_COEF_3   = 0x04
## Filter coefficient is 7
BMP3XX_IIR_CONFIG_COEF_7   = 0x06
## Filter coefficient is 15
BMP3XX_IIR_CONFIG_COEF_15  = 0x08
## Filter coefficient is 31
BMP3XX_IIR_CONFIG_COEF_31  = 0x0A
## Filter coefficient is 63
BMP3XX_IIR_CONFIG_COEF_63  = 0x0C
## Filter coefficient is 127
BMP3XX_IIR_CONFIG_COEF_127 = 0x0E

## Prescale:1; ODR 200Hz; Sampling period:5 ms
BMP3XX_ODR_200_HZ    = 0x00
## Prescale:2; Sampling period:10 ms
BMP3XX_ODR_100_HZ    = 0x01
## Prescale:4; Sampling period:20 ms
BMP3XX_ODR_50_HZ     = 0x02
## Prescale:8; Sampling period:40 ms
BMP3XX_ODR_25_HZ     = 0x03
## Prescale:16; Sampling period:80 ms
BMP3XX_ODR_12P5_HZ   = 0x04
## Prescale:32; Sampling period:160 ms
BMP3XX_ODR_6P25_HZ   = 0x05
## Prescale:64; Sampling period:320 ms
BMP3XX_ODR_3P1_HZ    = 0x06
## Prescale:127; Sampling period:640 ms
BMP3XX_ODR_1P5_HZ    = 0x07
## Prescale:256; Sampling period:1.280 s
BMP3XX_ODR_0P78_HZ   = 0x08
## Prescale:512; Sampling period:2.560 s
BMP3XX_ODR_0P39_HZ   = 0x09
## Prescale:1024 Sampling period:5.120 s
BMP3XX_ODR_0P2_HZ    = 0x0A
## Prescale:2048; Sampling period:10.24 s
BMP3XX_ODR_0P1_HZ    = 0x0B
## Prescale:4096; Sampling period:20.48 s
BMP3XX_ODR_0P05_HZ   = 0x0C
## Prescale:8192; Sampling period:40.96 s
BMP3XX_ODR_0P02_HZ   = 0x0D
## Prescale:16384; Sampling period:81.92 s
BMP3XX_ODR_0P01_HZ   = 0x0E
## Prescale:32768; Sampling period:163.84 s
BMP3XX_ODR_0P006_HZ  = 0x0F
## Prescale:65536; Sampling period:327.68 s
BMP3XX_ODR_0P003_HZ  = 0x10
## Prescale:131072; ODR 25/16384Hz; Sampling period:655.36 s
BMP3XX_ODR_0P0015_HZ = 0x11

# 6 commonly used sampling modes
# Ultra-low precision, suitable for monitoring weather (lowest power consumption), the power is mandatory mode.
ULTRA_LOW_PRECISION = 0
## Low precision, suitable for casual detection, power is normal mode
LOW_PRECISION = 1
## Normal precision 1, suitable for dynamic detection on handheld devices (e.g on mobile phones), power is normal mode
NORMAL_PRECISION1 = 2
## Normal precision 2, suitable for drones, power is normal mode
NORMAL_PRECISION2 = 3
## High precision, suitable for low-power handled devices (e.g mobile phones), power is normal mode
HIGH_PRECISION = 4
## Ultra-high precision, suitable for indoor navigation, its acquisition rate will be extremely low, and the acquisition cycle is 1000 ms.
ULTRA_PRECISION = 5

## Triggers a reset, all user configuration settings are overwritten with their default state.
BMP3XX_CMD_RESET = 0xB6


class BMP3XX(object):
    def __init__(self, precision=ULTRA_PRECISION,cs=8, bus=0, dev=0, speed=8000000):
        self._cs = cs
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self._cs, GPIO.OUT, initial=1)
        GPIO.output(self._cs, GPIO.LOW)
        self.spi = spidev.SpiDev()
        self.spi.open(bus, dev)
        self.spi.no_cs = True
        self.spi.max_speed_hz = speed

        while (self.begin() == False):
          print ('Please check that the device is properly connected')
          time.sleep(3)
        print("sensor begin successfully!!!")

        while(self.set_common_sampling_mode(precision) == False):
          print ('Set samping mode fail, retrying...')
          time.sleep(3)


    def begin(self):
        ret = True
        chip_id = self._read_reg(BMP3XX_CHIP_ID, 1)
        logger.info(chip_id[0])
        if chip_id[0] not in (BMP388_CHIP_ID, BMP390L_CHIP_ID):
            ret = False
        self._get_coefficients()
        self.reset()
        return ret

    @property
    def get_pressure(self):
        adc_p, adc_t = self._get_reg_temp_press_data()
        return self._compensate_data(adc_p, adc_t)[0]

    @property
    def get_temperature(self):
        adc_p, adc_t = self._get_reg_temp_press_data()
        return self._compensate_data(adc_p, adc_t)[1]

    @property
    def values(self):
        adc_p, adc_t = self._get_reg_temp_press_data()
        return self._compensate_data(adc_p, adc_t)
    
    def set_power_mode(self, mode):
        temp = self._read_reg(BMP3XX_PWR_CTRL, 1)[0]
        if (mode | 0x03) == temp:
            logger.info("Same configuration as before!")
        else:
            if mode != SLEEP_MODE:
                self._write_reg(BMP3XX_PWR_CTRL, (SLEEP_MODE & 0x30) | 0x03)
                time.sleep(0.02)
            self._write_reg(BMP3XX_PWR_CTRL, (mode & 0x30) | 0x03)
            time.sleep(0.02)

    def set_oversampling(self, press_osr_set, temp_osr_set):
        self._write_reg(BMP3XX_OSR, (press_osr_set | temp_osr_set) & 0x3F)

    def filter_coefficient(self, iir_config_coef):
        self._write_reg(BMP3XX_IIR_CONFIG, iir_config_coef & 0x0E)

    def set_output_data_rates(self, odr_set):
        ret = True
        self._write_reg(BMP3XX_ODR, odr_set & 0x1F)
        if (self._read_reg(BMP3XX_ERR_REG, 1)[0] & 0x04):
            logger.warning("Sensor configuration error detected!")
            ret = False
        return ret

    def _uint8_to_int(self,num):
        if(num>127):
            num = num - 256
        return num

    def _uint16_to_int(self,num):
        if(num>32767):
            num = num - 65536
        return num

    def set_common_sampling_mode(self, mode):
        ret = True
        if mode == ULTRA_LOW_PRECISION:
            self.set_power_mode(FORCED_MODE)
            self.set_oversampling(BMP3XX_PRESS_OSR_SETTINGS[0], BMP3XX_TEMP_OSR_SETTINGS[0])
            self.filter_coefficient(BMP3XX_IIR_CONFIG_COEF_0)
            self.set_output_data_rates(BMP3XX_ODR_0P01_HZ)
        elif mode == LOW_PRECISION:
            self.set_power_mode(NORMAL_MODE)
            self.set_oversampling(BMP3XX_PRESS_OSR_SETTINGS[1], BMP3XX_TEMP_OSR_SETTINGS[0])
            self.filter_coefficient(BMP3XX_IIR_CONFIG_COEF_0)
            self.set_output_data_rates(BMP3XX_ODR_100_HZ)
        elif mode == NORMAL_PRECISION1:
            self.set_power_mode(NORMAL_MODE)
            self.set_oversampling(BMP3XX_PRESS_OSR_SETTINGS[2], BMP3XX_TEMP_OSR_SETTINGS[0])
            self.filter_coefficient(BMP3XX_IIR_CONFIG_COEF_3)
            self.set_output_data_rates(BMP3XX_ODR_50_HZ)
        elif mode == NORMAL_PRECISION2:
            self.set_power_mode(NORMAL_MODE)
            self.set_oversampling(BMP3XX_PRESS_OSR_SETTINGS[3], BMP3XX_TEMP_OSR_SETTINGS[0])
            self.filter_coefficient(BMP3XX_IIR_CONFIG_COEF_1)
            self.set_output_data_rates(BMP3XX_ODR_50_HZ)
        elif mode == HIGH_PRECISION:
            self.set_power_mode(NORMAL_MODE)
            self.set_oversampling(BMP3XX_PRESS_OSR_SETTINGS[3], BMP3XX_TEMP_OSR_SETTINGS[0])
            self.filter_coefficient(BMP3XX_IIR_CONFIG_COEF_1)
            self.set_output_data_rates(BMP3XX_ODR_12P5_HZ)
        elif mode == ULTRA_PRECISION:
            self.set_power_mode(NORMAL_MODE)
            self.set_oversampling(BMP3XX_PRESS_OSR_SETTINGS[4], BMP3XX_TEMP_OSR_SETTINGS[1])
            self.filter_coefficient(BMP3XX_IIR_CONFIG_COEF_3)
            self.set_output_data_rates(BMP3XX_ODR_25_HZ)
        else:
            ret = False
        return ret

    def _get_coefficients(self):
        calib = self._read_reg(BMP3XX_CALIB_DATA, 21)
        self._data_calib = (
            ((calib[1] << 8) | calib[0]) / 2 ** -8.0,  # T1
            ((calib[3] << 8) | calib[2]) / 2 ** 30.0,  # T2
            self._uint8_to_int(calib[4]) / 2 ** 48.0,  # T3
            (self._uint16_to_int((calib[6] << 8) | calib[5]) - 2 ** 14.0) / 2 ** 20.0,  # P1
            (self._uint16_to_int((calib[8] << 8) | calib[7]) - 2 ** 14.0) / 2 ** 29.0,  # P2
            self._uint8_to_int(calib[9]) / 2 ** 32.0,  # P3
            self._uint8_to_int(calib[10]) / 2 ** 37.0,  # P4
            ((calib[12] << 8) | calib[11]) / 2 ** -3.0,  # P5
            ((calib[14] << 8) | calib[13]) / 2 ** 6.0,  # P6
            self._uint8_to_int(calib[15]) / 2 ** 8.0,  # P7
            self._uint8_to_int(calib[16]) / 2 ** 15.0,  # P8
            (self._uint16_to_int(calib[18] << 8) | calib[17]) / 2 ** 48.0,  # P9
            self._uint8_to_int(calib[19]) / 2 ** 48.0,  # P10
            self._uint8_to_int(calib[20]) / 2 ** 65.0,  # P11
        )

    def _compensate_data(self, adc_p, adc_t):
        # datasheet, p28, Trimming Coefficient listing in register map with size and sign attributes
        t1, t2, t3, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11 = self._data_calib
        #logger.info(self._data_calib)

        # Temperature compensation
        pd1 = adc_t - t1
        pd2 = pd1 * t2
        temperature = pd2 + (pd1 * pd1) * t3

        # Pressure compensation
        pd1 = p6 * temperature
        pd2 = p7 * temperature ** 2.0
        pd3 = p8 * temperature ** 3.0
        po1 = p5 + pd1 + pd2 + pd3
        pd1 = p2 * temperature
        pd2 = p3 * temperature ** 2.0
        pd3 = p4 * temperature ** 3.0
        po2 = adc_p * (p1 + pd1 + pd2 + pd3)
        pd1 = adc_p ** 2.0
        pd2 = p9 + p10 * temperature
        pd3 = pd1 * pd2
        pd4 = pd3 + p11 * adc_p ** 3.0
        pressure = po1 + po2 + pd4

        return int(round(pressure, -1)), int(round(temperature, 0))

    def _get_reg_temp_press_data(self):
        data = self._read_reg(BMP3XX_P_DATA_PA, 6)
        adc_p = data[2] << 16 | data[1] << 8 | data[0]
        adc_t = data[5] << 16 | data[4] << 8 | data[3]
        return adc_p, adc_t

    def reset(self):
        self._write_reg(BMP3XX_CMD, BMP3XX_CMD_RESET)

    def _write_reg(self, reg, data):
        if isinstance(data, int):
            data = [data]
        reg_addr = [reg & 0x7f]
        GPIO.output(self._cs, GPIO.LOW)
        self.spi.xfer(reg_addr)
        self.spi.xfer(data)
        GPIO.output(self._cs, GPIO.HIGH)

    def _read_reg(self, reg, length):
        reg_addr = [reg | 0x80]
        GPIO.output(self._cs, GPIO.LOW)
        self.spi.xfer(reg_addr)
        time.sleep(0.01)
        self.spi.readbytes(1)
        rslt = self.spi.readbytes(length)
        GPIO.output(self._cs, GPIO.HIGH)
        return rslt
