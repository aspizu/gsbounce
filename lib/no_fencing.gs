# Shim to remove sprite fencing in vanilla Scratch

proc __goto x, y {
    local old_costume = costume_name();
    local old_size = size();
    switch_costume "blank";
    set_size "Infinity";
    log size();
    goto $x, $y;
    switch_costume old_costume;
    set_size old_size;
}

# replace built-in goto with our own
# %define goto __goto
