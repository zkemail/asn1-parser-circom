pragma circom 2.0.0;

include "./utils.circom";

template BooleanContraint() { 
    signal input in;
    in === tag_class_boolean();
}

template OctectStringContraint() { 
    signal input in;
    in ===  tag_class_octet_string();
}

template ObjectIdentiferContraint() { 
    signal input in;
    in ===  tag_class_object_identifier();
}

template ObjectIdentiferContraint() { 
    signal input in;
    in ===  tag_class_object_identifier();
}

template SequenceConstraint() {
    signal input in;
    in ===  tag_class_sequence();
}

template UTCTimeConstraint() {
    signal input in;
    in ===  tag_class_utc_time();
}

template UTF8StringConstraint() {
    signal input in;
    in ===  tag_class_utf8_string();
}

template BITStringContraint() {
    signal input in;
    in === tag_class_bit_string();
}