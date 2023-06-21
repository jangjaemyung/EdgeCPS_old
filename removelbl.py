import os, glob, shutil
from pathlib import Path, PurePath

root = '/media/minsoo/T7_2TB/드론_인명구조/2023_증강/eo_seg_0621_0_1'
img_pth  = glob.glob(root+ '/images/*')

lbl_pth = root + '/labels/'

cnt = 0

for img in img_pth:
    name = os.path.splitext(os.path.basename(img))[0]
    txt_name = lbl_pth+ name + '.txt'
    if os.path.isfile(txt_name):
        cnt += 1
        shutil.copy(txt_name , root+'/match/'+ name + '.txt' )
print(cnt)