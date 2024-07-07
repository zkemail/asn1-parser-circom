pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";
include "./utils.circom";

// Define the BooleanConstraint template
template BooleanConstraint() { 
    signal input in;
    component isEqual = IsEqual();
    isEqual.in[0] <== in;
    isEqual.in[1] <== tag_class_boolean();
    isEqual.out === 1;
}

// Define the OctetStringConstraint template
template OctetStringConstraint() { 
    signal input in;
    component isEqual = IsEqual();
    isEqual.in[0] <== in;
    isEqual.in[1] <== tag_octet_string();
    isEqual.out === 1;
}

// Define the ObjectIdentifierConstraint template
template ObjectIdentifierConstraint() { 
    signal input in;
    component isEqual = IsEqual();
    isEqual.in[0] <== in;
    isEqual.in[1] <== tag_class_object_identifier();
    isEqual.out === 1;
}

// Define the SequenceConstraint template
template SequenceConstraint() {
    signal input in;
    component isEqual = IsEqual();
    isEqual.in[0] <== in;
    isEqual.in[1] <== tag_class_sequence();
    isEqual.out === 1;
}

// Define the UTCTimeConstraint template
template UTCTimeConstraint() {
    signal input in;
    component isEqual = IsEqual();
    isEqual.in[0] <== in;
    isEqual.in[1] <== tag_class_utc_time();
    isEqual.out === 1;
}

// Define the UTF8StringConstraint template
template UTF8StringConstraint() {
    signal input in;
    component isEqual = IsEqual();
    isEqual.in[0] <== in;
    isEqual.in[1] <== tag_utf8_string();
    isEqual.out === 1;
}

// Define the BITStringConstraint template
template BITStringConstraint() {
    signal input in;
    component isEqual = IsEqual();
    isEqual.in[0] <== in;
    isEqual.in[1] <== tag_class_bit_string();
    isEqual.out === 1;
}

// Define the IntegerConstraint template
template IntegerConstraint() {
    signal input in;
    component isEqual = IsEqual();
    isEqual.in[0] <== in;
    isEqual.in[1] <== tag_class_integer();
    isEqual.out === 1;
}
