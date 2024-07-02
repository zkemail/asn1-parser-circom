pragma circom 2.0.0;

include "@zk-email/circuits/utils/array.circom";
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
          var isLongForm = (ASN_LENGTH & 0x80) == 0 ? 0 : 1;
          if (isLongForm == 1){
            var offset = calculate_offset(ASN_LENGTH);
            var endIndex = i + offset + 2;
            i = endIndex;
          } else{
                i += 2; 
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

                    startIndicesOctet[num_of_octet_string] =  startIndex;
                    endIndicsOctet[num_of_octet_string] = endIndex;
                    num_of_octet_string++;

                } else{
                    var startIndex = i;
                    var endIndex = startIndex + ASN_LENGTH + 2;
                    i = endIndex;

                    startIndicesOctet[num_of_octet_string] =  startIndex;
                    endIndicsOctet[num_of_octet_string] = endIndex;
                    num_of_octet_string++;
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
                if (ASN_TAG ==  UTF8_STRING) {
                    startIndicesUTF8[num_of_utf8] =  startIndex;
                    endIndicesUTF8[num_of_utf8]   = endIndex;
                    num_of_utf8++;
                }
                if (ASN_TAG == UTC_TIME){
                    startIndicesUTC[num_of_utc_time] =  startIndex;
                    endIndicesUTC[num_of_utc_time]   = endIndex;
                    num_of_utc_time++;
                }

                if (ASN_TAG == BIT_STRING) {
                    startIndicesBit[num_of_bit_string] = startIndex;
                    endIndicesBit[num_of_bit_string] = endIndex;
                    num_of_bit_string++;  
                }
        }
    }


    for(var k = 0; k < maxlengthOfOid ;k++) {
        outRangeForOID[k][0] <-- startIndicesOids[k];
        outRangeForOID[k][1] <-- endIndicesOids[k];
    }

    for(var l = 0; l < maxlengthOfString ;l++) {
        outRangeForUTF8[l][0] <-- startIndicesUTF8[l];
        outRangeForUTF8[l][1] <-- endIndicesUTF8[l];
    }

    for(var m = 0; m < maxlengthOfUtc ;m++) {
        outRangeForUTC[m][0] <-- startIndicesUTC[m];
        outRangeForUTC[m][1] <-- endIndicesUTC[m];
    }

    for(var n = 0; n < maxlengthOfOctetString ;n++) {
        outRangeForOctetString[n][0] <-- startIndicesOctet[n];
        outRangeForOctetString[n][1] <-- endIndicsOctet[n];
    }


    for(var n = 0; n < maxlengthOfBitString ;n++) {
        outRangeForBitString[n][0] <-- startIndicesBit[n];
        outRangeForBitString[n][1] <-- endIndicesBit[n];
    }


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