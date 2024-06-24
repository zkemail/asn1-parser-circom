pragma circom  2.0.0;

// experimental approach 
template ArrayToBigInt(N) { 
    signal input in[N];
    signal output out;

    var lc = 0;
    for (var i = 0; i < N; i++) {
        lc += in[i] * (1 << (64 * i));
    }

    out <== lc;
}

