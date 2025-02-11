function MakeRandomCode() {
    return Math.random().toString(16).substr(2, 8);
}

export default MakeRandomCode;
