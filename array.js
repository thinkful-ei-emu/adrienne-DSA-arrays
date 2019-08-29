const Memory = require('./memory');
let memory = new Memory();

// less optimal way to do it because resizing each time push data
// class Array {
//   constructor() {
//     this.length = 0;
//     this.ptr = Memory.allocate(this.length);
//   }
//   push(value) { //O(n) resizes the array then increases lenght and sets memory address
//     this._resize(this.length + 1);
//     Memory.set(this.ptr + this.length, value);
//     this.length++;
//   }
//   _resize(size) { //O(n) because copy each item to new box each time resize array
//     const oldPtr = this.ptr;
//     this.ptr = Memory.allocate(size);
//     if(this.ptr === null) {
//       throw new Error('Out of memory');
//     }
//     Memory.copy(this.ptr, oldPtr, this.length);
//     Memory.free(oldPtr);
//   }
// }

// this way allocate more space than needed so have to resize less often
// wastes some memory but worth it because of how often pushing to arrays
class Array {
  constructor() {
    this.length = 0;
    this._capacity = 0;
    this._ptr = memory.allocate(this.length);
  }
  _resize(size) { //becomes O(1)
    const oldPtr  = this._ptr;
    this._ptr = memory.allocate(size);
    if(this._ptr == null) {
      throw new Error('Out of memory');
    }
    memory.copy(this._ptr, oldPtr, this.length);
    memory.free(oldPtr);
    this._capacity = size;
  }
  push(value) { //remains O(n)
    if(this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }
    memory.set(this._ptr + this.length, value);
    this.length++;
  }
  get(index) { //O(1) because only adding to index offset and geting values stored at memory address
    if(index < 0 || index >= this.length) {
      throw new Error('Index error');
    }
    return memory.get(this._ptr + index);
  }
  pop() { //O(1) because just some arithmetic and memory access like the get above
    if(this.length === 0) {
      throw new Error('Index error');
    }
    const value = memory.get(this._ptr + this.length - 1);
    this.length--;
    return value;
  }
  insert(index, value) { //O(n) because worst case is inserting at front of array and shifting all of the existing values in the array first
    if(index < 0 || index >= this.length) {
      throw new Error('Index error');
    }
    if(this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }
    memory.copy(this._ptr + index + 1, this._ptr + index, this.length - index);
    memory.set(this._ptr + index, value);
    this.length++;
  }
  remove(index) { //O(n) for same reason as insert above
    if(index < 0 || index >= this.length) {
      throw new Error('Index error');
    }
    memory.copy(this._ptr + index, this._ptr + index + 1, this.length - 1);
    this.length--;
  }
}


function main() {
  Array.SIZE_RATIO = 3;
  let arr = new Array(); //this is calling array class; if that class is not there, will still work because built-in array class
  // arr.push(3);
  // arr.push(5);
  // arr.push(15);
  // arr.push(19);
  // arr.push(45);
  // arr.push(10);
  // arr.pop();
  // arr.pop();
  // arr.pop();
  // console.log(arr);
  // console.log(arr.get(0)); //should be printing the first item in the array, which is 3
  arr.push('tauhida');
  // console.log(arr.get(0));
}
main();

/** 2
 * arr.push(3): length is 1, capacity is 3, address is 0
 * after adding all the arr.push(): length is 6, capcity is 12, address is 3
 * the capcity is tripling what the length of the array + 1
 * moving the address because cannot fit the new array in the space where the old array was in the memory
 */

/** 3
  * arr.pop(): length is 3, capacity is 12, address is 3
  * 3 values were removed from the length of the array but are still in the same places in memory and will be overwritten when the next method on array is called
  */

/** 4
 * line 99 prints the first item in the array
 * line 101 prints the value of 'tauhida' which is NaN because of line 3 in memory which is expecting a number
 * purpose of _resize(): private function/private variable as noted by the _; changes the size and ptr in memory if needed
 */

//  5
const stringOne = 'tauhida parveen';
const stringTwo = 'www.thinkful.com /tauh ida parv een';
function spaceRemover(string) {
  // string = string.split('');
  // for (let i = 0; i < string.length; i++) {
  //   if(string[i] === ' ') {
  //     string.splice(i, 1, '%20');
  //   }
  // }
  // string = string.join('');
  // // console.log(string);
  // return string;
  let newString = '';
  for(let i=0; i<string.length; i++) {
    if(string[i] === ' ') {
      newString+='%20';
    } else {
      newString += string[i];
    }
  }
  // console.log(newString);
  return newString;
}
spaceRemover(stringOne);


// 6
function filter(array) {
  let results = [];
  for(let i = 0; i < array.length; i++) {
    if(!(array[i] < 5)) {
      results.push(array[i]);
    }
  }
  // console.log(results);
  return results;
}
filter([1,7,325,52,4,0,42,5]);


// 7
function maxSum(arr, n=0, max=arr[0]) {
  if(n === arr.length) {
    // console.log(max);
    return max;
  }
  let sum = 0;
  for(let i = 0; i < n; i++) {
    sum += arr[i];
  }
  max = sum > max ? sum : max;
  maxSum(arr, ++n, max);
}
maxSum([4, 6, -3, 5, -2, 1]);


// 8
function merge(arr1, arr2) {
  let id1=0, id2=0;
  let results = [];
  while(id1 < arr1.length && id2 <arr2.length) {
    if(arr1[id1] <= arr2[id2]) {
      results.push(arr1[id1++]);
    } else {
      results.push(arr2[id2++]);
    }
  }
  if(id2 < arr2.length) {
    id1 = id2;
    arr1 = arr2;
  }
  while(id1 < arr1.length) {
    results.push(arr1[id1++]);
    // console.log(results);
    return results;
  }
}
merge([1, 3, 6, 8, 11], [2, 3, 5, 8, 9, 10]);


// 9
function deleteChar(string, chars) {
  let newString = '';
  for(let i = 0; i < string.length; i++) {
    let currentLetter = string[i];
    for(let j = 0; j < chars.length; j++) {
      if(string[i] === chars[j]) {
        currentLetter = '';
        break;
      }
    }
    newString += currentLetter;
  }
  // console.log(newString);
  return newString;
}
deleteChar('Battle of the Vowels: Hawaii vs. Grozny', 'aeiou');


// 10
function products(array, n=0, max = array.length) {
  if(array.length === max - 1) {
    let product = 1;
    for(let i = 0; i < array.length; i ++) {
      product *= array[i];
    }
    // console.log(product);
    return;
  }
  while(n < max) {
    let copy = [...array];
    copy.splice(n, 1);
    products(copy, ++n, max);
  }
}
products([1, 3, 9, 4]);


// 11
const array = [
  [1,0,1,1,0],
  [0,1,1,1,0],
  [1,1,1,1,1],
  [1,0,1,1,1],
  [1,1,1,1,1]];

function twoDArray(arr) {
  const rows = [];
  const cols = [];

  for (let i = 0; i < arr.length; i++) {
    let row = arr[i];
    for(let j = 0; j < row.length; j++) {
      const item = row[j];
      if(item === 0) {
        rows[i] = true;
        cols[j] = true;
      }
    }
  }
  for (let i = 0; i < arr.length; i++) {
    let row = arr[i];
    for (let j = 0; j <row.length; j++) {
      if(rows[i] || cols[j]) {
        row[j] = 0;
      }
    }
  }
  // console.log(arr);
  return arr;
}
twoDArray(array, 0, 0, 0);


// 12
const trueString = 'azonam';
const falseString = 'azonma';
function rotation(string1, string2) {
  console.log((string2 + string2).indexOf(string1) !== - 1);
}
rotation('amazon', trueString);