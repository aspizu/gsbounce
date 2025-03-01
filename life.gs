%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/life.png";
sounds "assets/life_collect.mp3";

set_layer_order 4;

proc create_object life_entity entity {
}

proc setup {
    costume_width = life_width;
    costume_height = life_height;
    LDTK_CREATE_OBJECTS(level_life)
}

proc spawn {}

proc render {
    if touching("ball") {
        start_sound "life_collect";
        lives++;
        delete_this_clone;
    }
}
