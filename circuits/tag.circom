pragma circom 2.0.0;

// include "@zk-email/circuits/utils/array.circom";

template TagDecoder() {
    signal input n;
  
    signal output tagClass;
    signal output tagConstructed;
    signal output tagNumber;
    
    assert(n < 128);

    // Extract tag class from 7th and 8th bits
    tagClass <-- n >> 6;

    // Check if 6th bit is set (tag constructed)
    signal temp;
    temp <-- n & 0x20;
    tagConstructed <-- temp == 0 ? 1 : 0;

    // Extract tag number from lower 5 bits
    tagNumber <-- n & 0x1f;
}


template TagLength(N) { 
    // TODO 
    assert(N > 0);
    signal input in[N];
    signal output out;

    // Check whether most significant bit is set to zero
    // If it's set to 1 then it's encoded in long bytes format
    // var mst = in[0] & 0x80;

    // if (mst == 0) {
    //     out <== in[0];
    // }else{

    // }
}