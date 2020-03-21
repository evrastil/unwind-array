/**
 * Unwinds arrays in the similar way like MongoDB $unwind.
 *
 * @param {object} dataObject The object to be unwinded.
 * @param {string} path The path to unwind.
 * @returns {object} The resulting uwinded array.
 */
export declare function unwindArrays(dataObject: object, path: string): Array<object>
