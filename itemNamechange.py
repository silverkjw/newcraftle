import os
from PIL import Image

# 폴더 경로 설정
folder_path = './public/itemimage_h-z'

# 합성할 벌집 이미지 경로 설정
honeycomb_image_path = './honeycomb.png'

# 저장할 폴더 경로 설정
output_folder = './waxed'

# 폴더가 없다면 생성
os.makedirs(output_folder, exist_ok=True)

# 폴더 내 파일들 검색
for filename in os.listdir(folder_path):
    if filename.endswith('.png') and 'copper' in filename:
        # 원본 이미지 열기
        original_image_path = os.path.join(folder_path, filename)
        original_image = Image.open(original_image_path).convert("RGBA")
        original_width, original_height = original_image.size

        # 벌집 이미지 열기
        honeycomb_image = Image.open(honeycomb_image_path).convert("RGBA")
        
        # 벌집 이미지 크기 조정 (원본 이미지의 1/4 크기로 축소)
        honeycomb_width = original_width // 2
        honeycomb_height = original_height // 2
        honeycomb_image = honeycomb_image.resize((honeycomb_width, honeycomb_height), Image.ANTIALIAS)

        # 벌집 이미지를 원본 이미지 중앙에 위치시키기
        position = ((original_width - honeycomb_width) // 2, (original_height - honeycomb_height) // 2)

        # 새로운 빈 RGBA 이미지 생성
        combined_image = Image.new('RGBA', (original_width, original_height), (0, 0, 0, 0))

        # 원본 이미지를 새로운 이미지에 복사
        combined_image.paste(original_image, (0, 0))

        # 벌집 이미지를 새로운 이미지에 합성
        combined_image.paste(honeycomb_image, position, honeycomb_image)

        # 새로운 파일 이름 설정
        new_filename = f"waxed_{filename}"
        output_path = os.path.join(output_folder, new_filename)

        # 합성된 이미지 저장
        combined_image.save(output_path)

        # 이미지 객체 닫기
        original_image.close()
        honeycomb_image.close()

print("작업 완료")