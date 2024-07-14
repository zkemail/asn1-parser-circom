#!/bin/bash

# Check if correct number of arguments are provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <input_json_path>"
    exit 1
fi

# Assign argument to variable
INPUT_JSON="$1"

# Check if input JSON file exists
if [ ! -f "$INPUT_JSON" ]; then
    echo "Error: Input JSON file not found at $INPUT_JSON"
    echo "Please provide the full path to an existing input JSON file."
    exit 1
fi

# Create build directory if it doesn't exist
mkdir -p build

# Compile the circuit
circom -l node_modules ./circuits/main/utf8prover.circom -o build --r1cs --wasm --sym

# Change to the build directory
cd build

# Generate witness
if ! node utf8prover_js/generate_witness.js utf8prover_js/utf8prover.wasm ../inputs/utf8prover/default.json witness.wtns; then
    echo "Error: Failed to generate witness. Make sure the input JSON is correctly formatted."
    exit 1
fi


POT_PATH="../ptau/powersOfTau28_hez_final_18.ptau"

if [ ! -f "$POT_PATH" ]; then
    echo "Error: Powers of Tau file not found at $POT_PATH"
    echo "Downloading the file from the internet..."
    wget https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_18.ptau -O "$POT_PATH"
fi

# Generate the initial zkey
snarkjs groth16 setup utf8prover.r1cs $POT_PATH utf8prover_0000.zkey

# Contribute to the ceremony
snarkjs zkey contribute utf8prover_0000.zkey utf8prover_0001.zkey --name="1st Contributor Name" -v

# Export verification key
snarkjs zkey export verificationkey utf8prover_0001.zkey verification_key.json

# Generate a proof
if ! snarkjs groth16 prove utf8prover_0001.zkey witness.wtns proof.json public.json; then
    echo "Error: Failed to generate proof."
    exit 1
fi

# Verify the proof
if ! snarkjs groth16 verify verification_key.json public.json proof.json; then
    echo "Error: Proof verification failed."
    exit 1
fi

echo "Circuit built, proof generated and verified successfully."