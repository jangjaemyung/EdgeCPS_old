import glob
import os
import shutil

file_dir = glob.glob('/*')


blur_path  = glob.glob('/*') # 경로만 복사

def check_file(old_dir, name, season,org_name,ext):
    file_name = os.path.join(old_dir, name)
    new_file_name  = '비식별 경로/'+season+org_name+ext
    if os.path.isfile(file_name):
        shutil.copy(file_name, new_file_name)


for img in file_dir:
    blur = '_blur'
    org_name = os.path.basename(img)
    name = os.path.basename(img)+blur
    ext = os.path.splitext(name)[-1]
    season = os.path.dirname(img).split('/')[-1]

    for bl_pth in blur_path:
        check_file(bl_pth, name, season,org_name,ext)