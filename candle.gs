%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/candle.png";

proc create_object x, y {
    x = $x;
    y = $y;
    new_object;
}

proc setup {
    costume_width = candle_width;
    costume_height = candle_height;
    LDTK_CREATE_OBJECTS(level_candle, level_candle_lens)
}

proc spawn {}

proc render {
    if touching("ball") {
        broadcast "death";
    }
}
