# pyright: reportUnusedCallResult=false, reportAny=false, reportUnknownLambdaType=false, reportExplicitAny=false, reportRedeclaration=false

from __future__ import annotations

import base64
import itertools
import json
import shutil
from pathlib import Path
from typing import Any, TextIO

import matplotlib.colors as mcolors
import numpy as np
import PIL.Image

import ldtk

cwd = Path.cwd()


class Vector:
    def __init__(self, image: PIL.Image.Image) -> None:
        self.image: PIL.Image.Image = image

    def save(self, path: str | Path) -> None:
        path: Path = Path(path)
        self.image.save("temp.png")
        data = base64.b64encode(open("temp.png", "rb").read()).decode("utf-8")
        with path.open("w") as f:
            f.write('<svg xmlns="http://www.w3.org/2000/svg"')
            f.write('xmlns:xlink="http://www.w3.org/1999/xlink">')
            f.write(f'<image width="{self.image.width}" height="{self.image.height}"')
            f.write(f'xlink:href="data:image/png;base64,{data}" />')
            f.write("</svg>")


class Struct:
    def __init__(self, signature: str):
        self.fields: dict[str, str] = {}
        for line in signature.split(","):
            name, type_name = line.split(":")
            self.fields[name] = type_name

    def to_gs(self, stype_name: str) -> str:
        f: list[str] = []
        for name, type_name in self.fields.items():
            if type_name == "str":
                f.append(name)
            elif type_name == "point":
                f.append(f"{name}_x")
                f.append(f"{name}_y")
        return f"struct {stype_name} {{ {', '.join(f)} }}"

    def __len__(self) -> int:
        return self.to_gs("").count(",") + 1

    def flatten(self, data: Any) -> list[object]:
        d: list[object] = []
        for name, type_name in self.fields.items():
            if type_name == "str":
                d.append(data[name])
            elif type_name == "point":
                d.append(data[name]["cx"])
                d.append(data[name]["cy"])
        return d


class Document:
    def __init__(self, document_name: str, path: str | Path) -> None:
        self.path: Path = Path(path) if isinstance(path, str) else path
        self.file: TextIO = (
            self.path.joinpath(document_name).with_suffix(".gs").open("w")
        )

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

    def create_array2(
        self,
        array_name: str,
        lists: list[list[object]],
        type_name: str | None = None,
        struct: Struct | None = None,
    ) -> None:
        data: list[object] = []
        ptr = 1
        for sublist in lists:
            length = len(sublist) if struct is None else len(sublist) // len(struct)
            data.append(ptr)
            data.append(length)
            ptr += length
        self.create_list(array_name, data, type_name="array2")
        self.create_list(
            array_name + "_data",
            list(itertools.chain(*lists)),
            type_name=type_name,
        )

    def create_var(self, var_name: str, value: object) -> None:
        self.file.write(f"var {var_name} = {value};\n")

    def create_costume(
        self, costume_path: str, costume_name: str | None = None
    ) -> None:
        if costume_name is None or costume_name == Path(costume_path).stem:
            self.file.write(f'costumes "{costume_path}";\n')
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
    Vector(sprite).save(f"assets/{entity.identifier}.svg")

sprite = sheet.crop((40, 40, 40 + 16, 40 + 16))
sprite_data = np.array(sprite)
mask = (
    (sprite_data[:, :, 0] == bg_color[0])
    & (sprite_data[:, :, 1] == bg_color[1])
    & (sprite_data[:, :, 2] == bg_color[2])
)
sprite_data[mask] = [0, 0, 0, 0]
sprite = PIL.Image.fromarray(sprite_data)
Vector(sprite).save("assets/largeball.svg")

doc = Document("level", defs_path)
for level in project.levels:
    doc.create_costume(
        f"level/simplified/{level.identifier}/tiles.svg", level.identifier
    )

doc = Document("level_bg", defs_path)
for level in project.levels:
    doc.create_costume(f"level/simplified/{level.identifier}/_bg.svg", level.identifier)

doc = Document("level_decor", defs_path)
for level in project.levels:
    doc.create_costume(
        f"level/simplified/{level.identifier}/decor.svg", level.identifier
    )

doc = Document("level_data", defs_path)
doc.create_list("level_widths", [level.px_wid for level in project.levels])
doc.create_list("level_heights", [level.px_hei for level in project.levels])
levels = [
    json.load(cwd.joinpath(f"level/simplified/{level.identifier}/data.json").open())
    for level in project.levels
]

types = {
    "ball": Struct("x:str,y:str"),
    "exit": Struct("x:str,y:str"),
    "candle": Struct("x:str,y:str"),
    "ring": Struct("x:str,y:str"),
    "hring": Struct("x:str,y:str"),
    "bigring": Struct("x:str,y:str"),
    "bighring": Struct("x:str,y:str"),
    "life": Struct("x:str,y:str"),
    "inflator": Struct("x:str,y:str"),
    "checkpoint": Struct("x:str,y:str"),
    "spider": Struct("x:str,y:str,end:point"),
}

for entity_type, entity_struct in types.items():
    levels__entities = [level["entities"].get(entity_type, []) for level in levels]
    type_name = f"{entity_type}_entity"
    doc.file.write(entity_struct.to_gs(type_name) + "\n")
    doc.create_array2(
        f"level_{entity_type}",
        [
            list(
                itertools.chain(
                    *(
                        entity_struct.flatten({**entity, **entity["customFields"]})
                        for entity in entities
                    )
                )
            )
            for entities in levels__entities
        ],
        type_name=type_name,
        struct=entity_struct,
    )

Path("temp.png").unlink(missing_ok=True)
