%include lib/ldtk
%define SLOPE 1
%define GRAVITY 4
%define JUMP 67
costumes "assets/ball.svg", "assets/ball_dead.svg", "assets/largeball.svg";
sounds "assets/ball_death.mp3";

%define touching_solid ((                                                              \
    touching("level")                                                                  \
    or touching("exit")                                                                \
    or touching("inflator")                                                            \
    or (large_ball and (touching("ring") or touching("hring")))                        \
))

set_layer_order 5;

onflag {
    broadcast_and_wait "reset";
    broadcast "setup";
}

on "setup" {
    setup;
    broadcast "spawn";
}

on "levelup" {
    if level < length(level_widths) {
        level++;
    } else {
        level = 1;
    }
    stop_other_scripts;
    wait 0.5;
    broadcast_and_wait "reset";
    broadcast "setup";
}

on "reset" {
    large_ball = false;
    rings_remaining = 0;
}

on "spawn" {
    spawn;
    broadcast_and_wait "render";
    time = 0;
    forever {
        broadcast "render";
        render;
        time++;
    }
}

on "death" {
    lives--;
    switch_costume "ball_dead";
    stop_other_scripts;
    start_sound "ball_death";
    wait 0.5;
    if lives == 0 {
        broadcast_and_wait "reset";
        broadcast "setup";
    } else {
        broadcast "spawn";
    }
}


on "inflate" { inflate; }

proc inflate {
    if large_ball {
        stop_this_script;
    }
    large_ball = true;
    switch_costume "largeball";
    position;
    local b = 2;
    forever {
        x += b;
        position;
        if not touching_solid {
            stop_this_script;
        }
        x -= b;

        x -= b;
        position;
        if not touching_solid {
            stop_this_script;
        }
        x += b;

        y += b;
        position;
        if not touching_solid {
            stop_this_script;
        }
        y -= b;

        y -= b;
        position;
        if not touching_solid {
            stop_this_script;
        }
        y += b;

        x += b;
        y += b;
        position;
        if not touching_solid {
            stop_this_script;
        }
        x -= b;
        y -= b;

        x -= b;
        y += b;
        position;
        if not touching_solid {
            stop_this_script;
        }
        x += b;
        y -= b;

        x += b;
        y -= b;
        position;
        if not touching_solid {
            stop_this_script;
        }
        x -= b;
        y += b;

        x -= b;
        y -= b;
        position;
        if not touching_solid {
            stop_this_script;
        }
        x += b;
        y += b;

        b++;
    }
}

proc setup {
    checkpoint_x = level_ball_data[level_ball[level].ptr].x;
    checkpoint_y = level_ball_data[level_ball[level].ptr].y;
    lives = 3;
}

proc spawn {
    if large_ball {
        switch_costume "largeball";
    } else {
        switch_costume "ball";
    }
    x = checkpoint_x + 7;
    y = checkpoint_y + 5;
    vel_x = 0;
    vel_y = 0;
    camera_x = x;
    camera_y = 0;
    is_on_ground = true;
}

proc render {
    vel_y -= GRAVITY;
    if vel_x > 150 { vel_x = 150; }
    if vel_x < -150 { vel_x = -150; }
    if vel_y > 150 { vel_y = 150; }
    if vel_y < -150 { vel_y = -150; }
    move_x round(vel_x / 10);
    move_y round(vel_y / 10);
    if is_on_ground and (key_pressed("up arrow") or key_pressed("space")) {
        is_on_ground = false;
        vel_y = JUMP;
    }   
    if key_pressed("right arrow") and vel_x < 50 {
        vel_x += 6;
    }
    if not key_pressed("right arrow") and vel_x > 0 {
        vel_x -= 4;
    }
    if key_pressed("left arrow") and vel_x > -50 {
        vel_x -= 6;
    }
    if not key_pressed("left arrow") and vel_x < 0 {
        vel_x += 4;
    }

    # camera
    camera_x = x;
    position;
}

proc position {
    goto (x-6) - camera_x, (y+6) - camera_y;
}


proc move_x dx {
    x += $dx;
    position;
    if touching_solid {
        local i = 1;
        until not touching_solid or i > SLOPE {
            y += 1;
            position;
            i++;
        }
        if not touching_solid {
            stop_this_script;
        }
        y -= SLOPE;
        position;
        local i = 1;
        until not touching_solid or i > SLOPE {
            y -= 1;
            position;
            i++;
        }
        if not touching_solid {
            stop_this_script;
        }
        y += SLOPE;
        position;
        vel_x *= -0.5;
        until not touching_solid {
            if $dx > 0 {
                x -= 1;
            } else {
                x += 1;
            }
            position;
        }
    }
}

proc move_y dy {
    if abs(vel_y) > 1 {
        is_on_ground = false;
    }
    y += $dy;
    position;
    if touching_solid {
        if abs(vel_y) > 2 {
            vel_y *= -0.5;
        } else {
            vel_y = 0;
        }
        until not touching_solid {
            if $dy > 0 {
                y -= 1;
            } else {
                y += 1;
                is_on_ground = true;
            }
            position;
        }
    }
}
