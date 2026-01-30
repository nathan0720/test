from turtle import *

#centre l'échiquier
penup()
goto(-80, -80)
pendown()

cote = 20
for k in range(8): # colonne
    for j in range(8): # rangee
        begin_fill()
        for i in range(4): # case
            if (k+j)%2 == 0:
                fillcolor("black")
            else:
                fillcolor("white")
            fd(cote)
            left(90)
        end_fill()
        fd(cote)
    bk((j+1)*cote) # revient au x de départ
    goto(xcor(), ycor()+cote)
done()