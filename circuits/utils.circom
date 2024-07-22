pragma circom 2.1.6;

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/gates.circom";

template PrintArray(N) { 
    signal input in[N];
    for (var i=0; i<N; i++){ 
        log(in[i]);
    }
}

template MultiOr(n) {
    signal input in[n];
    signal output out;

    component orGates[n-1];

    // Initialize the first OR gate
    orGates[0] = OR();
    orGates[0].a <== in[0];
    orGates[0].b <== in[1];

    // Chain the OR gates
    for (var i = 1; i < n-1; i++) {
        orGates[i] = OR();
        orGates[i].a <== orGates[i-1].out;
        orGates[i].b <== in[i+1];
    }

    // The output of the last OR gate is the result
    out <== orGates[n-2].out;
}

template InRange(n) {
    signal input in;
    signal input lowerBound;
    signal input upperBound;
    signal output out;

    component geq = GreaterEqThan(n);
    component lt = LessThan(n);

    geq.in[0] <== in;
    geq.in[1] <== lowerBound;

    lt.in[0] <== in;
    lt.in[1] <== upperBound;

    out <== geq.out * lt.out;
}

// Selector template to choose between two inputs based on a condition
template Selector() {
    signal input condition;
    signal input in[2];
    signal output out;
    out <== condition * (in[1] - in[0]) + in[0];
}

function processContainerTag(tag, length, currentIndex) {
        var LONG_FORM_MASK = 0x80;
        
        if ((length & LONG_FORM_MASK) != 0) {
            var offset = calculate_offset(length);
            return currentIndex + offset + 2;
        }
        return currentIndex + 2;
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

function tag_class_printable_string()  {
    return 0x13;
}