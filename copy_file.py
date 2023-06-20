import glob
import os
import shutil

file_dir = glob.glob('/Volumes/One/2023_Drone/etri-sar/real/images/*/*')


blur_path = glob.glob('/Volumes/One/2023_비식별/v1/blur_image/주간/*') # 경로만 복사
blur_path += glob.glob('/Volumes/One/2023_비식별/v2/blur_images/주간/*') # 경로만 복사

total_cnt = 0

def check_file(old_dir, name, season,org_name,ext,org_img_pth):
    file_name = os.path.join(old_dir, name)+ext
    new_file_name  = '/Volumes/One/blur_img/'+season+'/'+org_name+ext
    if os.path.isfile(file_name):

        shutil.copy(file_name, new_file_name)
        return 1
    else:
        return 0


for img in file_dir:
    blur = '_blur'
    org_name = os.path.splitext(os.path.basename(img))[0]
    name = org_name+blur
    ext = os.path.splitext(img)[-1]
    season = os.path.dirname(img).split('/')[-1]

    for bl_pth in blur_path:
        cnt = check_file(bl_pth, name, season,org_name,ext,img)

        total_cnt += cnt

        if not cnt == 0:
            print(total_cnt)

print('done')