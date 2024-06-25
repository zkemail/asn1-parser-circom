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

function tag_class_eoc()  {
    return 0x00;
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

function tag_class_octet_string()  {
    return 0x04;
}

function tag_class_null()  {
    return 0x05;
}

function tag_class_object_identifier()  {
    return 0x06;
}

function tag_class_object_descriptor()  {
    return 0x07;
}

function tag_class_external()  {
    return 0x08;
}

function tag_class_real()  {
    return 0x09;
}

function tag_class_enumerated()  {
    return 0x0A;
}

function tag_class_embedded_pdv()  {
    return 0x0B;
}

function tag_class_utf8_string()  {
    return 0x0C;
}

function tag_class_relative_oid()  {
    return 0x0D;
}

function tag_class_sequence()  {
    return 0x10;
}

function tag_class_set()  {
    return 0x11;
}

function tag_class_numeric_string()  {
    return 0x12;
}

function tag_class_printable_string()  {
    return 0x13;
}

function tag_class_teletex_string()  {
    return 0x14;
}

function tag_class_videotex_string()  {
    return 0x15;
}

function tag_class_ia5_string()  {
    return 0x16;
}

function tag_class_utc_time()  {
    return 0x17;
}

function tag_class_generalized_time()  {
    return 0x18;
}

function tag_class_graphic_string()  {
    return 0x19;
}

function tag_class_visible_string()  {
    return 0x1A;
}

function tag_class_general_string()  {
    return 0x1B;
}

function tag_class_universal_string()  {
    return 0x1C;
}

function tag_class_bmp_string()  {
    return 0x1E;
}
