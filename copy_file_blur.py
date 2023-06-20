import glob
import os
import shutil

file_dir = glob.glob('/Volumes/One/2023_Drone/etri-sar/real/images/cloudy/*')



dic_img = {}
for img in file_dir:
    name = os.path.basename(os.path.splitext(img)[0])
    if name.startswith('.'):
        pass

    dic_img[name] = img


new_file_dir = glob.glob('/Volumes/One/blur_img/cloudy/*')

t_cnt = 0
blur_dic_img = {}
for img in new_file_dir:
    name = os.path.basename(os.path.splitext(img)[0])
    if name.startswith('.'):
        pass
    if '_blur' in os.path.basename(img):
        name.replace('_blur','')

    blur_dic_img[name] = img

lost_li = []
for k,v in dic_img.items():
    try:
        test_img = blur_dic_img[k]
    except KeyError:


        value = blur_dic_img.get(k + '_blur' )
        if value == None:
            shutil.copy(v, '/Volumes/One/temp/' +os.path.basename(v))
            lost_li.append(v)
            continue
        else:
            season = os.path.dirname(v).split('/')[-1]
            blur = '_blur'
            org_name = os.path.splitext(os.path.basename(v))[0]
            name = org_name + blur
            ext = os.path.splitext(img)[-1]
            # shutil.copy(value,'/Volumes/One/blur_img/'+ season + '/' +name+ext)
            t_cnt += 1
            print(t_cnt)
print(len(lost_li))
print(lost_li)



# import glob
# import os
# import shutil
#
# import cv2
#
# file_dir = glob.glob('/Volumes/One/2023_Drone/etri-sar/real/images/*/*')
#
# txt_li = '/Users/jangminsu/Downloads/classes'
#
# dic_img = {}
# for img in file_dir:
#     name = os.path.basename(os.path.splitext(img)[0])
#     if name.startswith('.'):
#         pass
#     dic_img[name] = img
#
# li = []
#
# kernel_size = (15, 15)
# cnt = 0
# # 폴더 내의 모든 텍스트 파일을 순회하면서 처리
# for filename in os.listdir(txt_li):
#     if filename.endswith('.txt'):
#         if 'classes' in filename:
#             continue
#         label_path = os.path.join(txt_li, filename)
#
#         name = os.path.basename(os.path.splitext(label_path)[0])
#         try:
#             image_path = dic_img[name]
#         except:
#             li.append(name)
#             continue
#
#         ext = os.path.splitext(image_path)[-1]
#
#         output_path = '/Volumes/One/blur_img/'+ os.path.dirname(image_path).split('/')[-1]+'/'+ os.path.basename(image_path)
#         if os.path.isfile(output_path):
#             print(output_path)
#             continue
#
#         # 이미지 로드
#         image = cv2.imread(image_path)
#
#         # 텍스트 파일 읽기
#         with open(label_path, 'r') as file:
#             lines = file.readlines()
#
#         # 텍스트 파일의 각 줄을 순회하면서 박스 영역 추출 및 블러 처리
#         for line in lines:
#             # 예시로 x, y, w, h 형식의 좌표를 사용하였습니다. 실제로는 라벨 형식에 맞게 수정해야 합니다.
#             class_id, x, y, w, h = [float(coord) for coord in line.split()]
#             # 좌표 변환 (Yolov5 형식 -> OpenCV 형식)
#             x = int((x - w / 2) * image.shape[1])
#             y = int((y - h / 2) * image.shape[0])
#             w = int(w * image.shape[1])
#             h = int(h * image.shape[0])
#
#             roi = image[y:y+h, x:x+w]  # 박스 영역 추출
#             blurred_roi = cv2.blur(roi, kernel_size)  # 블러 처리
#
#             # 블러 처리한 영역을 원본 이미지에 적용
#             image[y:y+h, x:x+w] = blurred_roi
#
#         # 결과 이미지 저장
#         cv2.imwrite(output_path, image)
#         cnt +=1
#         print(cnt)
#
#
# print('done')
# print(li)