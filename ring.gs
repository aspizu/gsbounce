%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/ring.svg", "assets/ring_collected.svg";
sounds "assets/ring_collect.mp3";

set_layer_order 4;

proc create_object ring_entity entity {
    is_collected = false;
    rings_remaining++;
}

proc setup {
    costume_width = ring_width;
    costume_height = ring_height;
    LDTK_CREATE_OBJECTS(level_ring)
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
