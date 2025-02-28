%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/life.png";
sounds "assets/life_collect.mp3";

proc create_object x, y {
    x = $x;
    y = $y;
    new_object;
}

proc setup {
    costume_width = life_width;
    costume_height = life_height;
    LDTK_CREATE_OBJECTS(level_life, level_life_lens)
}

proc spawn {}

proc render {
    if touching("ball") {
        start_sound "life_collect";
        lives++;
        delete_this_clone;
    }
}
