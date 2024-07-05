# 3*3 리스트를 입력받으면 그것에 맞는 조합법이 있는지 판단한다.

import os
import json
import numpy as np
from tags import tagDict

recipeLocation = "./recipes/" #제작법 폴더
recipeNameList = os.listdir(recipeLocation) #제작법 목록

craftTable = [['','',''],['','',''],['','','']]

craftTable[2][2] = 'iron_ingot'

def checkCraft(craftTable:list):

    for recipeName in recipeNameList:
        with open(recipeLocation+recipeName,"r") as f: #json 파일 열기
            json_data = json.load(f) #json 로드
            
            if json_data["type"] == "minecraft:crafting_shaped": #모양이 정해진 경우
                pass

            else: #모양이 정해지지 않은 경우
                #print(json_data['ingredients'])
                
                ingredientList = []

                for row in craftTable:
                    for craftItem in row: 
                        if craftItem != '': #있다면
                            ingredientList.append[craftItem] #사용한 재료 목록, minecraft: 빼고 저장

                for ingredient in json_data['ingredients']:

                    if type(ingredient) == list:
                        success = False

                        for i in ingredient: 
                            if 'item' in i:
                                if i['item'].replace("minecraft:","") in ingredientList: #제작법에 있는 아이템이라면
                                    success = True
                                    ingredientList.pop(i['item'].replace("minecraft:",""))
                                    break
                            else:
                                print(recipeName)
                                assert()
                        
                        if success is False:
                            pass

                    elif 'tag' in ingredient:
                        print(recipeName)
                    elif 'item' in ingredient:

                pass
    return

checkCraft(craftTable)


