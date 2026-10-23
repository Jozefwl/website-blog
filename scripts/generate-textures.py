"""
Generate the small tileable textures used by the 3D rack (public/textures/).

Own work, released as CC0. Re-run after changing parameters:
    python scripts/generate-textures.py
Needs: numpy, Pillow (with WebP support).

All textures are greyscale. CSS tints them with a colour underneath
(background-blend-mode), so one file serves several materials.
"""
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "textures"
SIZE = 256
rng = np.random.default_rng(42)  # fixed seed -> same files every run


def tileable_blur(noise, sigma_x, sigma_y):
    """Gaussian blur in frequency space: wraps around, so the result tiles seamlessly."""
    fy = np.fft.fftfreq(noise.shape[0])[:, None]
    fx = np.fft.fftfreq(noise.shape[1])[None, :]
    kernel = np.exp(-2 * (np.pi**2) * ((fx * sigma_x) ** 2 + (fy * sigma_y) ** 2))
    return np.real(np.fft.ifft2(np.fft.fft2(noise) * kernel))


def normalize(a, lo, hi):
    a = (a - a.min()) / (a.max() - a.min())
    return lo + a * (hi - lo)


def save(name, arr):
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), mode="L")
    path = OUT / name
    img.save(path, "WEBP", quality=70, method=6)
    print(f"{path.relative_to(OUT.parent.parent)}  {path.stat().st_size} bytes")


# 1) Powder coat: fine orange-peel grain (cabinet frame, doors, side panels).
fine = tileable_blur(rng.standard_normal((SIZE, SIZE)), 0.8, 0.8)
peel = tileable_blur(rng.standard_normal((SIZE, SIZE)), 4, 4)
save("powder-coat.webp", normalize(fine * 0.6 + peel * 0.4, 96, 160))

# 2) Brushed metal: long horizontal streaks (server faceplates, rack ears).
streaks = tileable_blur(rng.standard_normal((SIZE, SIZE)), 60, 0.6)
grain = tileable_blur(rng.standard_normal((SIZE, SIZE)), 1, 1)
save("brushed-metal.webp", normalize(streaks * 0.8 + grain * 0.2, 90, 170))
