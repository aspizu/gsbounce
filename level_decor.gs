%include lib/game_object
%include defs/level_decor

set_layer_order 1;

proc create_object x, y {
    x = $x;
    y = $y;
    new_object;
}

proc setup {
    switch_costume "level_" & level;
    costume_width = level_widths[level];
    costume_height = level_heights[level];
    create_object 0, 0;
}

proc spawn {}

proc render {}
