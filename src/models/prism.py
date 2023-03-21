import math
import random

def draw_rect(pts): #input is 3d
    ret = []
    anchor = pts[0]
    for i in range(1, len(pts)-1):
        adj = i + 1
        ret.append(anchor)
        ret.append(pts[i])
        ret.append(pts[adj])
    return ret #output is 3d

# Const
low_y = -0.12
high_y = 0.12
sides = 360
radius = 0.3
thickness = 0.05
color = [162/255, 142/255, 6/255, 1]

# Calc triangles
out_poly = []
in_poly = []
angle = 0
delta = 360/sides
in_radius = radius - thickness
while (angle < 360):
    x = radius * math.cos(angle * math.pi / 180)
    z = radius * math.sin(angle * math.pi / 180)
    out_poly.append([x, z])
    in_poly.append([x * in_radius / radius, z * in_radius / radius])
    angle += delta

points = []
for i in range(len(out_poly)):
    cur_out = out_poly[i]
    cur_in = in_poly[i]
    adj = (i + 1) % len(out_poly)
    adj_out = out_poly[adj]
    adj_in = in_poly[adj]
    rect = [
        [cur_out[0], low_y, cur_out[1]],
        [cur_in[0], low_y, cur_in[1]],
        [adj_in[0], low_y, adj_in[1]],
        [adj_out[0], low_y, adj_out[1]]
    ]
    points.extend(draw_rect(rect))
    rect = [
        [cur_in[0], high_y, cur_in[1]],
        [cur_out[0], high_y, cur_out[1]],
        [adj_out[0], high_y, adj_out[1]],
        [adj_in[0], high_y, adj_in[1]]
    ]
    points.extend(draw_rect(rect))
    rect = [
        [cur_out[0], low_y, cur_out[1]],
        [adj_out[0], low_y, adj_out[1]],
        [adj_out[0], high_y, adj_out[1]],
        [cur_out[0], high_y, cur_out[1]]
    ]
    points.extend(draw_rect(rect))
    rect = [
        [adj_in[0], low_y, adj_in[1]],
        [cur_in[0], low_y, cur_in[1]],
        [cur_in[0], high_y, cur_in[1]],
        [adj_in[0], high_y, adj_in[1]]
    ]
    points.extend(draw_rect(rect))


lines = []
lines.append("const prism = {")

# pts
lines.append("\t\"points\": [")
for pt in points:
    assert(len(pt)==3)
    lines.append(f"\t\t[{pt[0]}, {pt[1]}, {-pt[2]}, 1],")
lines[-1] = lines[-1][:-1]
lines.append("\t],")

# colors
lines.append("\t\"colors\": [")
idx = 0
c1 = random.randrange(0, 255)/255
c2 = random.randrange(0, 255)/255
c3 = random.randrange(0, 255)/255
for pt in points:
    if (idx%6 == 0):
        c1 = random.randrange(0, 255)/255
        c2 = random.randrange(0, 255)/255
        c3 = random.randrange(0, 255)/255
    lines.append(f"\t\t[{c1}, {c2}, {c3}, 1],")
    idx += 1
lines[-1] = lines[-1][:-1]
lines.append("\t]")

# close
lines.append("}")
f = open("./src/models/prism.js", "w+")
for line in lines:
    f.write(line)
    f.write("\n")
f.close()