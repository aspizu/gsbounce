%include lib/game_object
%include lib/ldtk
costumes "assets/life.png";
sounds "assets/life_collect.mp3";

list LDTKEntity data = sh ```
jq -r '.entities.life[] | .[]' "level/simplified/level_0/data.json"
```;

proc create_object x, y {
    x = $x;
    y = $y;
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
    if touching("ball") {
        start_sound "life_collect";
        lives++;
        delete_this_clone;
    }
}
