import itertools
import json
import shutil
from pathlib import Path

import matplotlib.colors as mcolors
import numpy as np
import PIL.Image

import ldtk

cwd = Path.cwd()


class Document:
    def __init__(self, document_name: str, path: str | Path) -> None:
        self.path = Path(path) if isinstance(path, str) else path
        self.file = self.path.joinpath(document_name).with_suffix(".gs").open("w")

    def create_list(
        self, list_name: str, items: list[object], type_name: str | None = None
    ) -> None:
        data_path = self.path.joinpath(list_name).with_suffix(".txt")
        data_path.write_text("\n".join(str(item) for item in items))
        self.file.write(
            f"list {'' if type_name is None else type_name + ' '}{list_name} = file ```{
                data_path.absolute().as_posix()
            }```;\n"
        )

    def create_var(self, var_name: str, value: object) -> None:
        self.file.write(f"var {var_name} = {value};\n")

    def create_costume(
        self, costume_path: str, costume_name: str | None = None
    ) -> None:
        if costume_path is None:
            self.file.write(f'costumes "{costume_name}";\n')
            return
        self.file.write(f'costumes "{costume_path}" as "{costume_name}";\n')

    def close(self) -> None:
        self.file.close()


defs_path = cwd.joinpath("defs")

shutil.rmtree(defs_path, ignore_errors=True)
defs_path.mkdir(exist_ok=True)
sheet = PIL.Image.open("assets/sheet.png").convert("RGBA")

with open("level.ldtk") as f:
    project: ldtk.LdtkJSON = ldtk.LdtkJSON.from_dict(json.load(f))

bg_color = mcolors.hex2color(project.default_level_bg_color)
bg_color = tuple(int(c * 255) for c in bg_color)

doc = Document("dims", defs_path)
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
    doc.create_var(f"{entity.identifier}_width", sprite.width)
    doc.create_var(f"{entity.identifier}_height", sprite.height)
    sprite_data = np.array(sprite)
    mask = (
        (sprite_data[:, :, 0] == bg_color[0])
        & (sprite_data[:, :, 1] == bg_color[1])
        & (sprite_data[:, :, 2] == bg_color[2])
    )
    sprite_data[mask] = [0, 0, 0, 0]
    sprite = PIL.Image.fromarray(sprite_data)
    sprite.save(f"assets/{entity.identifier}.png")


doc = Document("level", defs_path)
for level in project.levels:
    doc.create_costume(
        f"level/simplified/{level.identifier}/tiles.png", level.identifier
    )

doc = Document("level_bg", defs_path)
for level in project.levels:
    doc.create_costume(f"level/simplified/{level.identifier}/_bg.png", level.identifier)

doc = Document("level_data", defs_path)
doc.create_list("level_widths", [level.px_wid for level in project.levels])
doc.create_list("level_heights", [level.px_hei for level in project.levels])
levels = [
    json.load(cwd.joinpath(f"level/simplified/{level.identifier}/data.json").open())
    for level in project.levels
]

for entity in project.defs.entities:
    entity_type = entity.identifier
    level__entities = [level["entities"].get(entity_type, []) for level in levels]
    doc.create_list(
        f"level_{entity_type}_lens",
        [len(entities) for entities in level__entities],
    )
    entities = list(itertools.chain(*level__entities))
    doc.create_list(
        f"level_{entity_type}",
        list(itertools.chain(*((entity["x"], entity["y"]) for entity in entities))),
        type_name="Entity",
    )
