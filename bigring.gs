%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/bigring.png", "assets/bigring_collected.png";
sounds "assets/ring_collect.mp3";

set_layer_order 4;

proc create_object bigring_entity entity {
    is_collected = false;
    rings_remaining++;
}

proc setup {
    costume_width = bigring_width;
    costume_height = bigring_height;
    LDTK_CREATE_OBJECTS(level_bigring)
}

proc spawn {}

proc render {
    if touching("ball") and not is_collected {
        start_sound "ring_collect";
        is_collected = true;
        switch_costume "bigring_collected";
        rings_remaining--;
    }
}
