#!/usr/bin/env python3
"""Convert large PNG files in /public to WebP for performance using Pillow."""
import os
from pathlib import Path
from PIL import Image

PUBLIC_DIR = Path(__file__).parent.parent / "public"
SIZE_THRESHOLD_KB = 200

def convert_to_webp(png_path: Path) -> None:
    webp_path = png_path.with_suffix(".webp")
    if webp_path.exists():
        print(f"  Skipping (already exists): {webp_path.name}")
        return
    try:
        with Image.open(png_path) as im:
            im.save(webp_path, "webp", quality=85)
        size_before = png_path.stat().st_size // 1024
        size_after = webp_path.stat().st_size // 1024
        print(f"  ✓ {png_path.name} → {webp_path.name} ({size_before}KB → {size_after}KB)")
    except Exception as e:
        print(f"  ✗ Failed: {png_path.name} — {e}")

def main():
    print(f"Scanning {PUBLIC_DIR} for PNG files > {SIZE_THRESHOLD_KB}KB...\n")
    png_files = [
        p for p in PUBLIC_DIR.rglob("*.png")
        if p.stat().st_size > SIZE_THRESHOLD_KB * 1024
    ]
    if not png_files:
        print("No large PNG files found.")
        return
    print(f"Found {len(png_files)} files to convert:\n")
    for png in sorted(png_files):
        convert_to_webp(png)
    print("\nDone. Update your code references from .png to .webp.")

if __name__ == "__main__":
    main()
