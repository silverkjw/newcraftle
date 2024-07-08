# 3*3 리스트를 입력받으면 그것에 맞는 조합법이 있는지 판단한다.

import os
import json
import numpy as np
from tags import tagDict

recipeLocation = "./recipes/" #제작법 폴더
recipeNameList = os.listdir(recipeLocation) #제작법 목록

craftTable = \
    [['','','diamond_block'],\
     ['','',''],\
     ['','','']]



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
                            ingredientList.append(craftItem) #사용한 재료 목록, minecraft: 빼고 저장

                success = True #성공 여부

                for ingredient in json_data['ingredients']:

                    if type(ingredient) == list:

                        listsuccess = False

                        for i in ingredient: 
                            if 'item' in i:
                                if i['item'].replace("minecraft:","") in ingredientList: #제작법에 있는 아이템이라면
                                    listsuccess = True
                                    ingredientList.remove(i['item'].replace("minecraft:",""))

                                    break

                            else:
                                print(recipeName) #오류
                                assert()
                        
                        if listsuccess is False: #필요한 재료 X
                            success = False
                            break

                    elif 'tag' in ingredient:

                        listsuccess = False

                        for i in tagDict[ingredient['tag']]: #tag 리스트의 모든 것에 대해
                            if i in ingredientList: #제작법에 있는 아이템이라면
                                listsuccess = True
                                ingredientList.remove(i['item'].replace("minecraft:",""))
                                break
                        
                        if listsuccess is False: #필요한 재료 X
                            success = False
                            break

                    elif 'item' in ingredient:
                        if ingredient['item'].replace("minecraft:","") in ingredientList: #제작법에 있는 아이템이라면
                            ingredientList.remove(ingredient['item'].replace("minecraft:",""))

                        else: #필요한 재료 X
                            success = False
                            break
                        
                if len(ingredientList) == 0 and success == True: #모든 재료 다 사용, 부족한 재료 X
                    return recipeName #레시피 이름 반환

            pass
    return

print(checkCraft(craftTable))


