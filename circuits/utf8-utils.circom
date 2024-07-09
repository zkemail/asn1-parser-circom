pragma circom 2.0.0;

include "./utils.circom";
include "circomlib/circuits/comparators.circom";

template OIDLengthCalculator(maxLength, maxOidLen) {
    signal input in[maxLength];
    signal input startIndex;
    signal input endIndex;
    
    signal input oid[maxOidLen]; 
    signal input oidLen;

    signal output out;

    var isFirst = 1;
    var oidCalc[maxOidLen];
    var length = 0;
    var n = 0;
                
    for (var k = 2; k < endIndex - startIndex; k++) {
      var currBytes = in[k];
      n = n << 7;
      n = n | (currBytes & 0x7f);

      var mst = (currBytes & 0x80) == 0 ? 1 : 0; 
      if (mst == 1) {
            if (isFirst == 1) {
                    var first = n \ 40; 
                    var second = n % 40;
                    oidCalc[length] = first;
                    oidCalc[length + 1] = second;
                    length += 2;
                    isFirst = 0;
                    } else {
                        oidCalc[length] = n;
                        length++;
                    }
                    n = 0;
        }
      }
      out <-- length;
    //   component eqs[maxOidLen];
      
    //   for (var i = 0; i < maxOidLen; i++) {
    //     eqs[i] = IsEqual();
    //     eqs[i].in[0] <== oid[i];
    //     eqs[i].in[1] <-- oidCalc[i];
    //   }          
}
