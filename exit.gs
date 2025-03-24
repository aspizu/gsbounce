%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/exit.svg", "assets/exit_closed.svg";

set_layer_order 4;

proc create_object exit_entity entity {
}

proc setup {
    costume_width = exit_width;
    costume_height = exit_height;
    LDTK_CREATE_OBJECTS(level_exit)
}

proc spawn {}

proc render {
    if rings_remaining == 0 {
        switch_costume "exit";
        change_x -1;
        if touching("ball") {
            broadcast "levelup";
        }
        change_x 1;
    } else {
        switch_costume "exit_closed";
    }
}
