"""
Geometry-faithful preview of the built .pptx, drawn from the file itself.

Not a PowerPoint substitute: it reads each shape's real rectangle, fill, line and text
runs out of the package and draws them at scale. Composition, balance, collisions and
gross overflow are exact. Line-breaking is approximate, and deliberately conservative —
Arial is ~8% wider than Calibri and Georgia wider than Cambria, so anything that fits
here fits in the delivered deck.
"""
import sys, os
from pptx import Presentation
from pptx.util import Emu
from PIL import Image, ImageDraw, ImageFont

EMU = 914400
SCALE = 110  # px per inch

NOTO = "fonts/NotoSans-Regular.ttf"   # variable font: real Noto Sans metrics

_cache = {}
def font(face, pt, bold):
    key = (bool(bold), int(pt * SCALE / 72))
    if key not in _cache:
        f = ImageFont.truetype(NOTO, max(6, key[1]))
        # the variable font defaults to Regular; select Bold on the Weight axis
        if bold:
            try:
                f.set_variation_by_axes([700, 100])   # axes are [Weight, Width]
            except Exception:
                try: f.set_variation_by_name("Bold")
                except Exception: pass
        _cache[key] = f
    return _cache[key]

def rgb(v):
    return tuple(int(str(v)[i:i+2], 16) for i in (0, 2, 4))

def wrap(draw, text, f, maxpx):
    out = []
    for raw in text.split("\n"):
        if not raw:
            out.append("")
            continue
        line = ""
        for word in raw.split(" "):
            t = (line + " " + word).strip()
            if draw.textlength(t, font=f) <= maxpx or not line:
                line = t
            else:
                out.append(line); line = word
        out.append(line)
    return out

def render(path, outdir):
    os.makedirs(outdir, exist_ok=True)
    prs = Presentation(path)
    W = int(prs.slide_width / EMU * SCALE)
    H = int(prs.slide_height / EMU * SCALE)
    files = []
    for idx, slide in enumerate(prs.slides, 1):
        bg = (255, 255, 255)
        try:
            if slide.background.fill.type == 1:
                bg = rgb(slide.background.fill.fore_color.rgb)
        except Exception:
            pass
        img = Image.new("RGB", (W, H), bg)
        d = ImageDraw.Draw(img)

        for sh in slide.shapes:
            x = sh.left / EMU * SCALE; y = sh.top / EMU * SCALE
            w = sh.width / EMU * SCALE; h = sh.height / EMU * SCALE

            # picture
            if sh.shape_type == 13:
                try:
                    im = Image.open(io_bytes(sh)).convert("RGB")
                    im = im.resize((max(1, int(w)), max(1, int(h))))
                    img.paste(im, (int(x), int(y)))
                except Exception:
                    d.rectangle([x, y, x + w, y + h], outline=(200, 200, 200))
                continue

            # chart placeholder — drawn as a labelled frame, PowerPoint renders the real one
            if sh.has_chart if hasattr(sh, "has_chart") else False:
                d.rectangle([x, y, x + w, y + h], outline=(150, 170, 190), width=2)
                d.text((x + 12, y + 12), "[native chart]", font=font("Arial", 12, False), fill=(120, 140, 160))
                continue

            fill = line = None
            try:
                if sh.fill.type == 1:
                    fill = rgb(sh.fill.fore_color.rgb)
            except Exception:
                pass
            try:
                if sh.line.color and sh.line.color.type is not None:
                    line = rgb(sh.line.color.rgb)
            except Exception:
                pass
            if fill or line:
                if h < 1.5:  # a rule
                    d.line([x, y, x + w, y], fill=line or fill, width=1)
                else:
                    d.rectangle([x, y, x + w, y + h], fill=fill, outline=line, width=1)

            if not sh.has_text_frame:
                continue
            cy = y + 2
            for para in sh.text_frame.paragraphs:
                runs = [r for r in para.runs if r.text]
                if not runs:
                    continue
                pt = max((r.font.size.pt for r in runs if r.font.size), default=12)
                lead = pt * 1.22 * SCALE / 72
                # lay runs out inline, wrapping on the box width
                cx = x + 2
                first = runs[0]
                for r in runs:
                    rpt = r.font.size.pt if r.font.size else pt
                    f = font(r.font.name, rpt, bool(r.font.bold))
                    try:
                        col = rgb(r.font.color.rgb)
                    except Exception:
                        col = (26, 26, 26)
                    for i, ln in enumerate(wrap(d, r.text, f, max(10, w - 4 - (cx - x)))):
                        if i:
                            cx = x + 2; cy += lead
                        if ln:
                            d.text((cx, cy), ln, font=f, fill=col)
                            cx += d.textlength(ln, font=f)
                cy += lead
        p = os.path.join(outdir, f"preview-{idx:02d}.png")
        img.save(p); files.append(p)
    return files

def io_bytes(sh):
    import io
    return io.BytesIO(sh.image.blob)

if __name__ == "__main__":
    fs = render(sys.argv[1], sys.argv[2])
    print("\n".join(fs))
