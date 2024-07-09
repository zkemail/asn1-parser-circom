pragma circom 2.0.0;

include "./parser.circom";
include "./utils.circom";
include "./utf8-utils.circom";
include "circomlib/circuits/comparators.circom";


/**
 * @title UTF8StringProver
 * @dev This circuit allows you to prove that you have an object identifier with a UTF8 string within an ASN.1 encoded structure.
 *
 * @param maxLength The maximum length of the input array
 * @param maxStateNameLen The maximum length of the state name
 * @param maxOidLen The maximum length of the Object Identifier
 * @param maxLengthOfOid The maximum number of OID segments in the input
 * @param maxLengthOfUtf8 The maximum number of UTF8 segments in the input
 * @param maxlengthOfUtc The maximum number of UTC time segments in the input
 * @param maxlengthOfOctetString The maximum number of Octet String segments in the input
 * @param maxlengthOfBitString The maximum number of Bit String segments in the input
 *
 * @input in[maxLength] The input array containing the ASN.1 encoded data
 * @input oid[maxOidLen] The Object Identifier to be verified
 * @input stateName[maxStateNameLen] The state name (UTF8 string) to be verified
 * @input actualLength The actual length of the input data
 * @input stateNameLen The actual length of the state name
 * @input oidLen The actual length of the Object Identifier
 * @input lengthOfOid The number of OID segments in the input
 * @input lengthOfUtf8 The number of UTF8 segments in the input
 * @input lengthOfUtc The number of UTC time segments in the input
 * @input lengthOfOctet The number of Octet String segments in the input
 * @input lengthOfBit The number of Bit String segments in the input
 *
 * @output out A signal indicating whether the proof is valid (1) or not (0)
 */
 
template UTF8StringProver (maxLength, maxStateNameLen, maxOidLen, maxLengthOfOid, maxLengthOfUtf8, maxlengthOfUtc, maxlengthOfOctetString, maxlengthOfBitString) { 
    signal input in[maxLength];
    signal input oid[maxOidLen]; 
    signal input stateName[maxStateNameLen]; 

    signal input actualLength;

    signal input stateNameLen;
    signal input oidLen;

    signal input lengthOfOid;
    signal input lengthOfUtf8;
    signal input lengthOfUtc;
    signal input lengthOfOctet;
    signal input lengthOfBit;

    signal output out;

    component asnStartAndEndIndex = AsnStartAndEndIndex(maxLength, maxLengthOfOid, maxLengthOfUtf8, maxlengthOfUtc, maxlengthOfOctetString, maxlengthOfBitString);

    asnStartAndEndIndex.in <== in;
    asnStartAndEndIndex.actualLength <== actualLength;
    asnStartAndEndIndex.actualLengthOfOid <== lengthOfOid;
    asnStartAndEndIndex.actualLengthOfString <== lengthOfUtf8;
    asnStartAndEndIndex.actualLengthOfUTC <== lengthOfUtc;
    asnStartAndEndIndex.actualLengthOfOctetString <== lengthOfOctet;
    asnStartAndEndIndex.actualLengthOfBitString <== lengthOfBit;

    signal outRangeForOID[maxLengthOfOid][2] <== asnStartAndEndIndex.outRangeForOID;
    signal outRangeForUTF8[maxLengthOfUtf8][2] <== asnStartAndEndIndex.outRangeForUTF8;

    // component temp2[maxOidLen];
    component lenCheckEq[maxLengthOfOid];
    component oidCheckEq[maxOidLen][maxLengthOfOid];

    var isFoundTest = 0;

    component CalcLengthOids[maxLengthOfOid];
    component selectorOidLen[maxLengthOfOid][maxLengthOfOid];

    component inRangeCheck[maxLengthOfOid][maxLengthOfOid];

    for (var i = 0; i < maxLengthOfOid; i++) {
        var startIndex = outRangeForOID[i][0];
        var endIndex = outRangeForOID[i][1];
        
        var length = 0;
        
        CalcLengthOids[i] = OIDLengthCalculator(maxLengthOfOid,maxOidLen);
        CalcLengthOids[i].oid <== oid;
        CalcLengthOids[i].oidLen <== oidLen;
        CalcLengthOids[i].startIndex <== startIndex;
        CalcLengthOids[i].endIndex <== endIndex;
        var startIndexTemp = startIndex;

        for (var j = 0; j < maxLengthOfOid; j++) {
            inRangeCheck[i][j] = InRange(32);
            inRangeCheck[i][j].in <-- startIndexTemp;
            inRangeCheck[i][j].lowerBound <== startIndex;
            inRangeCheck[i][j].upperBound <== endIndex;

            selectorOidLen[i][j] = Selector(); 
            selectorOidLen[i][j].condition <== inRangeCheck[i][j].out;
            selectorOidLen[i][j].in[0] <== 0;
            selectorOidLen[i][j].in[1] <-- in[startIndexTemp];
            CalcLengthOids[i].in[j] <== selectorOidLen[i][j].out;

            if (startIndexTemp < endIndex) { 
                startIndexTemp++;
            }
        }

        length = CalcLengthOids[i].out;
        
        if (oidLen == length) {
            var oidCalc[maxOidLen];
            var outputIndex = 0;
            var n = 0;
            var isFirst = 1;
            
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