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

template ObjectIdentiferParser(N) { 
    signal input in[N];
    signal output out;
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