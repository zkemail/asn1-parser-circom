pragma circom 2.0.0;

template PrintArray(N) { 
    signal input in[N];
    for (var i=0; i<N; i++){ 
        log(in[i]);
    }
}