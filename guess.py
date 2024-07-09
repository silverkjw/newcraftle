# 실제 minecraftle에서 추측을 하는 코드
# guess와 실제 조합법 json을 비교해 초록색, 노란색, 회색인지를 결정한다.

import json
from tags import tagDict

guess = \
    [['','stick',''],\
     ['stick','charcoal','stick'],\
     ['cherry_log','oak_log','mangrove_log']]

def guessResult(guess:list, answerName:str):
    
    result = \
    [['gray','gray','gray'],
     ['gray','gray','gray'],
     ['gray','gray','gray']]
    
    with open("./recipes/"+answerName,"r") as f: #json 파일 열기
        json_data = json.load(f) #json 로드

        if json_data["type"] == "minecraft:crafting_shaped": #모양이 정해진
            # craft.py와 같은 방식으로 key를 key로 갖고 그 아이템들의 집합을 value로 갖는 dict를 만든다
            # key별로 몇개가 사용되는지 개수를 찾고 이를 dict로 만든다
            # 우선 초록색 아이템들을 모두 찾고, 찾을 때마다 개수 dict를 1씩 감소시킨다
            # 개수 dict가 모두 0이라면, 회색칸이 모두 ''인지 확인하고 정답일시 모두 초록색으로 한다
            # 개수 dict에 남은 수만큼 반복하며 key에 맞는 노란색 칸을 찾는다(1이면 1번, 2면 2번)

            goodSetDict = {} #goodSet들 모아둔 Dict

            for key in list(json_data['key'].keys()): #각각의 키에 대해

                goodSetDict[key] = set([]) #가능한 아이템 집합

                if type(json_data['key'][key]) == list: #만약 리스트라면
                    for k in json_data['key'][key]:
                        if 'item' in k:
                            goodSetDict[key].add(k['item'].replace("minecraft:","")) #싹다 집합에 추가
                        else:
                            print(answerName)
                            assert()
                
                elif 'tag' in json_data['key'][key]: #tag라면
                    goodSetDict[key].update(tagDict[json_data['key'][key]['tag']])

                elif 'item' in json_data['key'][key]:
                    goodSetDict[key].add(json_data['key'][key]['item'].replace("minecraft:",""))

            keyCountDict = {}

            # key별로 몇개가 사용되는지 개수를 찾고 이를 dict로 만든다
            for row in json_data['pattern']:
                for k in row:
                    if k == ' ': #공백은 신경 X
                        continue

                    if k in keyCountDict:
                        keyCountDict[k] += 1
                    else:
                        keyCountDict[k] = 1

            # 우선 초록색 아이템들을 모두 찾고, 찾을 때마다 개수 dict를 1씩 감소시킨다
            for y, row in enumerate(json_data['pattern']): #패턴 한줄 따오기
                for x, k in enumerate(row): #각 문자에 대해
                    if k == ' ':
                        continue

                    if guess[y][x] in goodSetDict[k] and keyCountDict[k] > 0: #맞는다면
                        result[y][x] = 'green'
                        keyCountDict[k] -= 1
            
            # 개수 dict가 모두 0이라면, 회색칸이 모두 ''인지 확인하고 정답일시 모두 초록색으로 한다

            if any(list(keyCountDict.values())) == False: #모두 0이라면
                allGrayEmpty = True
                for y, row in enumerate(result):
                    for x, color in enumerate(row): #각 색깔에 대해
                        if color == 'gray':
                            if guess[y][x] != '':
                                allGrayEmpty = False
                                break
                    if allGrayEmpty == False:
                        break
            
                if allGrayEmpty == True:
                    return [['green','green','green'],
                        ['green','green','green'],
                        ['green','green','green']] # 성공, 모두 초록색

            # 개수 dict에 남은 수만큼 반복하며 key에 맞는 노란색 칸을 찾는다(1이면 1번, 2면 2번)
            for y, row in enumerate(guess):
                for x, guessItem in enumerate(row):
                    if result[y][x] == 'gray': #만약 회색이라면
                        for key in keyCountDict:
                            if keyCountDict[key] > 0: # 0보다 크면
                                if guessItem in goodSetDict[key]:
                                    result[y][x] = 'yellow'
                                    keyCountDict[key] -= 1

                    


            pass

        else: #정해지지 않은

            # answer에서 재료 목록을 불러온다. 형식은 리스트 속 집합
            # 재료 목록을 for문으로 돌리며 만약 재료가 있다면 그 칸을 초록색으로 한다.
            # 만약 부족한 재료와 남는 재료가 없다면 모든 칸을 초록색으로 한다 
            
            ingredientList = [] # 재료 목록

            for ingredient in json_data['ingredients']:
                
                appendSet = set([]) #추가할 집합
                
                if type(ingredient) == list:
                    for i in ingredient:
                        if 'item' in i:
                            appendSet.add(i['item'].replace("minecraft:",""))

                        else:
                            print(answerName)
                            assert()
                elif 'tag' in ingredient:
                    appendSet.update(tagDict[ingredient['tag']])

                elif 'item' in ingredient:
                    appendSet.add(ingredient['item'].replace("minecraft:",""))

                ingredientList.append(appendSet)
                


                pass

            totalSuccess = True

            for ingredientSet in ingredientList:

                ingredientSuccess = False

                for y, row in enumerate(guess):
                    for x, guessItem in enumerate(row): 
                        if guessItem in ingredientSet:
                            result[y][x] = 'green'
                            ingredientSuccess = True
                            break
                    if ingredientSuccess == True:
                        break #빠른 퇴장
                
                if ingredientSuccess == False: #재료가 없다면
                    totalSuccess = False #실패
            
            ingredientCount = 0
            for row in guess:
                for guessItem in row:
                    if guessItem != '':
                        ingredientCount += 1 #개수 세기

            if totalSuccess == True and len(ingredientList) == ingredientCount: # 부족한 재료, 남는 재료가 없다면
                return [['green','green','green'],
                        ['green','green','green'],
                        ['green','green','green']] # 성공, 모두 초록색
    
    return result

print(guessResult(guess, "campfire.json"))