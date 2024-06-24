pragma circom 2.0.0;

include "@zk-email/circuits/utils/array.circom";
include "./utils.circom";
include "./tag_class.circom";

template AsnParser(N, lengthOfOid, lengthOfUtf8) { 
    signal input in[N];
    signal output OID[lengthOfOid];
    signal output UTF8[lengthOfUtf8];   

    var SEQUENCE           =  0x30;
    var SET                =  0x31;
    var CONTEXT_SPECIFIC_0 =  0xa0;
    var CONTEXT_SPECIFIC_1 =  0xa1;
    var CONTEXT_SPECIFIC_3 =  0xa3;
    var CONTEXT_SPECIFIC_4 =  0xa4;
    var OCTET_STRING       =  0x04;
    var OBJECT_IDENTIFIER  =  0x06;
    var UTF8_STRING        =  0x0c;

    
}

template AsnLengthForEachOID(N) {
    signal input in[N];
    // out[0] length of oid array
    // out[1] length of utf8 array
    signal output out[2];  
    
    var SEQUENCE           =  0x30;
    var SET                =  0x31;
    var CONTEXT_SPECIFIC_0 =  0xa0;
    var CONTEXT_SPECIFIC_1 =  0xa1;
    var CONTEXT_SPECIFIC_3 =  0xa3;
    var CONTEXT_SPECIFIC_4 =  0xa4;
    var OCTET_STRING       =  0x04;
    var OBJECT_IDENTIFIER  =  0x06;
    var UTF8_STRING        =  0x0c;

    var num_of_oids = 0;
    var num_of_utf8 = 0;
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
            num_of_oids++;
          }
          if (ASN_TAG ==  UTF8_STRING){
            num_of_utf8++;
          }
          var startIndex = i;
          var endIndex = startIndex + ASN_LENGTH + 2;
          i = endIndex;
        }
    }
    out[0] <-- num_of_oids;
    out[1] <-- num_of_utf8;
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