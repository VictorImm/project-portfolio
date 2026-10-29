#!/usr/bin/env python3
"""
scripts/fetch_cinema_media.py
Downloads and curates 9 selected visual works from Instagram @v_1ct0r:
- 3 Cinematic Reels: V1 (DdRITGPBpq0), V2 (DaF0gMjPHu1), V3 (DNazjVRBb_U)
- 6 Photography & Stills: P1 (Da5qlFSBU_s), P2 (DYIIB74AY7L), P3 (DDiAI7vTb-4), P4 (C4bJ502vuMJ),
                         V4 (DH2_0D5JrDo), V6 (DBgcGfyPxOd)
(V5 DCXFEl5BOmO is excluded)
"""

import os
import sys
import json
import urllib.request
import instaloader

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(WORKSPACE_DIR, "assets")
REELS_DIR = os.path.join(ASSETS_DIR, "cinema", "reels")
STILLS_DIR = os.path.join(ASSETS_DIR, "cinema", "stills")
DATA_DIR = os.path.join(ASSETS_DIR, "data")
MANIFEST_PATH = os.path.join(DATA_DIR, "cinema-manifest.json")

os.makedirs(REELS_DIR, exist_ok=True)
os.makedirs(STILLS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# Curated configurations with editorial specs
REELS_CONFIG = {
    "DdRITGPBpq0": {
        "id": "reel-01",
        "shortcode": "DdRITGPBpq0",
        "title": "A Place Called Home",
        "category": "reels",
        "series": "Cinematic Motion",
        "location": "Kediri",
        "date": "2026-09-12",
        "camera": "Sony Cyber-shot DSC-W310",
        "lensSpecs": "Sony Lens 4x Optical · Natural Light · Digicam Texture",
        "duration": "0:23",
        "aspectRatio": "9:16",
        "credits": "Shot on Sony DSC-W310 in Kediri",
        "quote": "Some places don't need to be remembered. They simply remain, waiting for you to come home.",
        "fullCaption": "A Place Called Home\n\nSome places don't need to be remembered\nThey simply remain, waiting for you to come home.\n\nA quiet corner of home —\nwhere the air feels softer,\nthe trees grow freely,\nand time somehow moves a little slower.\n\nKediri — September 12, 2026.\n\nShot on an old digicam — some places simply don't need 4K."
    },
    "DaF0gMjPHu1": {
        "id": "reel-02",
        "shortcode": "DaF0gMjPHu1",
        "title": "The Art of Noticing",
        "category": "reels",
        "series": "Cinematic Motion",
        "location": "Port of Tanjung Perak, Surabaya",
        "date": "2026-06-27",
        "camera": "Sony Cyber-shot DSC-W310",
        "lensSpecs": "Sony Lens 4x Optical · Maritime Light · Industrial Pacing",
        "duration": "0:18",
        "aspectRatio": "9:16",
        "credits": "Oriental Galaxy Vessel, Port of Tanjung Perak",
        "quote": "Some places don't need to be extraordinary. They just need someone willing to notice.",
        "fullCaption": "The Art of Noticing\n\nSome places don't need to be extraordinary\nThey just need someone willing to notice.\n\nPort of Tanjung Perak — Oriental Galaxy Vessel\nJune 27, 2026.\n\nShot on an old digicam — some memories simply don't belong in 4K."
    },
    "DNazjVRBb_U": {
        "id": "reel-03",
        "shortcode": "DNazjVRBb_U",
        "title": "☕ Seduh",
        "category": "reels",
        "series": "Cinematic Motion",
        "location": "Surabaya",
        "date": "2025-08-16",
        "camera": "Cinema Rig",
        "lensSpecs": "35mm Prime · Steam & Ambient Tungsten · Coffee Narrative",
        "duration": "0:30",
        "aspectRatio": "9:16",
        "credits": "Videographer: @victr.is · Gaffer: @cmul.fp · Talent: @pasanko.si",
        "quote": "Some stories don't need words. They unfold slowly, one frame at a time. Water meets coffee. Steam rises. Time passes.",
        "fullCaption": "☕ Seduh\n\nSome stories don't need words.\nThey unfold slowly, one frame at a time.\n\nWater meets coffee.\nSteam rises.\nTime passes.\n\nA simple ritual, quietly turned into a story.\n\nTalent: @pasanko.si\nVideographer: @victr.is\nGaffer: @cmul.fp"
    }
}

STILLS_CONFIG = {
    "Da5qlFSBU_s": {
        "id": "still-01",
        "shortcode": "Da5qlFSBU_s",
        "title": "Quietly There",
        "category": "stills",
        "series": "Photography & Architecture",
        "location": "Surabaya",
        "date": "2026-07-17",
        "camera": "Prime Lens / 4:5 Framing",
        "lensSpecs": "Available Afternoon Light · Balanced Shadow",
        "aspectRatio": "4:5",
        "quote": "Sometimes peace isn't found. It's simply noticed. A building behind the trees, a quiet afternoon.",
        "fullCaption": "Quietly There\n\nSometimes peace isn't found. It's simply noticed.\n\nA building behind the trees,\na quiet afternoon,\nand nothing particularly extraordinary.\n\nMaybe that's the point.\n\nNot every peaceful moment announces itself. Sometimes, you simply have to notice that it was already there."
    },
    "DYIIB74AY7L": {
        "id": "still-02",
        "shortcode": "DYIIB74AY7L",
        "title": "Momentary",
        "category": "stills",
        "series": "Photography & Solitude",
        "location": "Surabaya",
        "date": "2026-05-09",
        "camera": "Sony Cyber-shot DSC-W310",
        "lensSpecs": "Focal Ambient · Soft Leaf Shadows",
        "aspectRatio": "4:5",
        "quote": "Some moments are not meant to be captured perfectly. Only quietly witnessed. For a second, the world felt still.",
        "fullCaption": "Momentary\n\nSome moments are not meant to be captured perfectly.\nOnly quietly witnessed.\n\nA sleeping cat, seen through the leaves — unaware of the camera, unaware of the moment.\n\nFor a second, the world felt still."
    },
    "DDiAI7vTb-4": {
        "id": "still-03",
        "shortcode": "DDiAI7vTb-4",
        "title": "Lustrous Flower",
        "category": "stills",
        "series": "Photography & Light Studies",
        "location": "Surabaya",
        "date": "2024-12-13",
        "camera": "Sony Cyber-shot DSC-W310",
        "lensSpecs": "Darkroom Rim Lighting · Organic Contrast",
        "aspectRatio": "4:5",
        "quote": "A little light can change the way something ordinary is seen. Somewhere between what is there and what the light reveals.",
        "fullCaption": "Lustrous Flower\n\nA little light can change the way something ordinary is seen.\n\nA flower in the dark, lit from behind — somewhere between what is there and what the light reveals.\n\nAnother experiment in light, form, and contrast."
    },
    "C4bJ502vuMJ": {
        "id": "still-04",
        "shortcode": "C4bJ502vuMJ",
        "title": "Steel Against the Sky",
        "category": "stills",
        "series": "Photography & Architecture",
        "location": "Surabaya",
        "date": "2024-03-12",
        "camera": "Architectural Silhouette",
        "lensSpecs": "Dusk Backlight · Minimal Structural Horizon",
        "aspectRatio": "4:5",
        "quote": "Some things become beautiful when you stop trying to look past them. Quietly standing above the rooftops.",
        "fullCaption": "Steel Against the Sky\n\nSome things become beautiful when you stop trying to look past them.\n\nQuietly standing above the rooftops — ordinary, familiar, yet somehow worth remembering."
    },
    "DH2_0D5JrDo": {
        "id": "still-05",
        "shortcode": "DH2_0D5JrDo",
        "title": "Misaligned",
        "category": "stills",
        "series": "Visual Studies & Imperfection",
        "location": "Studio Experiment",
        "date": "2025-03-31",
        "camera": "Sony Cyber-shot DSC-W310",
        "lensSpecs": "Mirror Cube Shadows · Controlled Imperfection",
        "aspectRatio": "9:16",
        "hasMotionLoop": True,
        "quote": "Not everything has to line up to feel intentional. An exercise in composition, balance, and controlled imperfection.",
        "fullCaption": "Misaligned\n\nNot everything has to line up to feel intentional.\n\nA mirror cube placed slightly off — shadows missing their mark, lines meeting where they shouldn't.\n\nAn exercise in composition, balance, and controlled imperfection.\n\nSometimes, misalignment is the composition."
    },
    "DBgcGfyPxOd": {
        "id": "still-06",
        "shortcode": "DBgcGfyPxOd",
        "title": "Sunlit Stillness",
        "category": "stills",
        "series": "Visual Studies & Solitude",
        "location": "Surabaya",
        "date": "2024-10-24",
        "camera": "Sony Cyber-shot DSC-W310",
        "lensSpecs": "Warm Afternoon Sun · Grass Texture",
        "aspectRatio": "9:16",
        "hasMotionLoop": True,
        "quote": "Some moments ask for nothing. No destination, no urgency — just a patch of grass, a little warmth, and the sun on your face.",
        "fullCaption": "Sunlit Stillness\n\nSome moments ask for nothing.\nNo destination, no urgency — just a patch of grass, a little warmth, and the sun on your face.\n\nPerhaps that's all a quiet afternoon needs."
    }
}

headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def download_file(url, target_path):
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        print(f"  [EXISTS] {os.path.basename(target_path)} ({os.path.getsize(target_path)} bytes)")
        return True
    print(f"  [DOWNLOADING] {os.path.basename(target_path)}...")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp, open(target_path, "wb") as f:
        f.write(resp.read())
    print(f"  [DONE] {os.path.basename(target_path)} ({os.path.getsize(target_path)} bytes)")
    return True

def main():
    print("=== Fetching Instagram media for @v_1ct0r ===")
    L = instaloader.Instaloader()
    profile = instaloader.Profile.from_username(L.context, "v_1ct0r")
    
    posts_by_shortcode = {}
    for p in profile.get_posts():
        posts_by_shortcode[p.shortcode] = p

    manifest = {
        "profile": {
            "username": "v_1ct0r",
            "name": "Victor Immanuel Sunarko",
            "bio": "📷 Visual Storytelling · Finding stories in ordinary moments",
            "filmGear": "Sony Cyber-shot DSC-W310 & 35mm Prime Optics"
        },
        "reels": [],
        "stills": []
    }

    # 1. Process 3 Reels
    print("\n--- Processing 3 Cinematic Reels ---")
    for code, meta in REELS_CONFIG.items():
        p = posts_by_shortcode.get(code)
        if not p:
            print(f"Warning: Post {code} not found on profile!")
            continue
        
        video_filename = f"{code}.mp4"
        poster_filename = f"{code}.jpg"
        video_path = os.path.join(REELS_DIR, video_filename)
        poster_path = os.path.join(REELS_DIR, poster_filename)

        # Download Video
        if p.video_url:
            download_file(p.video_url, video_path)
        # Download Poster
        if p.url:
            download_file(p.url, poster_path)

        meta_entry = dict(meta)
        meta_entry["videoSrc"] = f"assets/cinema/reels/{video_filename}"
        meta_entry["posterSrc"] = f"assets/cinema/reels/{poster_filename}"
        manifest["reels"].append(meta_entry)

    # 2. Process 6 Stills
    print("\n--- Processing 6 Photography & Stills ---")
    for code, meta in STILLS_CONFIG.items():
        p = posts_by_shortcode.get(code)
        if not p:
            print(f"Warning: Post {code} not found on profile!")
            continue

        still_filename = f"{code}.jpg"
        still_path = os.path.join(STILLS_DIR, still_filename)

        # Download Image
        if p.url:
            download_file(p.url, still_path)

        meta_entry = dict(meta)
        meta_entry["imgSrc"] = f"assets/cinema/stills/{still_filename}"

        # If motion still (V4 or V6), also download motion loop MP4
        if meta.get("hasMotionLoop") and p.video_url:
            motion_filename = f"{code}_motion.mp4"
            motion_path = os.path.join(STILLS_DIR, motion_filename)
            download_file(p.video_url, motion_path)
            meta_entry["motionSrc"] = f"assets/cinema/stills/{motion_filename}"

        manifest["stills"].append(meta_entry)

    # Save manifest.json
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"\n[SUCCESS] Manifest saved to {MANIFEST_PATH}")
    print(f"Reels: {len(manifest['reels'])} items")
    print(f"Stills: {len(manifest['stills'])} items")

if __name__ == "__main__":
    main()
