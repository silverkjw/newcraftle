# 실제 minecraftle에서 추측을 하는 코드
# guess와 실제 조합법 json을 비교해 초록색, 노란색, 회색인지를 결정한다.

guess = \
    [['','','cobblestone'],\
     ['','cobblestone','cobblestone'],\
     ['cobblestone','cobblestone','cobblestone']]

def guessResult(guess:list, answerName:str):
    
    result = \
    [['gray','gray','gray'],
     ['gray','gray','gray'],
     ['gray','gray','gray']]
    
    return result

print(guessResult(guess, "abc"))