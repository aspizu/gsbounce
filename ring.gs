%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/ring.png", "assets/ring_collected.png";
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
    costume_width = ring_width;
    costume_height = ring_height;
    LDTK_CREATE_OBJECTS(level_ring, level_ring_lens)
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
