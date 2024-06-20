pragma circom 2.0.0;

include "@zk-email/circuits/utils/array.circom";
include "./utils.circom";

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

    log("------------------");
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

    // ASN.1 BER TAG-LENGTH-VALUE
    assert(N >= 3);
    signal secondByte <== in[1];

    // Check whether most significant bit is set to zero
    // If it's mst set to 1 then it's encoded in long bytes format
    var mst = secondByte & 0x80 == 0 ? 1 : 0;
    var length = 0;
    if (mst == 1) {
       length = secondByte;
    }else {
        // Long bytes encoding
        // Get 7 bits of octet 
        // 0x7F => 01111111
        var numBytes  = secondByte & 0x7f;
        var temp = 0;
        for (var i = 0; i < numBytes ;i++) { 
               temp = (temp << 8) | in[i + 2];
        }        

       length = temp;
    }
    out <-- length;
    log(out , "Decodelength");
}

template ObjectIdentiferParser(N) { 
    signal input in[N];
    signal output out;
}