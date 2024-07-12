import os

file_path = "./public/itemimage_h-z"
file_names = os.listdir(file_path)

for name in file_names:
    if name.startswith("block_of_"):
        src = os.path.join(file_path, name)
        dst = name[9:].replace(".png","")+"_block.png"

        dst = os.path.join(file_path, dst)

        os.rename(src, dst)