import json
import os
import numpy as np
from tags import tagDict
import sys

# recipeLocation = "./recipes/" #제작법 폴더

# recipeNameList = os.listdir(recipeLocation) #제작법 목록


# itemCountDict = {}

# for recipeName in recipeNameList:
#     with open(recipeLocation+recipeName,"r") as f: #json 파일 열기
#         json_data = json.load(f) #json 로드

#         #print("result : ",json_data["result"])

#         if json_data["type"] == "minecraft:crafting_shaped": #모양이 정해진 경우
#             #print("key : ",json_data["key"])
            
#             for key in json_data["key"].values(): #모든 key에 대해
#                 #print(key)

#                 if  type(key) == list: #리스트인 경우
#                     for k in key: 
#                         if "tag" in k: #tag인 경우
#                             for itemName in tagDict[k["tag"]]: #모든 아이템에 대해
#                                 if itemName in itemCountDict: #이미 나온 아이템
#                                     itemCountDict[itemName] += 1 #1 더하기
#                                 else: #처음 나온 아이템
#                                     itemCountDict[itemName] = 1 #1로 시작

#                         elif "item" in k: #item인 경우
#                             itemName = k["item"].replace("minecraft:","") #minecraft: 제거

#                             if itemName in itemCountDict: #이미 나온 아이템
#                                 itemCountDict[itemName] += 1 #1 더하기
#                             else: #처음 나온 아이템
#                                 itemCountDict[itemName] = 1 #1로 시작
#                         else: #예외
#                             print(recipeName)
#                             print(result, '\n',ingredient)
#                             assert()

#                 elif "tag" in key: #tag인 경우
#                     for itemName in tagDict[key["tag"]]: #모든 아이템에 대해
#                         if itemName in itemCountDict: #이미 나온 아이템
#                             itemCountDict[itemName] += 1 #1 더하기
#                         else: #처음 나온 아이템
#                             itemCountDict[itemName] = 1 #1로 시작

#                 elif "item" in key: #item인 경우
#                     itemName = key["item"].replace("minecraft:","") #minecraft: 제거
                    
#                     if itemName in itemCountDict: #이미 나온 아이템
#                         itemCountDict[itemName] += 1 #1 더하기
#                     else: #처음 나온 아이템
#                         itemCountDict[itemName] = 1 #1로 시작
#                 else: #예외
#                     print(json_data)
#                     print(key)
#                     assert()

#         else: #모양이 정해지지 않은 경우
#             #print("ingredients : ",json_data["ingredients"])

#             result = [] # 중복 제거된 값들이 들어갈 리스트

#             for value in json_data['ingredients']:
#                 if value not in result:
#                     result.append(value)

#             for ingredient in result: #모든 ingredient
#                 #print(ingredient)

#                 if  type(ingredient) == list: #리스트인 경우

#                     alpha = 1/len(ingredient) #재료 목록 길이로 나누기, 예를 들어 5개 중 하나를 써야 한다면 각각 0.2씩 더한다
                    
#                     for i in ingredient: #
#                         if "tag" in i: #tag인 경우(없는듯)
#                             for itemName in tagDict[i["tag"]]: #모든 아이템에 대해
#                                 if itemName in itemCountDict: #이미 나온 아이템
#                                     itemCountDict[itemName] += 1 #1 더하기
#                                 else: #처음 나온 아이템
#                                     itemCountDict[itemName] = 1 #1로 시작

#                         elif "item" in i: #item인 경우
#                             itemName = i["item"].replace("minecraft:","") #minecraft: 제거

#                             if itemName in itemCountDict: #이미 나온 아이템
#                                 itemCountDict[itemName] += alpha #alpha 더하기
#                             else: #처음 나온 아이템
#                                 itemCountDict[itemName] = alpha #alpha 시작
#                         else: #예외
#                             print(recipeName)
#                             print(result, '\n',ingredient)
#                             assert()
                    
#                 elif "tag" in ingredient: #tag인 경우

#                     alpha = 1/len(tagDict[ingredient["tag"]])

#                     for itemName in tagDict[ingredient["tag"]]: #모든 아이템에 대해
#                         if itemName in itemCountDict: #이미 나온 아이템
#                             itemCountDict[itemName] += alpha #1 더하기
#                         else: #처음 나온 아이템
#                             itemCountDict[itemName] = alpha #1로 시작

#                 elif "item" in ingredient: #item인 경우

#                     itemName = ingredient["item"].replace("minecraft:","") #minecraft: 제거

#                     if itemName in itemCountDict: #이미 나온 아이템
#                         itemCountDict[itemName] += 1 #1 더하기
#                     else: #처음 나온 아이템
#                         itemCountDict[itemName] = 1 #1로 시작
                        
#                 else: #예외
#                     print(recipeName)
#                     print(result, '\n',ingredient)
#                     assert()


# for key in list(itemCountDict.keys()):
#     if "_planks" in key or "_log" in key or "_stem" in key: #나무의 경우 9종류
#         itemCountDict[key] /= 3 #좀 줄이기

#     elif "_dye" in key: #염료의 경우 16종류
#         itemCountDict[key] /= 4 #좀 줄이기

#     elif "_wool" in key: #양털의 경우 16종류
#         itemCountDict[key] /= 4 #좀 줄이기

#     elif "_copper" in key or "copper_" in key or "honeycomb" in key: #구리 시리즈 견제
#         itemCountDict[key] /= 2

#     elif "glass" in key or "terracotta" in key or key == "sand" or key == "gravel": #염색 가능한 것들
#         itemCountDict[key] /= 2
 
# itemCountDict = dict(sorted(itemCountDict.items(), key=lambda x: x[1])) #value 기준 정렬

# print(json.dumps(itemCountDict, indent=4))

#print(len(itemCountDict))



def firstItems(count:int): #제곱을 가중치로 해서 아이템을 count개 선정

    with open("./itemchance.json","r") as f: #json 파일 열기
        itemCountDict = json.load(f) #json 로드
    
    values = {k: v for k, v in itemCountDict.items()}
    #value 값에 비례한 가중치 계산
    total = sum(values.values())
    weights = {k: v / total for k, v in values.items()}

    # 가중치를 기반으로 key를 중복 없이 16개 뽑기
    keys = list(weights.keys())
    probabilities = list(weights.values())

    try:
        selected_keys = np.random.choice(keys, size=count, replace=False, p=probabilities)
    except:
        import traceback
        print(traceback.format_exc())

    return list(selected_keys)

if __name__ == "__main__":
    
    # JSON 형식으로 리스트 출력

    print(json.dumps(firstItems(int(sys.argv[1]))))
    
