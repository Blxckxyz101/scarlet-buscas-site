import sys,certifi,asyncio
certifi.where=lambda:"/root/.ccr/ca-bundle.crt"
import edge_tts
async def main(text,voice,rate,out):
    c=edge_tts.Communicate(text,voice,rate=rate,boundary="WordBoundary")
    import json;words=[]
    with open(out,"wb") as f:
        async for ch in c.stream():
            if ch["type"]=="audio":f.write(ch["data"])
            elif ch["type"]=="WordBoundary":words.append({"w":ch["text"],"t":ch["offset"]/1e7,"d":ch["duration"]/1e7})
    json.dump(words,open(out+".json","w"),ensure_ascii=False)
asyncio.run(main(*sys.argv[1:5]))
