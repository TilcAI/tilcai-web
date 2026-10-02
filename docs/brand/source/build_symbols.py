"""Generates the Tilcayo isotype sketches (docs/brand/*.svg) as clean single-path vectors, 64x64, one colour.
Run: python docs/brand/source/build_symbols.py docs/brand   (standard library only).

Outer shapes are drawn clockwise and cut-outs counter-clockwise, so `fill-rule="nonzero"` unions
overlapping solids (ring + bead) while cut-outs stay negative space. No raster, no strokes, no text.
"""
import math, sys, pathlib

def area(pts):  # shoelace; y-down screen coords: positive => clockwise on screen
    return sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1])) / 2

def poly(pts, clockwise=True):
    if (area(pts) > 0) != clockwise:
        pts = pts[::-1]
    d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts) + " Z"
    return d

def mirror(pts):  # across the vertical axis x=32
    return [(64 - x, y) for x, y in pts]

def pt(cx, cy, r, deg):  # y-up angle in degrees
    a = math.radians(deg)
    return cx + r * math.cos(a), cy - r * math.sin(a)

def ring(cx, cy, r_in, r_out, a_start, a_end):
    """Annular sector from a_start clockwise to a_end (y-up degrees, a_end < a_start)."""
    sweep = a_start - a_end
    large = 1 if sweep > 180 else 0
    o0, o1 = pt(cx, cy, r_out, a_start), pt(cx, cy, r_out, a_end)
    i1, i0 = pt(cx, cy, r_in, a_end), pt(cx, cy, r_in, a_start)
    f = lambda p: f"{p[0]:.2f} {p[1]:.2f}"
    return (f"M{f(o0)} A{r_out:g} {r_out:g} 0 {large} 1 {f(o1)} L{f(i1)} "
            f"A{r_in:g} {r_in:g} 0 {large} 0 {f(i0)} Z")

def circle(cx, cy, r):  # clockwise
    return f"M{cx - r:g} {cy:g} A{r:g} {r:g} 0 1 1 {cx + r:g} {cy:g} A{r:g} {r:g} 0 1 1 {cx - r:g} {cy:g} Z"

def svg(name, paths, title):
    d = " ".join(paths)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">\n'
            f'  <title>{title}</title>\n'
            f'  <path fill="currentColor" fill-rule="nonzero" d="{d}"/>\n</svg>\n')

# ---------------------------------------------------------------- Route B: symmetric face
def route_b(small=False):
    head = [(9, 4), (25, 14.5), (32, 12.8), (39, 14.5), (55, 4), (58.5, 26), (59, 40), (47, 56), (32, 61), (17, 56), (5, 40), (5.5, 26)]
    cuts = []
    # inner ear notches (negative space), one per ear
    ear = [(12, 11), (20, 16), (10.5, 22)] if not small else [(12.5, 10.5), (21.5, 17), (10.5, 23.5)]
    cuts += [ear, mirror(ear)]
    # attentive almond eyes
    eye = [(12.5, 32.5), (20.5, 29.2), (27, 32.5), (20, 36)] if not small else [(11.5, 32.5), (20.5, 28.5), (28, 32.5), (20, 37)]
    cuts += [eye, mirror(eye)]
    # nose
    cuts.append([(26.5, 43.5), (37.5, 43.5), (32, 50.5)] if not small else [(25.5, 43), (38.5, 43), (32, 51.5)])
    if not small:
        # distinctive detail 1: the two forehead bars of the original mascot
        bar = [(27.4, 15.5), (29.4, 15.9), (30.4, 26.8), (28.6, 26)]
        cuts += [bar, mirror(bar)]
        # distinctive detail 2: the line under each eye
        tear = [(11.5, 40), (13.2, 38.5), (23, 42.3), (21.8, 44)]
        cuts += [tear, mirror(tear)]
    paths = [poly(head, True)] + [poly(c, False) for c in cuts]
    return paths

# ---------------------------------------------------------------- Route A: profile in an open ring
def scale(pts, k=0.92, cx=32, cy=32):
    return [(cx + (x - cx) * k, cy + (y - cy) * k) for x, y in pts]

def route_a(small=False):
    head = [(20, 54), (12, 46), (9, 36), (10, 27), (14, 21), (19, 4), (28, 15), (31, 15), (37, 6), (42, 15),
            (46, 19), (49, 24), (49.5, 28), (48.5, 30.5), (52.5, 33), (55.5, 36), (55.5, 40), (51, 41.5),
            (49.5, 46), (45, 50), (39, 52), (34, 58), (28, 53.5)]
    cuts = []
    cuts.append([(16.6, 18.5), (19, 10), (23.2, 16.6)])                          # near ear notch
    cuts.append([(38, 29), (43.6, 26.4), (47.8, 29.2), (42.4, 32.2)] if not small
                else [(37, 29.5), (43.6, 26), (48.6, 29.2), (42.4, 33.2)])       # eye
    if not small:
        cuts.append([(45.9, 33), (47.5, 32.2), (50.5, 38), (49, 38.8)])           # line under the eye
        cuts.append([(30, 23.5), (32, 22.2), (40.5, 25), (39.6, 26.6)])           # forehead bar
    k = 0.92
    paths = [poly(scale(head, k), True)] + [poly(scale(c, k), False) for c in cuts]
    # own open container: a ring that opens where the ears come out, with a node bead on it
    r_in, r_out = (27.5, 30.5) if not small else (26.5, 30.5)
    paths.append(ring(32, 32, r_in, r_out, 76, -220))
    bx, by = pt(32, 32, (r_in + r_out) / 2, -64)
    paths.append(circle(bx, by, 4.3 if not small else 4.8))
    return paths

if __name__ == "__main__":
    out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    for name, fn, title in [("a", route_a, "Tilcayo isotype, route A: profile in an open ring"),
                            ("b", route_b, "Tilcayo isotype, route B: symmetric face")]:
        (out / f"tilcai-symbol-{name}.svg").write_text(svg(name, fn(False), title), encoding="utf-8")
        (out / f"tilcai-symbol-{name}-small.svg").write_text(svg(name, fn(True), title + " (small)"), encoding="utf-8")
    print("ok")
