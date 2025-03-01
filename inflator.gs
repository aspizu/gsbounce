%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/inflator.png";

set_layer_order 4;

proc create_object inflator_entity entity {
}

proc setup {
    costume_width = inflator_width;
    costume_height = inflator_height;
    LDTK_CREATE_OBJECTS(level_inflator)
}

proc spawn {}


func touching_ball() {
    change_x 1;
    if touching("ball") {
        change_x -1;
        return true;
    }
    change_x -1;
    change_x -1;
    if touching("ball") {
        change_x 1;
        return true;

    }
    change_x 1;
    change_y 1;
    if touching("ball") {
        change_y -1;
        return true;   
    }
    change_y -1;
    change_y -1;
    if touching("ball") {
        change_y 1;
        return true;
    }
    change_y 1;
    return false;
}

proc render {
    if touching_ball() {
        broadcast_and_wait "inflate";
    }
}
