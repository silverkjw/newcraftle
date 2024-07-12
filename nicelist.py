while True:
    st = input("리스트로 변환할 문자열 : ")
    st = " " + st + " "
    #oak_slab, spruce_slab, birch_slab, jungle_slab, acacia_slab, dark_oak_slab, crimson_slab, warped_slab, mangrove_slab, bamboo_slab, cherry_slab
    st = st.replace(" ", "'")
    st = st.replace(",", "', ")
    st = "[" + st + "]"
    print(st)