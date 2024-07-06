pragma circom 2.0.0;

include "@zk-email/circuits/utils/array.circom";
include "circomlib/circuits/comparators.circom";
include "./utils.circom";
include "./tag_class.circom";

template AsnParser(N, lengthOfOid, lengthOfUtf8) { 
    // TODO: FIGURE OUT WAY TO ARRANGE AND SEND OUTPUT;
    signal input in[N];
    signal output OID[lengthOfOid];
    signal output UTF8[lengthOfUtf8];   

    // component asnStartAndEndIndex =  AsnStartAndEndIndex(N,lengthOfOid,lengthOfUtf8);
    // asnStartAndEndIndex.in <== in;

    // signal outRangeForOID[lengthOfOid][2] <== asnStartAndEndIndex.outRangeForOID;
    // signal outRangeForUTF8[lengthOfUtf8][2] <== asnStartAndEndIndex.outRangeForUTF8;

    // ? outRangeForOID  Contains all start,End Index 
    // ? outRangeForUTF8 Contains all utf8 start,endIndex
}


template AsnStartAndEndIndex(maxLength, maxlengthOfOid, maxlengthOfString, maxlengthOfUtc, maxlengthOfOctetString, maxlengthOfBitString) {
    signal input  in[maxLength];
    signal input  actualLength;
    signal input  actualLengthOfOid;
    signal input  actualLengthOfString;
    signal input  actualLengthOfUTC;
    signal input  actualLengthOfOctetString;
    signal input  actualLengthOfBitString;


    signal output outRangeForOID[maxlengthOfOid][2];
    signal output outRangeForUTF8[maxlengthOfString][2];
    signal output outRangeForUTC[maxlengthOfUtc][2];
    signal output outRangeForBitString[maxlengthOfBitString][2];
    signal output outRangeForOctetString[maxlengthOfOctetString][2]; 

    // Check if actualLengthOfString is within the allowed range
    component actualLengthCheck = LessThan(32);
    actualLengthCheck.in[0] <== actualLength;
    actualLengthCheck.in[1] <== maxLength;
    actualLengthCheck.out  === 1;

    component oidLengthCheck = LessThan(32);
    oidLengthCheck.in[0] <== actualLengthOfOid;
    oidLengthCheck.in[1] <== maxlengthOfOid;
    oidLengthCheck.out === 1;

    component stringLengthCheck = LessThan(32);
    stringLengthCheck.in[0] <== actualLengthOfString;
    stringLengthCheck.in[1] <== maxlengthOfString;
    stringLengthCheck.out === 1;

    component utcLengthCheck = LessThan(32);
    utcLengthCheck.in[0] <== actualLengthOfUTC;
    utcLengthCheck.in[1] <== maxlengthOfUtc;
    utcLengthCheck.out === 1;

    component octetStringLengthCheck = LessThan(32);
    octetStringLengthCheck.in[0] <== actualLengthOfOctetString;
    octetStringLengthCheck.in[1] <== maxlengthOfOctetString;
    octetStringLengthCheck.out === 1;

    component bitStringLengthCheck = LessThan(32);
    bitStringLengthCheck.in[0] <== actualLengthOfBitString;
    bitStringLengthCheck.in[1] <== maxlengthOfBitString;
    bitStringLengthCheck.out === 1;

    var SEQUENCE           =  tag_class_sequence();
    var SET                =  tag_class_set();
    var CONTEXT_SPECIFIC_0 =  tag_context_specific_zero();
    var CONTEXT_SPECIFIC_1 =  tag_context_specific_one();
    var CONTEXT_SPECIFIC_3 =  tag_context_specific_three();
    var CONTEXT_SPECIFIC_4 =  tag_context_specific_four();
    var OCTET_STRING       =  tag_octet_string();
    var OBJECT_IDENTIFIER  =  tag_class_object_identifier();
    var UTF8_STRING        =  tag_utf8_string();
    var UTC_TIME           =  tag_class_utc_time();
    var BIT_STRING         =  tag_class_bit_string();

    var i = 0;

    var  num_of_oids = 0;
    var  num_of_utf8 = 0;
    var  num_of_utc_time = 0;
    var  num_of_bit_string = 0;
    var  num_of_octet_string = 0;


    var startIndicesOids[maxlengthOfOid];
    var endIndicesOids[maxlengthOfOid];
    
    var startIndicesUTF8[maxlengthOfString];
    var endIndicesUTF8[maxlengthOfString];
    
    var startIndicesUTC[maxlengthOfUtc];
    var endIndicesUTC[maxlengthOfUtc];

    var startIndicesOctet[maxlengthOfOctetString];
    var endIndicsOctet[maxlengthOfOctetString];

    var startIndicesBit[maxlengthOfBitString];
    var endIndicesBit[maxlengthOfBitString];


     while (i < actualLength - 1){
      var ASN_TAG = in[i];
      var ASN_LENGTH = in[i + 1];

      if (
        ASN_TAG == SEQUENCE || 
        ASN_TAG == SET ||
        ASN_TAG == CONTEXT_SPECIFIC_0 ||
        ASN_TAG ==  CONTEXT_SPECIFIC_1 || 
        ASN_TAG ==  CONTEXT_SPECIFIC_3 || 
        ASN_TAG ==  CONTEXT_SPECIFIC_4
      ){
        i = processContainerTag(ASN_TAG, ASN_LENGTH, i);
      }
      else if (ASN_TAG == 0x24) { 
            i += 2;
      }
      else if (ASN_TAG == OCTET_STRING){
             var isLongForm = (ASN_LENGTH & 0x80) == 0 ? 0 : 1;

             var length = 0;
                if (isLongForm) {
                    var numBytes = ASN_LENGTH & 0x7f;
                    var temp = numBytes;
                    var currentIndex = i + 2;
                        while (numBytes > 0) {
                                length = (length << 8) | in[currentIndex];
                                numBytes-=1;
                                currentIndex+=1;
                            }
                    var startIndex = i;
                    var endIndex = startIndex + length + temp + 2;
                    i = endIndex;

                    startIndicesOctet[num_of_octet_string] =  startIndex;
                    endIndicsOctet[num_of_octet_string] = endIndex;
                    num_of_octet_string++;

                } else{
                    var isEmbedded = in[i + 2];

                    if (isEmbedded == BIT_STRING || isEmbedded == OCTET_STRING ) {
                         var startIndex = i;
                         var endIndex = i + 2;
                         i = endIndex;    

                        startIndicesOctet[num_of_octet_string] =  startIndex;
                        endIndicsOctet[num_of_octet_string] = endIndex;
                        num_of_octet_string++;    
                    }
                    else { 
                        var startIndex = i;
                        var endIndex = startIndex + ASN_LENGTH + 2;
                        i = endIndex;    

                        startIndicesOctet[num_of_octet_string] =  startIndex;
                        endIndicsOctet[num_of_octet_string] = endIndex;
                        num_of_octet_string++;
                    }
                    

                }
        }
        else {
                var startIndex = i;
                var endIndex = startIndex + ASN_LENGTH + 2;
                i = endIndex;

                if (ASN_TAG ==  OBJECT_IDENTIFIER) {
                    startIndicesOids[num_of_oids] =  startIndex;
                    endIndicesOids[num_of_oids] = endIndex;
                    num_of_oids++;
                }
                else if (ASN_TAG ==  UTF8_STRING) {
                    startIndicesUTF8[num_of_utf8] =  startIndex;
                    endIndicesUTF8[num_of_utf8]   = endIndex;
                    num_of_utf8++;
                }
                else if (ASN_TAG == UTC_TIME){
                    startIndicesUTC[num_of_utc_time] =  startIndex;
                    endIndicesUTC[num_of_utc_time]   = endIndex;
                    num_of_utc_time++;
                }

                else if (ASN_TAG == BIT_STRING) {
                    startIndicesBit[num_of_bit_string] = startIndex;
                    endIndicesBit[num_of_bit_string] = endIndex;
                    num_of_bit_string++;  
                }
        }
    }

    component selectorForOid1[maxlengthOfOid];
    component selectorForOid2[maxlengthOfOid];
    component selectorsEqualForOid[maxlengthOfOid];

    for(var k = 0; k < maxlengthOfOid; k++) {
        var start_tag_class = in[startIndicesOids[k]];
        var condition = k < actualLengthOfOid ? 0 : 1;

        selectorForOid1[k] = Selector();
        selectorForOid1[k].condition <-- condition; 
        selectorForOid1[k].in[0] <-- start_tag_class;
        selectorForOid1[k].in[1] <== 0;
        
        selectorForOid2[k] = Selector();
        selectorForOid2[k].condition <-- condition;
        selectorForOid2[k].in[0] <== tag_class_object_identifier();
        selectorForOid2[k].in[1] <== 0x00;
        
        selectorsEqualForOid[k] = IsEqual();
        selectorsEqualForOid[k].in[0] <== selectorForOid1[k].out;
        selectorsEqualForOid[k].in[1] <== selectorForOid2[k].out;
        selectorsEqualForOid[k].out === 1;

        outRangeForOID[k][0] <-- startIndicesOids[k];
        outRangeForOID[k][1] <-- endIndicesOids[k];
    }

    component selectorForUtf1[maxlengthOfString];
    component selectorForUtf2[maxlengthOfString];
    component selectorsEqualForUtf[maxlengthOfString];

    for(var l = 0; l < maxlengthOfString ;l++) {
        
        var start_tag_class = in[startIndicesUTF8[l]];
        var condition = l < actualLengthOfString ? 0 : 1;

        selectorForUtf1[l] = Selector();
        selectorForUtf1[l].condition <-- condition; 
        selectorForUtf1[l].in[0] <-- start_tag_class;
        selectorForUtf1[l].in[1] <== 0;

        selectorForUtf2[l] = Selector();
        selectorForUtf2[l].condition <-- condition;
        selectorForUtf2[l].in[0] <==  tag_utf8_string();
        selectorForUtf2[l].in[1] <== 0x00;
        
        selectorsEqualForUtf[l] = IsEqual();
        selectorsEqualForUtf[l].in[0] <== selectorForUtf1[l].out;
        selectorsEqualForUtf[l].in[1] <== selectorForUtf2[l].out;
        selectorsEqualForUtf[l].out === 1;

        outRangeForUTF8[l][0] <-- startIndicesUTF8[l];
        outRangeForUTF8[l][1] <-- endIndicesUTF8[l];
    }

    component selectorForUtc1[maxlengthOfUtc];
    component selectorForUtc2[maxlengthOfUtc];
    component selectorsEqualForUtc[maxlengthOfUtc];

    for(var m = 0; m < maxlengthOfUtc ;m++) {
        var start_tag_class = in[startIndicesUTC[m]];
        var condition = m < actualLengthOfUTC ? 0 : 1;     

        selectorForUtc1[m] = Selector();
        selectorForUtc1[m].condition <-- condition; 
        selectorForUtc1[m].in[0] <-- start_tag_class;
        selectorForUtc1[m].in[1] <== 0;

        selectorForUtc2[m] = Selector();
        selectorForUtc2[m].condition <-- condition;
        selectorForUtc2[m].in[0] <== tag_class_utc_time();
        selectorForUtc2[m].in[1] <== 0x00;
        
        selectorsEqualForUtc[m] = IsEqual();
        selectorsEqualForUtc[m].in[0] <== selectorForUtc1[m].out;
        selectorsEqualForUtc[m].in[1] <== selectorForUtc2[m].out;
        selectorsEqualForUtc[m].out === 1;   

        outRangeForUTC[m][0] <-- startIndicesUTC[m];
        outRangeForUTC[m][1] <-- endIndicesUTC[m];
    }

    component selectorForOctet1[maxlengthOfOctetString];
    component selectorForOctet2[maxlengthOfOctetString];
    component selectorsEqualForOctet[maxlengthOfOctetString];

    for(var n = 0; n < maxlengthOfOctetString ;n++) {
        var start_tag_class = in[startIndicesOctet[n]];
        var condition = n < actualLengthOfOctetString ? 0 : 1;     
        selectorForOctet1[n] = Selector();
        selectorForOctet1[n].condition <-- condition; 
        selectorForOctet1[n].in[0] <-- start_tag_class;
        selectorForOctet1[n].in[1] <== 0;

        selectorForOctet2[n] = Selector();
        selectorForOctet2[n].condition <-- condition;
        selectorForOctet2[n].in[0] <== tag_octet_string();
        selectorForOctet2[n].in[1] <== 0x00;
        
        selectorsEqualForOctet[n] = IsEqual();
        selectorsEqualForOctet[n].in[0] <== selectorForOctet1[n].out;
        selectorsEqualForOctet[n].in[1] <== selectorForOctet2[n].out;
        selectorsEqualForOctet[n].out === 1;   

        outRangeForOctetString[n][0] <-- startIndicesOctet[n];
        outRangeForOctetString[n][1] <-- endIndicsOctet[n];
    }

    component selectorForBit1[maxlengthOfBitString];
    component selectorForBit2[maxlengthOfBitString];
    component selectorsEqualForBit[maxlengthOfBitString];

    for(var n = 0; n < maxlengthOfBitString ;n++) {
        var start_tag_class = in[startIndicesBit[n]];
        var condition = n < actualLengthOfBitString ? 0 : 1;     

        selectorForBit1[n] = Selector();
        selectorForBit1[n].condition <-- condition; 
        selectorForBit1[n].in[0] <-- start_tag_class;
        selectorForBit1[n].in[1] <== 0;

        selectorForBit2[n] = Selector();
        selectorForBit2[n].condition <-- condition;
        selectorForBit2[n].in[0] <== tag_class_bit_string();
        selectorForBit2[n].in[1] <== 0x00;
        
        selectorsEqualForBit[n] = IsEqual();
        selectorsEqualForBit[n].in[0] <== selectorForBit1[n].out;
        selectorsEqualForBit[n].in[1] <== selectorForBit2[n].out;
        selectorsEqualForBit[n].out === 1;   

        outRangeForBitString[n][0] <-- startIndicesBit[n];
        outRangeForBitString[n][1] <-- endIndicesBit[n];
    }

    signal num_of_oids_signal <-- num_of_oids;
    signal num_of_utf8_signal <-- num_of_utf8;
    signal num_of_utc_time_signal <-- num_of_utc_time;
    signal num_of_octet_string_signal <-- num_of_octet_string;
    signal num_of_bit_string_signal <-- num_of_bit_string;


    component eqOids = IsEqual();
    component eqUtf8 = IsEqual();
    component eqUtcTime = IsEqual();
    component eqOctetString = IsEqual();
    component eqBitString = IsEqual();

    eqOids.in[0] <== num_of_oids_signal;
    eqOids.in[1] <== actualLengthOfOid;

    eqUtf8.in[0] <== num_of_utf8_signal;
    eqUtf8.in[1] <== actualLengthOfString;

    eqUtcTime.in[0] <== num_of_utc_time_signal;
    eqUtcTime.in[1] <== actualLengthOfUTC;

    eqOctetString.in[0] <== num_of_octet_string_signal;
    eqOctetString.in[1] <== actualLengthOfOctetString;

    eqBitString.in[0] <== num_of_bit_string_signal;
    eqBitString.in[1] <== actualLengthOfBitString;

    eqOids.out === 1;
    eqUtf8.out === 1;
    eqUtcTime.out === 1;
    eqOctetString.out === 1;
    eqBitString.out === 1;

}

template AsnLength(N) {
    signal input in[N];
    // out[0] length of oid array
    // out[1] length of utf8 array
    // out[2] length of time (utcTime)
    signal output out[4];  
    
    var SEQUENCE           =  tag_class_sequence();
    var SET                =  tag_class_set();
    var CONTEXT_SPECIFIC_0 =  tag_context_specific_zero();
    var CONTEXT_SPECIFIC_1 =  tag_context_specific_one();
    var CONTEXT_SPECIFIC_3 =  tag_context_specific_three();
    var CONTEXT_SPECIFIC_4 =  tag_context_specific_four();
    var OCTET_STRING       =  tag_octet_string();
    var OBJECT_IDENTIFIER  =  tag_class_object_identifier();
    var UTF8_STRING        =  tag_utf8_string();
    var UTC_TIME           =  tag_class_utc_time();

    var num_of_oids = 0;
    var num_of_utf8 = 0;
    var num_of_utc_time = 0;
    var i = 0;

    
    while (i < N - 1){
      var ASN_TAG = in[i];
      var ASN_LENGTH = in[i + 1];

      if (
      ASN_TAG == SEQUENCE || 
      ASN_TAG == SET ||
      ASN_TAG == CONTEXT_SPECIFIC_0 ||
      ASN_TAG ==  CONTEXT_SPECIFIC_1 || 
      ASN_TAG ==  CONTEXT_SPECIFIC_3 || 
      ASN_TAG ==  CONTEXT_SPECIFIC_4
      ){
          var isLongForm = (ASN_LENGTH & 0x80) == 0 ? 0 : 1;
          if (isLongForm == 1){
            var offset = calculate_offset(ASN_LENGTH);
            var endIndex = i + offset + 2;
            i = endIndex;
          } else{
                i += 2; //  short form
          }
      }
        else if (ASN_TAG == OCTET_STRING){
             var isLongForm = (ASN_LENGTH & 0x80) == 0 ? 0 : 1;
             var length = 0;
                if (isLongForm) {
                    var numBytes = ASN_LENGTH & 0x7f;
                    var temp = numBytes;
                    var currentIndex = i + 2;
                        while (numBytes > 0) {
                                length = (length << 8) | in[currentIndex];
                                numBytes-=1;
                                currentIndex+=1;
                            }
                    var startIndex = i;
                    var endIndex = startIndex + length + temp + 2;
                    i = endIndex;
                } else{
                    var startIndex = i;
                    var endIndex = startIndex + ASN_LENGTH + 2;
                    i = endIndex;
                }
        }
        else {
          if (ASN_TAG ==  OBJECT_IDENTIFIER){
            // utf8Contraint.in <-- ASN_TAG;
            num_of_oids++;
          }
          if (ASN_TAG ==  UTF8_STRING){
            num_of_utf8++;
          }
          if (ASN_TAG == UTC_TIME){
            num_of_utc_time++;
          }
          var startIndex = i;
          var endIndex = startIndex + ASN_LENGTH + 2;
          i = endIndex;
        }
    }
    out[0] <-- num_of_oids;
    out[1] <-- num_of_utf8;
    out[2] <-- num_of_utc_time;
}
 

template DecodeLength(N) {
    signal input in[N];
    signal output out;

    assert(N >= 2);
    signal secondByte <== in[1];

    // Check whether most significant bit is set to zero
    // If it's set to 0 then it's short form encoding
    var isShortForm = (secondByte & 0x80) == 0 ? 1 : 0;
    var length = 0;

    if (isShortForm == 1) {
        length = secondByte;
   
    }else {
        // Long bytes encoding
        // Get 7 bits of octet
        // 0x7F => 01111111
        var numBytes = secondByte & 0x7f;
        var temp = 0;
        for (var i = 0; i < numBytes; i++) {
            temp = (temp << 8) | in[i + 2];
        }
        length = temp;
    }

    out <-- length;
    // log(out, "DecodeLength");
}


template UTF8StringParser(N) {
    signal input in[N];
    signal output out[N-2]; 

    component utf8StringConstraint = UTF8StringConstraint();
    utf8StringConstraint.in <== in[0];

    component decodeLength = DecodeLength(N);
    decodeLength.in <== in;

    signal length <== decodeLength.out;

    component subArray = SelectSubArray(N, N-2);
    subArray.in <== in;
    subArray.startIndex <== 2;  
    subArray.length <== length;

    for (var i = 0; i < N-2; i++) {
        out[i] <== subArray.out[i];
    }


    // component logl = PrintArray(N-2);
    // logl.in <== out;
}

template ObjectIdentifierLength(N) { 
    signal input in[N];
    signal output out;

    var length  = 0;
    var isFirst = 1;
    for(var i=0; i<N; i++) { 
        var curr = in[i];
        curr = curr & 0x80 == 0 ? 1 : 0;
        if (curr == 1) { 
            if(isFirst == 1) { 
                length +=2;
                isFirst = 0;
            }else{
                length++;
            }
        }
    }
    out <-- length;
}

template ObjectIdentifierParser(N,M) {
    signal input in[N];
    signal output out[M];
    
    var tempOut[M];
    var outputIndex = 0;
    var n = 0;
    var isFirst = 1;
    
    for (var i = 0; i < N; i++) {
        var currBytes = in[i];
        n = n << 7;
        n = n | (currBytes & 0x7f);

        var mst = (currBytes & 0x80) == 0 ? 1 : 0; 
        if (mst == 1) {
            if (isFirst == 1) {
                var first = n \ 40; 
                var second = n % 40;
                tempOut[outputIndex] = first;
                tempOut[outputIndex + 1] = second;
                outputIndex += 2;
                isFirst = 0;
            } else {
                tempOut[outputIndex] = n;
                outputIndex++;
            }
            n = 0;
        }
    }
    
    for (var i = 0; i < M; i++) {
        out[i] <-- tempOut[i];
    }
}