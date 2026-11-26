import sys
from PIL import Image
out=sys.argv[1];fs=sys.argv[2:];n=len(fs);cols=min(5,n);rows=(n+cols-1)//cols;w,h=288,512
M=Image.new('RGB',(cols*w,rows*h))
for i,f in enumerate(fs):M.paste(Image.open(f).resize((w,h)),((i%cols)*w,(i//cols)*h))
M.save(out,quality=85)
