import os

filelist = os.listdir("./recipes")
print(filelist)

ctypeList = ["minecraft:crafting_shaped","minecraft:crafting_shapeless"]

for json in filelist:
    
    if "template" in json:
        os.remove("./recipes/"+json)
        continue

    willremove = False

    # with open("./recipes/"+json,"rt") as data:
    #     for line in data.readlines():
    #         if '"type":' in line:
    #             ctype = line[line.find('"type":')+9:line.find('",\n')]
    #             if ctype not in ctypeList:
    #                 willremove = True

    
    if willremove:
        os.remove("./recipes/"+json)
                    
print("DONE")



