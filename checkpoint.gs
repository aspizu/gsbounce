%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/checkpoint.svg", "assets/checkpoint_collected.svg";
sounds "assets/checkpoint_collect.mp3";

set_layer_order 4;

proc create_object checkpoint_entity entity {
    is_collected = false;
}

proc setup {
    costume_width = checkpoint_width;
    costume_height = checkpoint_height;
    LDTK_CREATE_OBJECTS(level_checkpoint)
}

proc spawn {}

proc render {
    if touching("ball") and not is_collected {
        start_sound "checkpoint_collect";
        switch_costume "checkpoint_collected";
        checkpoint_x = x;
        checkpoint_y = y;
        is_collected = true;
    }
}
