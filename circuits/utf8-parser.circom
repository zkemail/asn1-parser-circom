pragma circom 2.0.0;

include "./parser.circom";
include "./circomlib/circuits/poseidon.circom";
include "./circomlib/circuits/comparators.circom";

// stateOrProvinceName  2.5.4.8

template UTF8StringProver( N , stateNameLen , oidLen , lengthOfOid , lengthOfUtf8) { 
    signal input in[N];
    signal input stateName[stateNameLen]; 
    signal input oid[oidLen]; 
    signal output out;


    component asnStartAndEndIndex =  AsnStartAndEndIndex(N,lengthOfOid,lengthOfUtf8);
    asnStartAndEndIndex.in <== in;

    signal outRangeForOID[lengthOfOid][2] <== asnStartAndEndIndex.outRangeForOID;
    signal outRangeForUTF8[lengthOfUtf8][2] <== asnStartAndEndIndex.outRangeForUTF8;



    var isFoundTest = 0;

    for(var i=0;i<lengthOfUtf8;i++){
        var startIndex = outRangeForUTF8[i][0];
        var endIndex   = outRangeForUTF8[i][1];
        
        // string length 2 bytes for tagclass and length tag
        var length = endIndex - startIndex - 2;
        // ? we found the expected string
        if (length == stateNameLen){

                var no_of_matches = 0;
                var Index = 0;

                for(var j = startIndex + 2; j < endIndex; j++){                        
                        if (stateName[Index] == in[j]) {
                                no_of_matches++;
                        }
                        Index++;
                }

                if (no_of_matches == length) {
                    isFoundTest = 1;
                }
            }
        }

        signal isFound <-- isFoundTest - 1;
        component isZero = IsZero();
        isZero.in <== isFound;
        isZero.out === 1;
}