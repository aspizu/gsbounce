%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/candle.png";

set_layer_order 4;

proc create_object candle_entity entity {
}

proc setup {
    costume_width = candle_width;
    costume_height = candle_height;
    LDTK_CREATE_OBJECTS(level_candle)
}

proc spawn {}

proc render {
    if touching("ball") {
        broadcast "death";
    }
}
