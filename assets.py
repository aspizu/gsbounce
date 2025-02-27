import json

import matplotlib.colors as mcolors
import numpy as np
import PIL.Image

import ldtk

sheet = PIL.Image.open("assets/sheet.png").convert("RGBA")

with open("level.ldtk") as f:
    project: ldtk.LdtkJSON = ldtk.LdtkJSON.from_dict(json.load(f))

bg_color = mcolors.hex2color(project.default_level_bg_color)
bg_color = tuple(int(c * 255) for c in bg_color)

for entity in project.defs.entities:
    if entity.tile_rect is None:
        continue
    sprite = sheet.crop(
        (
            entity.tile_rect.x,
            entity.tile_rect.y,
            entity.tile_rect.x + entity.tile_rect.w,
            entity.tile_rect.y + entity.tile_rect.h,
        )
    )
    sprite_data = np.array(sprite)
    mask = (
        (sprite_data[:, :, 0] == bg_color[0])
        & (sprite_data[:, :, 1] == bg_color[1])
        & (sprite_data[:, :, 2] == bg_color[2])
    )
    sprite_data[mask] = [0, 0, 0, 0]
    sprite = PIL.Image.fromarray(sprite_data)
    sprite.save(f"assets/{entity.identifier}.png")

PIL.Image.new("RGB", (480, 360), project.default_level_bg_color).save("assets/bg.png")
