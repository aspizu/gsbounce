%include std/math
%include lib/game_object
%include lib/ldtk
%include defs/dims
costumes "assets/spider.svg";

set_layer_order 4;

proc create_object spider_entity entity {
    start_x = $entity.x;
    start_y = level_heights[level] - $entity.y;
    end_x = $entity.end_x*12;
    end_y = level_heights[level] - ($entity.end_y + 1)*12;
    dist = DIST(start_x, start_y, end_x, end_y);
}

proc setup {
    costume_width = spider_width;
    costume_height = spider_height;
    LDTK_CREATE_OBJECTS(level_spider)
}

proc spawn {
    x = start_x;
    y = start_y;
}

proc render {
    local t = abs((time % (2*dist)) - dist) / dist;
    x = LERP(start_x, end_x, t);
    y = LERP(start_y, end_y, t);
    if touching("ball") {
        broadcast "death";
    }
}
