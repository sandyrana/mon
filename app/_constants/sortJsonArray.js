/**
 * @param  {Array} `arr` The Array to be sorted.
 * @param  {String} `prop` The Property based on what the array should be sorted.
 * @param  {String} `order` The Property based on what the array should be sorted.
 * @return {Array} Returns a sorted array.
 */
 export function sortJsonArray(arr, prop, order) {
    console.log("SJJJJJJJJJJJJJJJJJJJJJ",arr,prop,order)
    if (arr == null) {
      return [];
    }
  
    if (!Array.isArray(arr)) {
      throw new TypeError('sort-json-array expects an array.');
    }
  
    if (arguments.length === 1) {
      return arr.sort();
    }
  
    if (arguments[2] === null || arguments[2] === 'asc') {
      return arr.sort(compare(prop, 1));
    }
    if (arguments[2] === 'des') {
      return arr.sort(compare(prop, 0));
    }
  
    throw new TypeError('Wrong argument.');
  }
  
  function compare(attr, value) {
    if (value) {
      return function(a, b) {
        (x = a[attr] === null ? '' : `${a[attr]}`),
          (y = b[attr] === null ? '' : `${b[attr]}`);
        return x < y ? -1 : x > y ? 1 : 0;
      };
    }
  
    return function(a, b) {
      (x = a[attr] === null ? '' : `${a[attr]}`),
        (y = b[attr] === null ? '' : `${b[attr]}`);
      return x < y ? 1 : x > y ? -1 : 0;
    };
  }
  