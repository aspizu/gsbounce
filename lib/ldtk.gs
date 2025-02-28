%define LDTK_CREATE_OBJECTS(LIST,LENS)                                                 \
    local i = 1;                                                                       \
    local j = 1;                                                                       \
    repeat level-1 {                                                                   \
        i += LENS[j];                                                                  \
        j++;                                                                           \
    }                                                                                  \
    repeat LENS[level] {                                                               \
        create_object LIST[i].x, level_heights[level] - LIST[i].y;                     \
        i++;                                                                           \
    }
