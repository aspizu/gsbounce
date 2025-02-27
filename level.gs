%include lib/no_fencing
%include lib/game_object
costumes "level/simplified/level_0/tiles.png", "blank.svg";

proc create_object x, y {
    x = $x;
    y = $y;
    new_object;
}

proc setup {
    costume_width = LEVEL_WIDTH;
    costume_height = LEVEL_HEIGHT;
    create_object 0, 0;
}

proc spawn {}

proc render {}
