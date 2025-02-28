%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/exit.png", "assets/exit_closed.png";

set_layer_order 3;

proc create_object x, y {
    x = $x;
    y = $y;
    new_object;
}

proc setup {
    costume_width = exit_width;
    costume_height = exit_height;
    LDTK_CREATE_OBJECTS(level_exit, level_exit_lens)
}

proc spawn {}

proc render {
    if rings_remaining == 0 {
        switch_costume "exit";
        if touching("ball") {
            broadcast "levelup";
        }
    } else {
        switch_costume "exit_closed";
    }
}
