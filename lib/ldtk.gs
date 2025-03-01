%define LDTK_CREATE_OBJECTS(TYPE)                                                      \
    local i = TYPE[level].ptr;                                                         \
    repeat TYPE[level].len {                                                           \
        create_object __xxCONCAT__ TYPE _data [i];                                     \
        x = __xxCONCAT__ TYPE _data [i].x;                                             \
        y = level_heights[level] - __xxCONCAT__ TYPE _data [i].y;                      \
        new_object;                                                                    \
        i++;                                                                           \
    }
