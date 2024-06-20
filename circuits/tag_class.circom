pragma circom 2.0.0;

include "./utils.circom";

template BooleanConstraint() { 
    signal input in;
    in === tag_class_boolean();
}

template OctectStringConstraint() { 
    signal input in;
    in ===  tag_class_octet_string();
}

template ObjectIdentiferConstraint() { 
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

template BITStringConstraint() {
    signal input in;
    in === tag_class_bit_string();
}