%include lib/ldtk
%define SLOPE 1
%define GRAVITY 4
%define JUMP 67
costumes "assets/ball.png", "assets/ball_dead.png";
sounds "assets/ball_death.mp3";

set_layer_order 4;

onflag {
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
    rings_remaining = 0;
}

on "spawn" {
    spawn;
    broadcast_and_wait "render";
    forever {
        broadcast "render";
        render;
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

proc setup {
    checkpoint_x = level_ball[level].x;
    checkpoint_y = level_heights[level] - level_ball[level].y;
    lives = 3;
}

proc spawn {
    switch_costume "ball";
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
    goto x - camera_x, y - camera_y;
}


proc move_x dx {
    x += $dx;
    position;
    if touching("level") {
        local i = 1;
        until not touching("level") or i > SLOPE {
            y += 1;
            position;
            i++;
        }
        if not touching("level") {
            stop_this_script;
        }
        y -= SLOPE;
        position;
        local i = 1;
        until not touching("level") or i > SLOPE {
            y -= 1;
            position;
            i++;
        }
        if not touching("level") {
            stop_this_script;
        }
        y += SLOPE;
        position;
        vel_x *= -0.5;
        until not touching("level") {
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
    if touching("level") {
        if abs(vel_y) > 2 {
            vel_y *= -0.5;
        } else {
            vel_y = 0;
        }
        until not touching("level") {
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
