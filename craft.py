# 3*3 리스트를 입력받으면 그것에 맞는 조합법이 있는지 판단한다.

import os
import json
from tags import tagDict
import sys

recipeLocation = "./recipes/" #제작법 폴더
recipeNameList = os.listdir(recipeLocation) #제작법 목록

# craftTable = \
#     [['cobblestone','cobblestone','cobblestone'],\
#      ['quartz','redstone','redstone'],\
#      ['cobblestone','cobblestone','cobblestone']]

#      [['0,0','0,1','0,2'],\
#      ['1,0','1,1','2,1'],\
#      ['2,0','2,1','2,2']]

#shaped 알고리즘
# 1. 제작대의 조합법의 크기 분석 (Ex, 나무 다락문 -> 3*2), 자르기
# 2. json 파일의 조합법의 크기 분석, 일치할시 통과
# 3. 키를 for로 돌려서, 각각의 키가 전부 일치하는지 확인
# 4. 공백도 일치하는지 확인
# 5. 좌우대칭으로 한번 더
# 6. 완

def checkCraft(craftTable:list):

    #재료 목록 원본 만들기
    firstIngredientList = []

    for row in craftTable:
        for craftItem in row: 
            if craftItem != '': #있다면
                firstIngredientList.append(craftItem) #사용한 재료 목록, minecraft: 빼고 저장

    # 1. 제작대의 조합법의 크기 분석 (Ex, 나무 다락문 -> 3*2)
    # 좌우 상하 최댓값 계산 각각 2 0, 2 0에서 스타트
    xMin = 2
    xMax = 0
    yMin = 2
    yMax = 0

    for y in range(3):
        for x in range(3):
            if craftTable[y][x] != '': #있다면
                xMin = min(xMin, x)
                yMin = min(yMin, y)
                xMax = max(xMax, x)
                yMax = max(yMax, y)
                pass
    

    #print(xMin, xMax, yMin, yMax)

    newTable = []

    for y in range(yMin,yMax+1):
        newTable.append(craftTable[y][xMin:xMax+1])

    craftTable = newTable #필요한 부분만 자르기 완료

    for recipeName in recipeNameList:
        with open(recipeLocation+recipeName,"r") as f: #json 파일 열기
            json_data = json.load(f) #json 로드
            
            if json_data["type"] == "minecraft:crafting_shaped": #모양이 정해진 
                
                # print()
                # print(recipeName)
                # print(json_data['key'])
                # print(json_data['pattern'])

                # 2. json 파일의 조합법의 크기 분석, 일치할시 통과
                xLen = len(json_data['pattern'][0])
                yLen = len(json_data['pattern'])

                if xLen == xMax - xMin + 1 and yLen == yMax - yMin + 1: #xy 길이 일치한다면
                    # 3. 키를 for로 돌려서, 각각의 키가 전부 일치하는지 확인

                    goodSetDict = {} #goodSet들 모아둔 Dict

                    for key in list(json_data['key'].keys()): #각각의 키에 대해

                        goodSetDict[key] = set([]) #가능한 아이템 집합

                        if type(json_data['key'][key]) == list: #만약 리스트라면
                            for k in json_data['key'][key]:
                                if 'item' in k:
                                    goodSetDict[key].add(k['item'].replace("minecraft:","")) #싹다 집합에 추가
                                else:
                                    #print(recipeName)
                                    assert()
                        
                        elif 'tag' in json_data['key'][key]: #tag라면
                            goodSetDict[key].update(tagDict[json_data['key'][key]['tag']])

                        elif 'item' in json_data['key'][key]:
                            goodSetDict[key].add(json_data['key'][key]['item'].replace("minecraft:",""))

                    goodSetDict[' '] = set(['']) #공백도 검사해야 한다
                    
                    #print(goodSetDict)

                    patternSuccess = True

                    for y, row in enumerate(json_data['pattern']): #패턴 한줄 따오기
                        for x, k in enumerate(row): #각 문자에 대해
                            if craftTable[y][x] in goodSetDict[k]: #포함된다면
                                pass
                            else: #없다면
                                patternSuccess = False
                                break
                                    
                        if patternSuccess == False:
                            break
                    
                    if patternSuccess == True:
                        return recipeName
                    
                    else: #아니라면

                        #좌우반전으로 한번 더 검사
                        patternSuccess = True

                        for y, row in enumerate(json_data['pattern']): #패턴 한줄 따오기
                            for x, k in enumerate(row): #각 문자에 대해
                                if craftTable[y][len(craftTable[0])-1-x] in goodSetDict[k]: #포함된다면
                                    pass
                                else: #없다면
                                    patternSuccess = False
                                    break
                                        
                            if patternSuccess == False:
                                break
                        
                        if patternSuccess == True:
                            return recipeName
                        else: #최종실패
                            pass
                
                else: #모양 불일치, 탈락
                    pass 

            else: #모양이 정해지지 않은 경우
                #print(json_data['ingredients'])
                
                ingredientList = firstIngredientList.copy() #재료 목록 불러오기
 
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
                                #print(recipeName) #오류
                                assert()
                        
                        if listsuccess is False: #필요한 재료 X
                            success = False
                            break

                    elif 'tag' in ingredient:

                        listsuccess = False

                        for i in tagDict[ingredient['tag']]: #tag 리스트의 모든 것에 대해
                            if i in ingredientList: #제작법에 있는 아이템이라면
                                listsuccess = True
                                ingredientList.remove(i)
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
    return False

if __name__ == "__main__":

    # JSON 형식으로 리스트 출력

    print(checkCraft(json.loads(sys.argv[1])),end="")
    pass
    


