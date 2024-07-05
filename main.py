import random
import os

class Recipe: #조합법 객체
    def __init__(self, recipeName:str):
        with open("./recipes/"+recipeName,"rt") as json:
            pass
        pass

recipeLocation = "./recipes/" #제작법 폴더

recipeNameList = os.listdir("./recipes/")


