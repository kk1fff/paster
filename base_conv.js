// element can be a string or an array. Its elements are used
// to represent the transformatted binary.
function BaseConv(elements) {
  this._elements = elements;
  this._len = elements.length;
}

BaseConv.prototype = {
  _elements: null,
  _len: -1,

  _internalTransform: function(num) {
    var s = '';
    while (num > this._len) {
      s += this._elements[num % this._len];
      num = Math.floor(num / this._len);
    }
    s += s[num];
    return s;
  },

  // Transforms a number or a list of number to
  // n-base, where n is number of element.
  transform: function(numOrArray) {
    var r = '';
    if (typeof numOrArray == 'array') {
      numOrArray.forEach(function(v) {
        r += this._internalTransform(v);
      }, this);
    } else if (typeof numOrArray == 'number') {
      r = this._internalTransform(numOrArray);
    } else {
      throw new Error('Argument can only be number or array of numbers');
    }
    return r;
  },

  transformBuffer: function(buf) {
    var v = 0, i, r = '';
    for (i = 0; i < buf.length;) {
      v = v * 256 + buf[i++];
      if (i % 4 == 0) {
        r += this._internalTransform(v);
        v = 0;
      }
    }
    // bytes left.
    if (v != 0) {
      r += this._internalTransform(v);
    }
    return r;
  }
};

exports.BaseConv = function(e) {
  console.log("create base conv: " + e);
  return new BaseConv(e);
};
