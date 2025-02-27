hide;

proc position {
    goto costume_width/2 + x - camera_x, costume_height/2 + y - camera_y;
}

on "render" {
    position;
    render;
}

on "setup" {
    id = 0;
    _id = 1;
    if id == 0 {
        setup;
    }
}

on "spawn" {
    spawn;
}

on "reset" {
    delete_this_clone;
}

onclone {
    show;
}

proc new_object {
    id = _id;
    _id++;
    clone;
}
