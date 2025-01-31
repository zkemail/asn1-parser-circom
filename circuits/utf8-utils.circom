pragma circom 2.1.6;

include "./utils.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/gates.circom";

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
                
    // ? oid parsing
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

      // ? adding zero to oidCalc
      for (var i = length; i < maxOidLen; i++) { oidCalc[i] = 0; }
      
      signal allEqual[maxOidLen];
      component equalChecks[maxOidLen];

      for (var i = 0;i  < maxOidLen; i++) {
        equalChecks[i] = IsEqual();
        equalChecks[i].in[0] <== oid[i];
        equalChecks[i].in[1] <-- oidCalc[i];
        allEqual[i] <== equalChecks[i].out;
      }

    
      // ? output will be something like this
      // 1. Output will be 1. only when length == oidLen && oidCalc[i] == oid[i]
      // 2. Output will be zero in the rest of the cases
    component finalAND = MultiAND(maxOidLen);
    finalAND.in <== allEqual;
    out <== finalAND.out;
}
