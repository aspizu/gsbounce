%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/checkpoint.png", "assets/checkpoint_collected.png";
sounds "assets/checkpoint_collect.mp3";

proc create_object x, y {
    x = $x;
    y = $y;
    is_collected = false;
    new_object;
}

proc setup {
    costume_width = checkpoint_width;
    costume_height = checkpoint_height;
    LDTK_CREATE_OBJECTS(level_checkpoint, level_checkpoint_lens)
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
