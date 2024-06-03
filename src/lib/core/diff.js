export const areValuesDeepEqual = (obj1, obj2) => {
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (
    ["string", "number", "boolean"].includes(typeof obj1) &&
    ["string", "number", "boolean"].includes(typeof obj2) &&
    obj1 !== obj2
  ) {
    return false;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    return areArraysEqual(obj1, obj2);
  }

  if (typeof obj1 === "function" && typeof obj2 === "function") {
    return obj1.toString() === obj2.toString();
  }

  if (obj1 === null || obj2 === null) {
    return false;
  }

  if (typeof obj1 === "object" && typeof obj2 === "object") {
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }
      if (!areValuesDeepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
  }

  if (obj1 === obj2) {
    return true;
  }

  return true;
};

export const areArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const value1 = arr1[i];
    const value2 = arr2[i];

    if (!areValuesDeepEqual(value1, value2)) {
      return false;
    }
  }

  return true;
};

export function diffArrays(arr1, arr2) {
  let diffIndices = [];

  // Iterate over the longest array
  let maxLength = Math.max(arr1.length, arr2.length);
  for (let i = 0; i < maxLength; i++) {
    if (!areValuesDeepEqual(arr1[i], arr2[i])) {
      diffIndices.push(i);
    }
  }

  return diffIndices;
}

export const testEqualityCheckMethods = () => {
  // Test cases for areValuesDeepEqual function
  console.log(areValuesDeepEqual(5, 5)); // true
  console.log(areValuesDeepEqual("hello", "hello")); // true
  console.log(areValuesDeepEqual(true, true)); // true
  console.log(areValuesDeepEqual([1, 2, 3], [1, 2, 3])); // true
  console.log(
    areValuesDeepEqual(
      () => {},
      () => {}
    )
  ); // true
  console.log(areValuesDeepEqual(null, null)); // false
  console.log(areValuesDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })); // true

  // Test cases for areArraysEqual function
  console.log(areArraysEqual([1, 2, 3], [1, 2, 3])); // true
  console.log(areArraysEqual([1, 2, 3], [1, 2, 4])); // false
  console.log(areArraysEqual(["hello", "world"], ["hello", "world"])); // true
  console.log(areArraysEqual(["hello", "world"], ["hello", "there"])); // false
  console.log(areArraysEqual([true, false], [true, false])); // true
  console.log(areArraysEqual([true, false], [false, true])); // false// Test cases for areValuesDeepEqual function
  console.log(areValuesDeepEqual(5, 5)); // true
  console.log(areValuesDeepEqual("hello", "hello")); // true
  console.log(areValuesDeepEqual(true, true)); // true
  console.log(areValuesDeepEqual([1, 2, 3], [1, 2, 3])); // true
  console.log(
    areValuesDeepEqual(
      () => {},
      () => {}
    )
  ); // true
  console.log(areValuesDeepEqual(null, null)); // false
  console.log(areValuesDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })); // true
  console.log(areValuesDeepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })); // true
  console.log(areValuesDeepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })); // false

  // Test cases for areArraysEqual function
  console.log(areArraysEqual([1, 2, 3], [1, 2, 3])); // true
  console.log(areArraysEqual([1, 2, 3], [1, 2, 4])); // false
  console.log(areArraysEqual([1, 2, [3, 4]], [1, 2, [3, 4]])); // true
  console.log(areArraysEqual([1, 2, [3, 4]], [1, 2, [3, 5]])); // false
};
