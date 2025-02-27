%include lib/game_object
%include lib/ldtk
costumes "assets/checkpoint.png", "assets/checkpoint_collected.png";
sounds "assets/checkpoint_collect.mp3";

list LDTKEntity data = sh ```
jq -r '.entities.checkpoint[] | .[]' "level/simplified/level_0/data.json"
```;

proc create_object x, y {
    x = $x;
    y = $y;
    is_collected = false;
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
        start_sound "checkpoint_collect";
        switch_costume "checkpoint_collected";
        checkpoint_x = x + costume_width/2;
        checkpoint_y = y + costume_height/2;
        is_collected = true;
    }
}
