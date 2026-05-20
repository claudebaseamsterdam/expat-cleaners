"""
Build on-brand campaign creatives for ExpatCleaners (Meta Ads, May 2026).

Uses the official Brand Kit v2 assets at public/logo/ for the mark and
lockup. Renders headlines, micro-copy, and typographic CTAs using Lora
as a local stand-in for Fraunces (the sandbox can't reach Google Fonts;
the final Figma pass should swap Lora for actual Fraunces 500
font-variation-settings 'SOFT' 0 'opsz' 144).

Outputs:
  public/ad-creatives/
    moveout_1x1.png
    moveout_9x16.png
    recurring_1x1.png
    recurring_9x16.png

Run from project root:
  python3 scripts/build_ad_creatives.py
"""
from __future__ import annotations
import io
import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
import cairosvg

ROOT = Path(__file__).resolve().parent.parent
LOGO_DIR = ROOT / "public" / "logo"
OUT_DIR = ROOT / "public" / "ad-creatives"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Brand colours — pulled from the official SVGs, do not edit
CREAM = (245, 240, 230)        # #F5F0E6
INK   = (26, 24, 21)            # #1A1815
SAGE  = (92, 107, 82)           # #5C6B52
SAGE_LIGHT = (166, 176, 152)    # #A6B098 (period on cream-on-ink)

# Font paths (Lora as Fraunces substitute)
FRAUNCES_REG = "/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf"
FRAUNCES_IT  = "/usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf"
SANS_REG     = "/usr/share/fonts/truetype/lato/Lato-Regular.ttf"
SANS_MEDIUM  = "/usr/share/fonts/truetype/lato/Lato-Medium.ttf"

assert os.path.exists(FRAUNCES_REG), "Lora not found"
assert os.path.exists(FRAUNCES_IT), "Lora italic not found"


def svg_to_png(svg_path: Path, target_width: int) -> Image.Image:
    """Render an SVG to a PIL image at the given pixel width.

    Pre-processes the SVG to strip the Google-Fonts @import rule, which
    contains unescaped `&` characters that break cairosvg's XML parser.
    The text in the lockup SVGs is irrelevant for us anyway — we
    redraw the wordmark in PIL using Lora.
    """
    import re
    svg_text = svg_path.read_text()
    # Strip the entire <style>...</style> block (the only place the
    # offending @import lives) — we don't need CSS for the geometry.
    svg_text = re.sub(r"<style[^>]*>.*?</style>", "", svg_text, flags=re.DOTALL)
    # Also strip the <defs>...</defs> wrapper if it's now empty
    svg_text = re.sub(r"<defs>\s*</defs>", "", svg_text)
    png_bytes = cairosvg.svg2png(
        bytestring=svg_text.encode("utf-8"),
        output_width=target_width,
    )
    return Image.open(io.BytesIO(png_bytes)).convert("RGBA")


def font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    path = {
        "fraunces": FRAUNCES_REG,
        "fraunces-italic": FRAUNCES_IT,
        "sans": SANS_REG,
        "sans-medium": SANS_MEDIUM,
    }[weight]
    return ImageFont.truetype(path, size)


def draw_cta_with_arrow(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    color: tuple[int, int, int],
    underline_offset: int = 8,
    underline_width: int = 2,
) -> None:
    """The brand-correct CTA: italic text + drawn arrow chevron + thin
    underline. No pill button — typographic only."""
    x, y = xy
    draw.text(xy, text, font=fnt, fill=color)
    bbox = draw.textbbox(xy, text, font=fnt)
    # arrow drawn separately so it always renders (Lora lacks → glyph)
    gap = int(fnt.size * 0.32)
    arrow_x = bbox[2] + gap
    # baseline for arrow ≈ vertical-centre of lowercase x-height
    arrow_y = bbox[1] + int((bbox[3] - bbox[1]) * 0.55)
    arrow_len = int(fnt.size * 0.45)
    draw_arrow(draw, arrow_x, arrow_y, arrow_len, color, thickness=max(2, underline_width))
    # underline spans text + arrow together
    underline_y = bbox[3] + underline_offset
    draw.line(
        [(bbox[0], underline_y), (arrow_x + arrow_len, underline_y)],
        fill=color,
        width=underline_width,
    )


def text_width(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> int:
    return draw.textlength(text, font=fnt)


def draw_star(draw: ImageDraw.ImageDraw, cx: int, cy: int, r_outer: int, fill: tuple[int, int, int]) -> None:
    """Five-pointed filled star centred at (cx,cy)."""
    import math
    r_inner = r_outer * 0.4
    pts = []
    for i in range(10):
        angle = -math.pi / 2 + i * math.pi / 5
        r = r_outer if i % 2 == 0 else r_inner
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(pts, fill=fill)


def draw_arrow(draw: ImageDraw.ImageDraw, x: int, y_baseline: int, length: int, color: tuple[int, int, int], thickness: int = 2) -> int:
    """Right-pointing arrow drawn as a horizontal line + chevron. y_baseline aligned with text baseline.
    Returns the x position just after the arrow (for layout chaining)."""
    # baseline horizontal
    y = y_baseline
    draw.line([(x, y), (x + length, y)], fill=color, width=thickness)
    head = length // 3
    draw.line([(x + length - head, y - head // 2), (x + length, y)], fill=color, width=thickness)
    draw.line([(x + length - head, y + head // 2), (x + length, y)], fill=color, width=thickness)
    return x + length


def draw_trust_circle(
    canvas: Image.Image,
    x: int,
    y: int,
    diameter: int,
    stroke: tuple[int, int, int],
    text_color: tuple[int, int, int],
    text: str = "4.9",
) -> None:
    """Brand-kit highlight treatment: italic Lora inside a thin outlined
    circle, with a small filled star to its right.
    """
    draw = ImageDraw.Draw(canvas)
    radius = diameter // 2
    draw.ellipse(
        [(x - radius, y - radius), (x + radius, y + radius)],
        outline=stroke,
        width=max(2, diameter // 60),
    )
    fnt = font("fraunces-italic", int(diameter * 0.30))
    # Measure "4.9" and the star spacing so we can centre both as a group
    text_tw = text_width(draw, text, fnt)
    star_r = int(diameter * 0.075)
    gap = int(diameter * 0.06)
    total_w = text_tw + gap + star_r * 2
    start_x = x - total_w // 2
    text_y = y - fnt.size // 2 - int(diameter * 0.04)
    draw.text((start_x, text_y), text, font=fnt, fill=text_color)
    draw_star(
        draw,
        cx=start_x + text_tw + gap + star_r,
        cy=y - int(diameter * 0.02),
        r_outer=star_r,
        fill=text_color,
    )


def composite_lockup(
    canvas: Image.Image,
    mark_svg: Path,
    *,
    lockup_total_width: int,
    x: int,
    y: int,
    text_color: tuple[int, int, int],
    dot_color: tuple[int, int, int],
) -> None:
    """Compose the brand lockup: mark + 'expatcleaners.' wordmark + sage dot.

    Uses the mark-only SVG (no embedded text → no @import problem) for
    the gable, then renders the wordmark in Lora 500 to match Fraunces'
    metrics. The composition reproduces the proportions from the
    official 1600×400 lockup SVGs at the requested total width.
    """
    # Lockup proportions from the official SVG: viewBox 1600×400.
    # The mark sits in a ~220×245 region (scaled 2.2x of the 100×118
    # mark), starting at x=280. The wordmark runs from x=600 to ~x=1480.
    # So overall layout is roughly 1/4 mark, 3/4 wordmark with a small gap.
    height = int(lockup_total_width * (400 / 1600))
    mark_size = int(height * 0.78)
    gap = int(height * 0.12)

    # Render the mark from the official SVG at high resolution
    mark = svg_to_png(mark_svg, mark_size)
    # The mark SVG has a background rect; we have to strip it so the
    # canvas colour shows through.
    bg_color = canvas.getpixel((x, y))[:3] if canvas.mode == "RGBA" else canvas.getpixel((x, y))
    # Recolour: anything matching the SVG background becomes transparent
    px = mark.load()
    for yy in range(mark.height):
        for xx in range(mark.width):
            r, g, b, a = px[xx, yy]
            # Detect the background rect: matches one of our brand colours roughly
            if (abs(r - bg_color[0]) < 8 and abs(g - bg_color[1]) < 8 and abs(b - bg_color[2]) < 8):
                px[xx, yy] = (r, g, b, 0)

    mark_y_offset = (height - mark_size) // 2
    canvas.alpha_composite(mark, dest=(x, y + mark_y_offset))

    # Wordmark text — Lora 500, scaled to ~58% of lockup height
    word_size = int(height * 0.58)
    word_fnt = font("fraunces", word_size)
    word_text = "expatcleaners"
    word_x = x + mark_size + gap
    word_y = y + (height - word_size) // 2 - int(height * 0.06)
    draw = ImageDraw.Draw(canvas)
    draw.text((word_x, word_y), word_text, font=word_fnt, fill=text_color)

    # The period — same size as the wordmark but in the dot colour
    word_bbox = draw.textbbox((word_x, word_y), word_text, font=word_fnt)
    dot_text = "."
    draw.text((word_bbox[2] - int(word_size * 0.04), word_y), dot_text, font=word_fnt, fill=dot_color)


def draw_headline_block(
    canvas: Image.Image,
    lines: list[str],
    fnt: ImageFont.FreeTypeFont,
    color: tuple[int, int, int],
    x: int,
    y_top: int,
    line_height_ratio: float = 1.05,
    align: str = "left",
    canvas_width: int | None = None,
) -> int:
    """Draw a multi-line headline. Returns the y position after the last line."""
    draw = ImageDraw.Draw(canvas)
    line_height = int(fnt.size * line_height_ratio)
    y = y_top
    for line in lines:
        if align == "center" and canvas_width is not None:
            tw = text_width(draw, line, fnt)
            xx = (canvas_width - tw) // 2
        else:
            xx = x
        draw.text((xx, y), line, font=fnt, fill=color)
        y += line_height
    return y


# --------------- THE 4 CREATIVES ---------------

def build_moveout_1x1() -> Path:
    """Move-out / End-of-tenancy, 1080×1080 cream background."""
    W, H = 1080, 1080
    canvas = Image.new("RGBA", (W, H), CREAM + (255,))
    draw = ImageDraw.Draw(canvas)
    pad = 64

    # Top-left: official lockup (ink on cream)
    composite_lockup(
        canvas,
        LOGO_DIR / "05-mark-ink.svg",
        lockup_total_width=400,
        x=pad,
        y=pad - 8,
        text_color=INK,
        dot_color=SAGE,
    )

    # Top-right: trust circle (4.9 ★)
    draw_trust_circle(canvas, W - pad - 56, pad + 56, diameter=112, stroke=SAGE, text_color=SAGE)

    # Kicker
    kicker = font("sans-medium", 22)
    draw.text((pad, 240), "MOVING OUT?", font=kicker, fill=INK)

    # Headline — three lines of large Fraunces
    headline_fnt = font("fraunces", 116)
    after_y = draw_headline_block(
        canvas,
        ["Don’t give your", "landlord an", "excuse."],
        headline_fnt,
        INK,
        x=pad,
        y_top=300,
        line_height_ratio=1.00,
    )

    # Hairline divider
    draw.line([(pad, after_y + 36), (pad + 96, after_y + 36)], fill=INK, width=2)

    # Sub-copy
    sub_fnt = font("sans", 28)
    draw.text(
        (pad, after_y + 70),
        "End-of-tenancy deep clean. Deposit-back standard.",
        font=sub_fnt,
        fill=INK,
    )

    # Trust micro (single line)
    trust_fnt = font("sans", 22)
    trust = "Same-day quote   ·   Inside oven & appliances   ·   WhatsApp in 60 seconds"
    draw.text((pad, after_y + 130), trust, font=trust_fnt, fill=INK)

    # CTA — typographic, italic Fraunces with underline. Centred.
    cta_fnt = font("fraunces-italic", 38)
    cta = "Get your deposit back"
    tw = text_width(draw, cta, cta_fnt)
    draw_cta_with_arrow(
        draw,
        ((W - tw) // 2, H - 120),
        cta,
        cta_fnt,
        INK,
        underline_offset=6,
        underline_width=2,
    )

    out = OUT_DIR / "moveout_1x1.png"
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    return out


def build_moveout_9x16() -> Path:
    """Move-out, 1080×1920 Stories format."""
    W, H = 1080, 1920
    canvas = Image.new("RGBA", (W, H), CREAM + (255,))
    draw = ImageDraw.Draw(canvas)
    pad = 64

    composite_lockup(
        canvas,
        LOGO_DIR / "05-mark-ink.svg",
        lockup_total_width=420,
        x=pad,
        y=pad + 60,  # extra top margin for Stories safe zone
        text_color=INK,
        dot_color=SAGE,
    )
    draw_trust_circle(canvas, W - pad - 64, pad + 60 + 64, diameter=128, stroke=SAGE, text_color=SAGE)

    kicker = font("sans-medium", 26)
    draw.text((pad, 420), "MOVING OUT?", font=kicker, fill=INK)

    headline_fnt = font("fraunces", 118)
    after_y = draw_headline_block(
        canvas,
        ["Don’t give your", "landlord an", "excuse."],
        headline_fnt,
        INK,
        x=pad,
        y_top=520,
        line_height_ratio=1.02,
    )

    draw.line([(pad, after_y + 50), (pad + 120, after_y + 50)], fill=INK, width=2)

    sub_fnt = font("sans", 36)
    draw.text(
        (pad, after_y + 100),
        "End-of-tenancy deep clean.",
        font=sub_fnt,
        fill=INK,
    )
    draw.text((pad, after_y + 160), "Deposit-back standard.", font=sub_fnt, fill=INK)

    # Stacked trust points in Stories
    trust_fnt = font("sans", 28)
    for i, line in enumerate(
        ["Same-day quote", "Inside oven & appliances", "WhatsApp in 60 seconds"]
    ):
        draw.text((pad, after_y + 270 + i * 52), line, font=trust_fnt, fill=INK)

    # CTA in lower safe zone (~12% from bottom)
    cta_fnt = font("fraunces-italic", 48)
    cta = "Get your deposit back"
    tw = text_width(draw, cta, cta_fnt)
    draw_cta_with_arrow(
        draw,
        ((W - tw) // 2, H - 260),
        cta,
        cta_fnt,
        INK,
        underline_offset=8,
        underline_width=3,
    )

    out = OUT_DIR / "moveout_9x16.png"
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    return out


def build_recurring_1x1() -> Path:
    """Recurring weekly, 1080×1080 sage background."""
    W, H = 1080, 1080
    canvas = Image.new("RGBA", (W, H), SAGE + (255,))
    draw = ImageDraw.Draw(canvas)
    pad = 64

    composite_lockup(
        canvas,
        LOGO_DIR / "07-mark-cream-on-sage.svg",
        lockup_total_width=400,
        x=pad,
        y=pad - 8,
        text_color=CREAM,
        dot_color=CREAM,
    )
    draw_trust_circle(canvas, W - pad - 56, pad + 56, diameter=112, stroke=CREAM, text_color=CREAM)

    kicker = font("sans-medium", 22)
    draw.text((pad, 240), "WEEKLY CLEANING", font=kicker, fill=CREAM)

    # Headline — centred for the recurring concept (per brief)
    headline_fnt = font("fraunces", 116)
    after_y = draw_headline_block(
        canvas,
        ["Same cleaner.", "Every week.", "No exceptions."],
        headline_fnt,
        CREAM,
        x=pad,
        y_top=320,
        line_height_ratio=1.05,
        align="center",
        canvas_width=W,
    )

    # Italic supporting line
    italic_fnt = font("fraunces-italic", 36)
    italic_line = "— That’s the deal."
    tw = text_width(draw, italic_line, italic_fnt)
    draw.text(((W - tw) // 2, after_y + 36), italic_line, font=italic_fnt, fill=CREAM)

    # Trust micro centred
    trust_fnt = font("sans", 22)
    trust = "Weekly   ·   €36/hr   ·   Organic supplies   ·   English-first"
    tw = text_width(draw, trust, trust_fnt)
    draw.text(((W - tw) // 2, after_y + 130), trust, font=trust_fnt, fill=CREAM)

    # CTA — typographic, italic Fraunces with underline. Cream.
    cta_fnt = font("fraunces-italic", 38)
    cta = "Start weekly"
    tw = text_width(draw, cta, cta_fnt)
    draw_cta_with_arrow(
        draw,
        ((W - tw) // 2, H - 120),
        cta,
        cta_fnt,
        CREAM,
        underline_offset=6,
        underline_width=2,
    )

    out = OUT_DIR / "recurring_1x1.png"
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    return out


def build_recurring_9x16() -> Path:
    """Recurring weekly, 1080×1920 Stories sage background."""
    W, H = 1080, 1920
    canvas = Image.new("RGBA", (W, H), SAGE + (255,))
    draw = ImageDraw.Draw(canvas)
    pad = 64

    composite_lockup(
        canvas,
        LOGO_DIR / "07-mark-cream-on-sage.svg",
        lockup_total_width=420,
        x=pad,
        y=pad + 60,
        text_color=CREAM,
        dot_color=CREAM,
    )
    draw_trust_circle(canvas, W - pad - 64, pad + 60 + 64, diameter=128, stroke=CREAM, text_color=CREAM)

    kicker = font("sans-medium", 26)
    draw.text((pad, 420), "WEEKLY CLEANING", font=kicker, fill=CREAM)

    headline_fnt = font("fraunces", 138)
    after_y = draw_headline_block(
        canvas,
        ["Same cleaner.", "Every week.", "No exceptions."],
        headline_fnt,
        CREAM,
        x=pad,
        y_top=550,
        line_height_ratio=1.05,
        align="center",
        canvas_width=W,
    )

    italic_fnt = font("fraunces-italic", 44)
    italic_line = "— That’s the deal."
    tw = text_width(draw, italic_line, italic_fnt)
    draw.text(((W - tw) // 2, after_y + 50), italic_line, font=italic_fnt, fill=CREAM)

    trust_fnt = font("sans", 28)
    for i, line in enumerate(
        ["Weekly   ·   €36/hr", "Organic supplies   ·   English-first"]
    ):
        tw = text_width(draw, line, trust_fnt)
        draw.text(((W - tw) // 2, after_y + 180 + i * 52), line, font=trust_fnt, fill=CREAM)

    cta_fnt = font("fraunces-italic", 48)
    cta = "Start weekly"
    tw = text_width(draw, cta, cta_fnt)
    draw_cta_with_arrow(
        draw,
        ((W - tw) // 2, H - 260),
        cta,
        cta_fnt,
        CREAM,
        underline_offset=8,
        underline_width=3,
    )

    out = OUT_DIR / "recurring_9x16.png"
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    return out


def main() -> None:
    outs = [
        build_moveout_1x1(),
        build_moveout_9x16(),
        build_recurring_1x1(),
        build_recurring_9x16(),
    ]
    for o in outs:
        size = o.stat().st_size / 1024
        print(f"OK  {o.relative_to(ROOT)}  ({size:.0f} KB)")


if __name__ == "__main__":
    main()
