%include defs/level_data
costumes "blank.svg";

struct array2 { ptr, len };

var camera_x = 0;
var camera_y = 0;
var rings_remaining = 0;
var checkpoint_x = 0;
var checkpoint_y = 0;
var lives = 3;
var level = 1;
var time = 0;
var large_ball = false;

%include std/cmd

onkey "t" {
    ask "";
    onkey_t;
}

proc onkey_t {
    _ = cmd_next(1, answer());
    if cmd_args[1] == "l" {
        level = cmd_args[2] - 1;
        broadcast_and_wait "levelup";
    } elif cmd_args[1] == "lu" {
        broadcast_and_wait "levelup";
    } elif cmd_args[1] == "ld" {
        level = level - 2;
        broadcast_and_wait "levelup";
    }
}
