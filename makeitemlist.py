import json
import os
import math
import numpy as np

recipeLocation = "./recipes/" #제작법 폴더

recipeNameList = os.listdir(recipeLocation) #제작법 목록

tagDict = {} #태그 이름을 key, 태그에 해당되는 아이템 이름의 리스트를 value로 갖는다

tagDict['minecraft:acacia_logs'] = ['acacia_log', 'acacia_wood', 'stripped_acacia_log', 'stripped_acacia_wood']
tagDict['minecraft:bamboo_blocks'] = ['bamboo_block', 'stripped_bamboo_block']
tagDict['minecraft:birch_logs'] = ['birch_log', 'birch_wood', 'stripped_birch_log', 'stripped_birch_wood']
tagDict['minecraft:cherry_logs'] = ['cherry_log', 'cherry_wood', 'stripped_cherry_log', 'stripped_cherry_wood']
tagDict['minecraft:coals'] = ['coal', 'charcoal']
tagDict['minecraft:crimson_stems'] = ['crimson_stem', 'stripped_crimson_stem', 'crimson_hyphae', 'stripped_crimson_hyphae']
tagDict['minecraft:dark_oak_logs'] = ['dark_oak_log', 'dark_oak_wood', 'stripped_dark_oak_log', 'stripped_dark_oak_wood']
tagDict['minecraft:jungle_logs'] = ['jungle_log', 'jungle_wood', 'stripped_jungle_log', 'stripped_jungle_wood']
tagDict['minecraft:mangrove_logs'] = ['mangrove_log', 'mangrove_wood', 'stripped_mangrove_log', 'stripped_mangrove_wood']
tagDict['minecraft:oak_logs'] = ['oak_log', 'oak_wood', 'stripped_oak_log', 'stripped_oak_wood']
tagDict['minecraft:planks'] = ['oak_planks', 'spruce_planks', 'birch_planks', 'jungle_planks', 'acacia_planks', 'dark_oak_planks']
tagDict['minecraft:soul_fire_base_blocks'] = ['soul_sand', 'soul_soil']
tagDict['minecraft:spruce_logs'] = ['spruce_log', 'spruce_wood', 'stripped_spruce_log', 'stripped_spruce_wood']
tagDict['minecraft:stone_crafting_materials'] = ['cobblestone', 'blackstone', 'cobbled_deepslate']
tagDict['minecraft:stone_tool_materials'] = ['cobblestone', 'blackstone', 'cobbled_deepslate']
tagDict['minecraft:warped_stems'] = ['warped_stem', 'stripped_warped_stem', 'warped_hyphae', 'stripped_warped_hyphae']
tagDict['minecraft:wooden_slabs'] = ['oak_slab', 'spruce_slab', 'birch_slab', 'jungle_slab', 'acacia_slab', 'dark_oak_slab', 'crimson_slab', 'warped_slab', 'mangrove_slab', 'bamboo_slab', 'cherry_slab']
tagDict['minecraft:wool'] = ['white_wool', 'orange_wool', 'magenta_wool', 'light_blue_wool', 'yellow_wool', 'lime_wool', 'pink_wool', 'gray_wool', 'light_gray_wool', 'cyan_wool', 'purple_wool', 'blue_wool', 'brown_wool', 'green_wool', 'red_wool', 'black_wool']
tagDict['minecraft:logs'] = tagDict['minecraft:acacia_logs'] + tagDict['minecraft:birch_logs'] + tagDict['minecraft:cherry_logs'] + tagDict['minecraft:crimson_stems'] + tagDict['minecraft:dark_oak_logs'] + tagDict['minecraft:jungle_logs'] + tagDict['minecraft:mangrove_logs'] + tagDict['minecraft:oak_logs'] + tagDict['minecraft:spruce_logs'] + tagDict['minecraft:warped_stems']

itemCountDict = {}

for recipeName in recipeNameList:
    with open(recipeLocation+recipeName,"r") as f: #json 파일 열기
        json_data = json.load(f) #json 로드

        #print("result : ",json_data["result"])

        if json_data["type"] == "minecraft:crafting_shaped": #모양이 정해진 경우
            #print("key : ",json_data["key"])
            
            for key in json_data["key"].values(): #모든 key에 대해
                #print(key)

                if  type(key) == list: #리스트인 경우
                    for k in key: 
                        if "tag" in k: #tag인 경우
                            for itemName in tagDict[k["tag"]]: #모든 아이템에 대해
                                if itemName in itemCountDict: #이미 나온 아이템
                                    itemCountDict[itemName] += 1 #1 더하기
                                else: #처음 나온 아이템
                                    itemCountDict[itemName] = 1 #1로 시작

                        elif "item" in k: #item인 경우
                            itemName = k["item"].replace("minecraft:","") #minecraft: 제거

                            if itemName in itemCountDict: #이미 나온 아이템
                                itemCountDict[itemName] += 1 #1 더하기
                            else: #처음 나온 아이템
                                itemCountDict[itemName] = 1 #1로 시작
                        else: #예외
                            print(recipeName)
                            print(result, '\n',ingredient)
                            assert()

                elif "tag" in key: #tag인 경우
                    for itemName in tagDict[key["tag"]]: #모든 아이템에 대해
                        if itemName in itemCountDict: #이미 나온 아이템
                            itemCountDict[itemName] += 1 #1 더하기
                        else: #처음 나온 아이템
                            itemCountDict[itemName] = 1 #1로 시작

                elif "item" in key: #item인 경우
                    itemName = key["item"].replace("minecraft:","") #minecraft: 제거
                    
                    if itemName in itemCountDict: #이미 나온 아이템
                        itemCountDict[itemName] += 1 #1 더하기
                    else: #처음 나온 아이템
                        itemCountDict[itemName] = 1 #1로 시작
                else: #예외
                    print(json_data)
                    print(key)
                    assert()

        else: #모양이 정해지지 않은 경우
            #print("ingredients : ",json_data["ingredients"])

            result = [] # 중복 제거된 값들이 들어갈 리스트

            for value in json_data['ingredients']:
                if value not in result:
                    result.append(value)

            for ingredient in result: #모든 ingredient
                #print(ingredient)

                if  type(ingredient) == list: #리스트인 경우
                    for i in ingredient: #
                        if "tag" in i: #tag인 경우
                            for itemName in tagDict[i["tag"]]: #모든 아이템에 대해
                                if itemName in itemCountDict: #이미 나온 아이템
                                    itemCountDict[itemName] += 1 #1 더하기
                                else: #처음 나온 아이템
                                    itemCountDict[itemName] = 1 #1로 시작

                        elif "item" in i: #item인 경우
                            itemName = i["item"].replace("minecraft:","") #minecraft: 제거

                            if itemName in itemCountDict: #이미 나온 아이템
                                itemCountDict[itemName] += 1 #1 더하기
                            else: #처음 나온 아이템
                                itemCountDict[itemName] = 1 #1로 시작
                        else: #예외
                            print(recipeName)
                            print(result, '\n',ingredient)
                            assert()
                    
                elif "tag" in ingredient: #tag인 경우
                    for itemName in tagDict[ingredient["tag"]]: #모든 아이템에 대해
                        if itemName in itemCountDict: #이미 나온 아이템
                            itemCountDict[itemName] += 1 #1 더하기
                        else: #처음 나온 아이템
                            itemCountDict[itemName] = 1 #1로 시작

                elif "item" in ingredient: #item인 경우
                    itemName = ingredient["item"].replace("minecraft:","") #minecraft: 제거

                    if itemName in itemCountDict: #이미 나온 아이템
                        itemCountDict[itemName] += 1 #1 더하기
                    else: #처음 나온 아이템
                        itemCountDict[itemName] = 1 #1로 시작
                else: #예외
                    print(recipeName)
                    print(result, '\n',ingredient)
                    assert()

itemCountDict = dict(sorted(itemCountDict.items(), key=lambda x: x[1])) #value 기준 정렬

print(itemCountDict)
#print(len(itemCountDict))

def firstItems(count:int): #제곱근을 가중치로 해서 아이템을 count개 선정
    # value의 제곱근 계산
    sqrt_values = {k: v for k, v in itemCountDict.items()}

    # 제곱근 값에 비례한 가중치 계산
    total_sqrt = sum(sqrt_values.values())
    weights = {k: v / total_sqrt for k, v in sqrt_values.items()}

    # 가중치를 기반으로 key를 중복 없이 16개 뽑기
    keys = list(weights.keys())
    probabilities = list(weights.values())

    selected_keys = np.random.choice(keys, size=count, replace=False, p=probabilities)

    return(selected_keys)

print(firstItems(16))

    