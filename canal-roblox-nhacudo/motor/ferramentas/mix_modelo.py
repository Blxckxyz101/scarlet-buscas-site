# MODELO de mixagem (EP03). Troque: caminho do shots.json (node ferramentas/shots.js URL > shots.json), END, lista de efeitos E (tempos das palavras), música e narr.wav.
# Efeitos sonoros: /home/user/stickman/kit/sfx (repositório stickman) ou outros sem direitos.
import subprocess,json
SF='/home/user/stickman/kit/sfx/'
shots=json.load(open('/tmp/claude-0/-home-user-scarlet-buscas-site/85e5b9be-4f69-5950-8bfe-773b19825042/scratchpad/e3/shots.json'))
END=118.9
cuts=[s for _,s in shots if s>0.5]
ev=[('whoosh',c-.1,-24,None) for c in cuts]
E=[('bell',0.05,-12,None),('wind',0.0,-20,3.0),
('ping',8.22,-9,None),('ping',8.72,-7,None),('ping',9.22,-5,None),
('bell',10.3,-10,None),('whoosh',12.1,-12,None),('pop',15.2,-12,None),
('thud',18.45,-4,None),('impact',18.45,-10,None),
('pop',21.2,-14,None),('pop',22.4,-14,None),('pop',23.8,-14,None),('pop',25.4,-13,None),
('creak',27.4,-14,None),('sting',30.0,-12,None),('buzz',31.2,-18,1.2),
('chime',38.72,-4,None),('sting',39.4,-14,None),('murmur',40.0,-18,2.4),
('step',42.9,-18,None),('step',43.3,-18,None),('step',43.7,-18,None),('murmur',45.0,-14,1.4),
('thud',48.52,-3,None),('impact',48.52,-9,None),('crowd',49.6,-14,None),
('tick',51.7,-12,None),('tick',52.2,-12,None),('tick',52.7,-12,None),
('step',55.6,-19,None),('step',56.0,-19,None),('step',56.4,-19,None),('step',56.8,-19,None),('step',57.2,-19,None),
('buzz',59.2,-18,3.0),('coin',61.1,-10,None),('creak',63.1,-14,None),
('sting',69.6,-10,None),('heart',70.3,-8,None),('powerdown',70.95,-6,None),
('paper',75.3,-10,None),('paper',77.5,-12,None),('tick',79.0,-12,None),('tick',79.5,-12,None),
('bell',80.8,-8,None),('bell',82.1,-10,None),('whoosh',85.5,-12,None),('whoosh',87.3,-13,None),('whoosh',88.2,-13,None),
('thud',89.55,-9,None),('whoosh',91.3,-12,None),('sting',92.8,-14,None),('chime',95.0,-16,None),
('riser',98.2,-10,None)]
E+=[('tick',98.8+i*.18,-15,None) for i in range(10)]
E+=[('beep',100.6,-8,None),('beep',101.6,-7,None),('beep',102.0,-6,None),
('rumble',103.1,-7,None),('crowd',104.3,-8,None),('thud',105.5,-5,None),('pop',107.5,-14,None),
('chime',108.6,-8,None),('bell',110.0,-10,None),('ping',111.35,-10,None),
('paper',112.3,-8,None),('sting',113.4,-14,None),('riser',116.6,-9,None)]
E+=[('tick',116.9+i*.1,-14,None) for i in range(9)]
E+=[('boom',117.85,-6,None),('impact',117.85,-8,None),('sting',117.86,-6,None)]
ev+=E
ins=['-i','narr.wav','-i','music_cut.wav'];fl=[];lab=[]
for i,(n,t,db,tr) in enumerate(ev):
    ins+=['-i',SF+n+'.wav'];j=i+2
    f=f"[{j}]aformat=channel_layouts=mono,"+(f"atrim=0:{tr},afade=t=out:st={max(0,tr-.4)}:d=0.4," if tr else "")+f"volume={db}dB,adelay={int(t*1000)}:all=1,pan=stereo|c0=c0|c1=c0[s{i}]"
    fl.append(f);lab.append(f"[s{i}]")
dip="volume='if(between(t,117.7,118.9),0.35,1)':eval=frame"
fl.append("[0]aformat=channel_layouts=mono,volume=1.25,pan=stereo|c0=c0|c1=c0,asplit=2[vo][vsc]")
fl.append(f"[1]aformat=channel_layouts=stereo,volume=0.23,{dip},afade=t=in:d=0.4,afade=t=out:st={END-1.4}:d=1.4[mu]")
fl.append("[mu][vsc]sidechaincompress=threshold=0.04:ratio=5:attack=15:release=250[mud]")
fl.append(''.join(lab)+f"amix=inputs={len(lab)}:normalize=0[sf]")
fl.append(f"[vo][mud][sf]amix=inputs=3:normalize=0,apad,atrim=0:{END},alimiter=limit=0.95,loudnorm=I=-14:TP=-2:LRA=9[out]")
subprocess.run(['ffmpeg','-y','-v','error']+ins+['-filter_complex',';'.join(fl),'-map','[out]','-ar','48000','-ac','2','mix_ep3.wav'],check=True);print(len(ev),'events')
