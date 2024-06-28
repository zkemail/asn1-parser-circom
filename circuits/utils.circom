pragma circom 2.0.0;

template PrintArray(N) { 
    signal input in[N];
    for (var i=0; i<N; i++){ 
        log(in[i]);
    }
}


function calculate_offset(n){
    return n & 0x7f;
}

function tag_class_sequence() { 
    return 0x30;
}

function tag_class_set() { 
    return 0x31;
}

function tag_context_specific_zero () {
    return 0xa0;
}

function tag_context_specific_one () {
    return 0xa1;
}

function tag_context_specific_two () {
    return 0xa2;
}

function tag_context_specific_three () {
    return 0xa3;
}

function tag_context_specific_four () {
    return 0xa4;
}

function tag_octet_string () {
    return 0x04;
}

function tag_class_object_identifier () {
    return 0x06;
}

function tag_utf8_string () {
    return 0x0c;
}

function tag_class_boolean()  {
    return 0x01;
}

function tag_class_integer()  {
    return 0x02;
}

function tag_class_bit_string()  {
    return 0x03;
}

function tag_class_utc_time()  {
    return 0x17;
}