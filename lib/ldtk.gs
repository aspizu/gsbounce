%define LDTK_CREATE_OBJECTS(TYPE)                                                      \
    local i = TYPE[level].ptr;                                                         \
    repeat TYPE[level].len {                                                           \
        create_object CONCAT(TYPE, _data) [i];                                         \
        x = CONCAT(TYPE, _data) [i].x;                                                 \
        y = level_heights[level] - CONCAT(TYPE, _data) [i].y;                          \
        new_object;                                                                    \
        i++;                                                                           \
    }
