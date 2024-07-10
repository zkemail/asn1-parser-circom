pragma circom 2.1.6;


include "./parser.circom";
include "./utils.circom";
include "./utf8-utils.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/gates.circom";



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

    component CalcLengthOids[maxLengthOfOid];
    component selectorOidLen[maxLengthOfOid][maxLengthOfOid];
    component inRangeCheck[maxLengthOfOid][maxLengthOfOid];
    component stringMatchOrNot[maxLengthOfOid][maxStateNameLen];
    
    signal oidmatchOrNot[maxLengthOfOid];
    signal stringMatchReq[maxLengthOfOid];
    signal allEqual[maxLengthOfOid][maxStateNameLen];

    for (var i = 0; i < maxLengthOfOid; i++) {
        var startIndex = outRangeForOID[i][0];
        var endIndex = outRangeForOID[i][1];
        
        
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

        oidmatchOrNot[i] <== CalcLengthOids[i].out;

        var stringAsnStartIndex = endIndex;
        var stringAsnEndIndex = endIndex + stateNameLen + 2;
        var currStringIndex = 0;
        var stringExtracted[maxStateNameLen];

        // ? append current state name
        for (var m = stringAsnStartIndex + 2; m <  stringAsnEndIndex; m++) {
                stringExtracted[currStringIndex] = in[m];
                currStringIndex++;
        }

        // ? append zeros
        for (var m = stringAsnEndIndex; m < maxStateNameLen; m++) {
                stringExtracted[currStringIndex] = 0;
                currStringIndex++;
        }
        
        var allEqualTemp = 1;
        for (var j = 0; j < maxStateNameLen ; j++) {
             stringMatchOrNot[i][j] = IsEqual();
             stringMatchOrNot[i][j].in[0] <== stateName[j];
             stringMatchOrNot[i][j].in[1] <-- stringExtracted[j];
             allEqual[i][j] <==  stringMatchOrNot[i][j].out;
             allEqualTemp = allEqualTemp * allEqual[i][j];
        }
        
        stringMatchReq[i] <-- allEqualTemp;
    }
    component isFound = MultiOr(maxLengthOfOid);
    isFound.in <== stringMatchReq;
    isFound.out === 1;
}