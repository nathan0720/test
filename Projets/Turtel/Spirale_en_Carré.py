from turtle import *

x = 10

while x < 150:
    for i in range(3):
         fd(x/5)
         left(120)
    fd(x)
    left(90)
    x += 10

done()

