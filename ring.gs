%include lib/game_object
%include lib/ldtk
costumes "assets/ring.png", "assets/ring_collected.png";
sounds "assets/ring_collect.mp3";

list LDTKEntity data = sh ```
jq -r '.entities.ring[] | .[]' "level/simplified/level_0/data.json"
```;

proc create_object x, y {
    x = $x;
    y = $y;
    is_collected = false;
    rings_remaining++;
    new_object;
}

proc setup {
    costume_width = data[1].width;
    costume_height = data[1].height;
    rings_remaining = 0;
    local i = 1;
    repeat length(data) {
        create_object data[i].x, LEVEL_HEIGHT - data[i].y;
        i++;
    }
}

proc spawn {}

proc render {
    if touching("ball") and not is_collected {
        start_sound "ring_collect";
        is_collected = true;
        switch_costume "ring_collected";
        rings_remaining--;
    }
}
