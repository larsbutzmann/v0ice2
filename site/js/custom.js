setTimeout(function () {
    window.scrollTo(0, 1);
}, 1000);

/**
 * Basic data structure functions
 */

Array.prototype.in_array = function (value) {
    return (this.indexOf(value) !== -1);
};

Array.prototype.push_unique = function (value) {
  if (!this.in_array(value)) {
    this.push(value);
  }
};