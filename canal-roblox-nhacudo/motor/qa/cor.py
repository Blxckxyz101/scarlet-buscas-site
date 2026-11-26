# medição própria de tom/cor (L* médio, p5, p95, croma médio, % quase preto) de vídeos
import subprocess,sys,numpy as np
def lab(rgb):
    c=rgb.astype(np.float64)/255;c=np.where(c<=.04045,c/12.92,((c+.055)/1.055)**2.4)
    M=np.array([[.4124,.3576,.1805],[.2126,.7152,.0722],[.0193,.1192,.9505]]);xyz=c@M.T/np.array([.95047,1,1.08883])
    f=np.where(xyz>.008856,np.cbrt(xyz),7.787*xyz+16/116);L=116*f[...,1]-16;return L,np.hypot(500*(f[...,0]-f[...,1]),200*(f[...,1]-f[...,2]))
for p in sys.argv[1:]:
    raw=subprocess.run(['ffmpeg','-v','error','-i',p,'-vf','select=not(mod(n\\,30)),scale=270:480','-fps_mode','passthrough','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    a=np.frombuffer(raw,np.uint8);n=a.size//(270*480*3);L,C=lab(a[:n*270*480*3].reshape(n,480,270,3))
    print(f"{p.split('/')[-1][:30]:30s} L {L.mean():5.1f} p5 {np.percentile(L,5):5.1f} p95 {np.percentile(L,95):5.1f} croma {C.mean():5.1f} preto {(L<15).mean():5.1%}")
print("alvo dos virais:              L 47-52 p5 12-20 p95 82-86 croma 26-32 preto 4-10%")
