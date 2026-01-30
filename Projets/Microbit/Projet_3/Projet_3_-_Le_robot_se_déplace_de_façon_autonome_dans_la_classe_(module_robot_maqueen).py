from microbit import *
import machine
import time
from neopixel import NeoPixel
import radio

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

def recule():
    moteur_gauche(1, 100)
    moteur_droite(1, 100)

def gauche():
    moteur_gauche(0, 0)
    moteur_droite(0, 100)

def droite():
    moteur_gauche(0, 100)
    moteur_droite(0, 0)

def stop():
    moteur_gauche(0, 0)
    moteur_droite(0, 0)


# ===========================
#       DISTANCE
# ===========================
def distance()->float:
    pin1.write_digital(1)
    pin1.write_digital(0)
    pin2.read_digital()
    delai = machine.time_pulse_us(pin2, 1)
    return delai * 34 / 2000


# ===========================
#     LEDS
# ===========================
def set_leds(color):
    for i in range(4):
        np[i] = color
    np.show()


# ===========================
#   OBSTACLE
# ===========================
def obstacle():
    stop()
    sleep(100)
    recule()
    sleep(300)
    stop()
    sleep(100)
    droite()
    sleep(400)
    stop()
    sleep(100)


# ===========================
#       INITIALISATION
# ===========================
radio.on()
radio.config(channel=12)

np = NeoPixel(pin15, 4)
seuil = 30
auto = True  # mode AUTO au démarrage

r = 0
v = 255


# ===========================
#     MODE AUTOMATIQUE
# ===========================
def mode_auto():
    global auto, r, v

    dist = distance()

    if 0 < dist < seuil:

        bloque = True

        for essai in range(5):

            # LEDs : dégradé vert->rouge
            set_leds((r, v, 0))

            r = min(255, r + 50)
            v = max(0, v - 50)

            if distance() >= seuil:
                bloque = False
                break

            obstacle()

        if bloque:
            auto = False
            stop()

    else:
        # avance normale
        r, v = 0, 255
        avance()
        set_leds((255, 255, 255))
        sleep(20)


# ===========================
#     MODE MANUEL
# ===========================
def mode_manuel():
    msg = radio.receive()

    # LEDs rouges
    set_leds((255, 0, 0))

    if msg == "AV":
        avance()
    elif msg == "RE":
        recule()
    elif msg == "GA":
        gauche()
    elif msg == "DR":
        droite()
    elif msg == "ST":
        stop()


# ===========================
#       BOUCLE PRINCIPALE
# ===========================
while True:
    if auto:
        mode_auto()
    else:
        mode_manuel()


