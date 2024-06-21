pragma circom 2.0.0;

include "@zk-email/circuits/utils/array.circom";
include "./utils.circom";
include "./tag_class.circom";

template AsnParser(N) {
    signal input in[N];
    signal output out;

    component arrayUtils  =  CalculateTotal(N);
    arrayUtils.nums <== in;

    var startIndex = 4;
    var subArrayLength = 9;
    out <== arrayUtils.sum;   

    component SequenceSubArray =  SelectSubArray(N,startIndex);
    component ObjectIdentiferSubArray = SelectSubArray(N,subArrayLength);

    SequenceSubArray.in <== in;
    SequenceSubArray.startIndex <== 0;
    SequenceSubArray.length <== startIndex;

    // ? [ 6 9 42 134 72 134 247 13 1 ]
    ObjectIdentiferSubArray.in <== in;
    ObjectIdentiferSubArray.startIndex <== startIndex;
    ObjectIdentiferSubArray.length <== subArrayLength;

    signal Sequence[startIndex] <== SequenceSubArray.out;
    signal ObjectIdentifer[subArrayLength] <== ObjectIdentiferSubArray.out;
    
    component log1 = PrintArray(startIndex);
    log1.in <== Sequence;

    // log("------------------");
    component log2 = PrintArray(subArrayLength);
    log2.in <== ObjectIdentifer;


    component decodeLength = DecodeLength(subArrayLength);
    decodeLength.in <== ObjectIdentifer;


    component decodeLengthForSequene = DecodeLength(4);
    decodeLengthForSequene.in <== Sequence;


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