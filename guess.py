# 실제 minecraftle에서 추측을 하는 코드
# guess와 실제 조합법 json을 비교해 초록색, 노란색, 회색인지를 결정한다.

import json
from tags import tagDict

guess = \
    [['','',''],\
     ['gunpowder','charcoal','blaze_powder'],\
     ['','','']]

def guessResult(guess:list, answerName:str):
    
    result = \
    [['gray','gray','gray'],
     ['gray','gray','gray'],
     ['gray','gray','gray']]
    
    with open("./recipes/"+answerName,"r") as f: #json 파일 열기
        json_data = json.load(f) #json 로드
        print(json_data)

        if json_data["type"] == "minecraft:crafting_shaped": #모양이 정해진
            # craft.py와 같은 방식으로 key를 key로 갖고 그 아이템들의 집합을 value로 갖는 dict를 만든다
            # key별로 몇개가 사용되는지 개수를 찾고 이를 dict로 만든다
            # 우선 초록색 아이템들을 모두 찾고, 찾을 때마다 개수 dict를 1씩 감소시킨다
            # 개수 dict에 남은 수만큼 반복하며 key에 맞는 노란색 칸을 찾는다(1이면 1번, 2면 2번)
            # 남은 개수 dict가 모두 0이고, 남은 회색 칸들이 모두 ''라면(또는 회색칸이 없다면) 모두 초록색을 반환한다

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
            
            print(ingredientList)

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

print(guessResult(guess, "fire_charge.json"))