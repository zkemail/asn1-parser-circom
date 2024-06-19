pragma circom 2.0.0;

include "@zk-email/circuits/lib/base64.circom";

template AsnParser(N) {
    signal input in[N];
    signal output out[N];

   //  out <== Base64Decode(N)(in);
 
   //  for (var i = 0; i < N; i++) {
   //      base64Decoder.in[i] <== in[i];
   //  }

   //  for (var i = 0; i < N; i++) {
   //      out[i] <== base64Decoder.out[i];
   //  }
}
