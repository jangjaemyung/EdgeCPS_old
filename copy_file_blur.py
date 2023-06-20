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