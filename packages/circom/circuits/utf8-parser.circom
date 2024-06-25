pragma circom 2.0.0;

include "parser.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

/**
 * @title UTF8StringProver
 * @dev This circuit allows you to prove that you have an object identifier with a UTF8 string.
 * @param N The total length of the input array
 * @param stateNameLen The length of the state name
 * @param oidLen The length of the Object Identifier
 * @param lengthOfOid The number of OID segments
 * @param lengthOfUtf8 The number of UTF8 segments
 */
 
template UTF8StringProver(N, stateNameLen, oidLen, lengthOfOid, lengthOfUtf8) { 
    signal input in[N];
    signal input stateName[stateNameLen]; 
    signal input oid[oidLen]; 
    signal output out;

    component asnStartAndEndIndex = AsnStartAndEndIndex(N, lengthOfOid, lengthOfUtf8);
    asnStartAndEndIndex.in <== in;

    signal outRangeForOID[lengthOfOid][2] <== asnStartAndEndIndex.outRangeForOID;
    signal outRangeForUTF8[lengthOfUtf8][2] <== asnStartAndEndIndex.outRangeForUTF8;

    var isFoundTest = 0;

    for (var i = 0; i < lengthOfOid; i++) {
        var startIndex = outRangeForOID[i][0];
        var endIndex = outRangeForOID[i][1];
        
        var length = 0;
        var isFirst = 1;

        // Find length of OID array [2.3.4] => 3 
        for (var j = startIndex + 2; j < endIndex; j++) { 
            var curr = in[j];
            curr = curr & 0x80 == 0 ? 1 : 0;
            if (curr == 1) { 
                if (isFirst == 1) { 
                    length += 2;
                    isFirst = 0;
                } else {
                    length++;
                }
            }   
        }

        // Decoding OID string from buffer (refer to ObjectIdentifierParser() template)
        if (length == oidLen) {
            var oidCalc[oidLen];
            var outputIndex = 0;
            var n = 0;
            isFirst = 1;
            
            // Skip class and value bytes
            // Calculate all OIDs with the same length as the actual OID
            for (var k = startIndex + 2; k < endIndex; k++) {
                var currBytes = in[k];
                n = n << 7;
                n = n | (currBytes & 0x7f);

                var mst = (currBytes & 0x80) == 0 ? 1 : 0; 
                if (mst == 1) {
                    if (isFirst == 1) {
                        var first = n \ 40; 
                        var second = n % 40;
                        oidCalc[outputIndex] = first;
                        oidCalc[outputIndex + 1] = second;
                        outputIndex += 2;
                        isFirst = 0;
                    } else {
                        oidCalc[outputIndex] = n;
                        outputIndex++;
                    }
                    n = 0;
                }
            }

            var no_of_matches = 0;
            
            for (var l = 0; l < oidLen; l++) {                        
                if (oidCalc[l] == oid[l]) {
                    no_of_matches++;
                }
            }

            if (no_of_matches == length) {
                // OID of given input and output is matched 
                // OID is followed by UTF8 string (e.g., orgName OID => UTF8String)
                var stringAsnStartIndex = endIndex;
                var stringAsnEndIndex = endIndex + stateNameLen + 2;
                var currStringIndex = 0;
                var no_of_matches_for_utf8 = 0;

                for (var m = stringAsnStartIndex + 2; m < stringAsnEndIndex; m++) {
                    if (stateName[currStringIndex] == in[m]) { 
                        no_of_matches_for_utf8++;
                    }
                    currStringIndex++;
                }
                if (no_of_matches_for_utf8 == stateNameLen) { 
                    isFoundTest = 1;    
                }
            }
        }                
    }
    signal isFound <-- isFoundTest - 1;
    component isZero = IsZero();
    isZero.in <== isFound;
    isZero.out === 1;
}