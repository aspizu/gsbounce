%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/hring.png", "assets/hring_collected.png";
sounds "assets/ring_collect.mp3";

set_layer_order 3;

proc create_object x, y {
    x = $x;
    y = $y;
    is_collected = false;
    rings_remaining++;
    new_object;
}

proc setup {
    costume_width = hring_width;
    costume_height = hring_height;
    LDTK_CREATE_OBJECTS(level_hring, level_hring_lens)
}

proc spawn {}

proc render {
    if touching("ball") and not is_collected {
        start_sound "ring_collect";
        is_collected = true;
        switch_costume "hring_collected";
        rings_remaining--;
    }
}
