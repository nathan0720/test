from turtle import *

r = int(input("Choisis la taille de l'oeuf (moyen 100)?"))

#pour bien se place au centre

penup()
goto(-r, -r/2)
pendown()


right(90)
write('A')
circle(r, 180)
write('B')
circle(r*2,45)
write('E')
# on utilise le théorème de Pythagore
circle(r*2-(r**2+r**2)**0.5,90)
write('D')
circle(r*2,45)
write('A')

done()