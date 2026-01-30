from microbit import *
import machine
from neopixel import NeoPixel

# ===========================
#       MOTEURS
# ===========================
def moteur_gauche(sens, vitesse):
    i2c.write(0x10, bytearray([0x00, sens, vitesse]))

def moteur_droite(sens, vitesse):
    i2c.write(0x10, bytearray([0x02, sens, vitesse]))

def avance():
    moteur_gauche(0, 100)
    moteur_droite(0, 100)

def stop():
    moteur_gauche(0, 0)
    moteur_droite(0, 0)

# ===========================
#      DISTANCE
# ===========================
def distance()->float:
    pin1.write_digital(1)
    pin1.write_digital(0)
    pin2.read_digital()
    delai = machine.time_pulse_us(pin2, 1)
    return delai * 34 / 2000

# ===========================
#         LEDs
# ===========================
np = NeoPixel(pin15, 4)

def set_leds(color):
    for i in range(4):
        np[i] = color
    np.show()

# ===========================
#         PARAMÈTRES
# ===========================
seuil = 30  # distance seuil

# ===========================
#       BOUCLE PRINCIPALE
# ===========================
while True:
    dist = distance()

    if 0 < dist < seuil:
        # Obstacle détecté → stop + LEDs rouges
        stop()
        set_leds((255, 0, 0))
    else:
        # Pas d'obstacle → avance + LEDs blanches
        avance()
        set_leds((255, 255, 255))

    sleep(50)

