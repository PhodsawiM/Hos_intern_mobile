import asyncio
import edge_tts

TEXT = "ท่านเคยป่วยเป็นวัณโรคปอด หรือประวัติเสพสิ่งเสพติด หรือเป็นผู้ต้องขัง หรือไม่"
VOICE = "th-TH-PremwadeeNeural"  # เสียงผู้หญิง
# VOICE = "th-TH-NiwatNeural"   # เสียงผู้ชาย
OUTPUT_FILE = "เคยไหมต้องขังไหม.mp3"

async def main():
    communicate = edge_tts.Communicate(
        text=TEXT,
        voice=VOICE,
        rate="+10%",      # ความเร็วพูด (-50% ถึง +50%)
        volume="+10%"     # ความดัง (-50% ถึง +50%)
    )
    await communicate.save(OUTPUT_FILE)

if __name__ == "__main__":
    asyncio.run(main())
