declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Ensure this runs when imported
if (typeof BigInt !== 'undefined') {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}

export {};
