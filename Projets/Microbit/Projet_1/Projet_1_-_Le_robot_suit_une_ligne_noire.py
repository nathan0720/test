from microbit import *

""" Maqueen robot """

# 0x10 = valeur en hexadécimal de l'adresse pour communiquer avec le robot
# protocole I2c
def avance():
    # moteur gauche avance
    i2c.write(0x10, bytearray([0x00, 0x0, 100]))
    # moteur droit avance
    i2c.write(0x10, bytearray([0x02, 0x0, 100]))

def recule():
    # moteur gauche recule
    i2c.write(0x10, bytearray([0x00, 0x1, 100]))
    # moteur droit recule
    i2c.write(0x10, bytearray([0x02, 0x1, 100]))

def gauche():
    # moteur gauche stop
    i2c.write(0x10, bytearray([0x00, 0x0, 0]))
    # moteur droit avance
    i2c.write(0x10, bytearray([0x02, 0x0, 100]))

def droite():
    # moteur gauche avance
    i2c.write(0x10, bytearray([0x00, 0x0, 100]))
    # moteur droit stop
    i2c.write(0x10, bytearray([0x02, 0x0, 0]))

def stop():
    # moteur gauche stop
    i2c.write(0x10, bytearray([0x00, 0, 0]))
    # moteur droit stop
    i2c.write(0x10, bytearray([0x02, 0, 0]))

def demitour():
    # moteur gauche avance
    i2c.write(0x10, bytearray([0x00, 0x0, 100]))
    # moteur droit recule
    i2c.write(0x10, bytearray([0x02, 0x1, 100]))

#pour arrive sur la ligne
avance()
sleep(750)

while True:
    pin8.write_digital(pin13.read_digital())
    pin12.write_digital(pin14.read_digital())
    if pin14.read_digital() == 1 and pin13.read_digital() == 1:
        demitour()
    elif pin14.read_digital() == 0 and pin13.read_digital() == 1:
        droite()
    elif pin14.read_digital() == 1 and pin13.read_digital() == 0:
        gauche()
    else:
        avance()


