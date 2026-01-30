from microbit import *
import radio

radio.on()
radio.config(channel=12)

while True:
    msg = None

    #COMMANDES PAR BOUTONS
    if button_a.is_pressed() and button_b.is_pressed():
        msg = "ST"  # stop
    elif button_a.is_pressed():
        msg = "GA"  # gauche
    elif button_b.is_pressed():
        msg = "DR"  # droite

    # AVANCER / RECULER AVEC INCLINAISON
    else:
        y = accelerometer.get_y()

        if y < -200:
            msg = "AV"
        elif y > 200:
            msg = "RE"
        else:
            msg = "ST"

    if msg:
        radio.send(msg)

    sleep(100)
