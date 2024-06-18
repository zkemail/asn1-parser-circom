pragma circom 2.0.0;

template TagDecoder() {
    signal input n;
    assert(n >= 0x01);
    signal output tagClass;
    signal output tagConstructed;
    signal output tagNumber;


    // Extract tag class from 7th and 8th bits
    tagClass <-- n >> 6;

    // Check if 6th bit is set (tag constructed)
    signal temp;
    temp <-- n & 0x20;
    tagConstructed <-- temp == 0 ? 1 : 0;

    // Extract tag number from lower 5 bits
    tagNumber <-- n & 0x1f;

    
}
