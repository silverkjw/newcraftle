import os
import random

recipeLocation = "./recipes/" #제작법 폴더

recipeNameList = os.listdir(recipeLocation) #제작법 목록

recipeName = random.choice(recipeNameList) #정답

print(recipeName,end="")
