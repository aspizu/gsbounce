hide;

proc position {
%if ORIGIN_IS_TOP_LEFT
    goto costume_width/2 + x - camera_x, costume_height/2 + y - camera_y;
%endif
%if not ORIGIN_IS_TOP_LEFT
    goto x - camera_x, costume_height + y - camera_y;
%endif
}

on "render" {
    if id > 0 {
        position;
        render;
    }
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
