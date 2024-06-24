pragma circom 2.0.0;

include "./parser.circom";
include "./circomlib/circuits/poseidon.circom";

// stateOrProvinceName  2.5.4.8

template UTF8StringProver(N,M,OidLength,Utf8Length) { 
    signal input in[N];
    signal input stateName[M];

    // var stateOrProvinceName[3] = [2,5,4,8];

    // component asnLength = AsnLength(N);
    // asnLength.in <== in;

    // signal oidLength <== asnLength.out[0];
    // signal utf8Length <== asnLength.out[1];

    // // Convert oidLength and utf8Length to constants if possible
    // signal tempOidLength <== oidLength;
    // signal tempUtf8Length <== utf8Length;

    // var constOidLength = tempOidLength;
    // var constUtf8Length = tempUtf8Length;

    
    component asnStartAndEndIndex = AsnStartAndEndIndex(N, OidLength,Utf8Length);
    asnStartAndEndIndex.in <== in;
    var outRangeForOID[OidLength][2] = asnStartAndEndIndex.outRangeForOID;
    var outRangeForUTF8[Utf8Length][2] = asnStartAndEndIndex.outRangeForUTF8;


    for (var i=0 ; i <OidLength ; i++) { 
        var startIndex = outRangeForOID[i][0];
        var endIndex = outRangeForOID[i][1];
    }
}
