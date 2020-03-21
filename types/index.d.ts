/**
 * Unwinds arrays in the similar way like MongoDB $unwind.
 *
 * @param {object} dataObject The object to be unwinded.
 * @param {Options} options specify path that can be used define deep mapping using dots.
 * @returns {Array<object>} The resulting uwinded array.
 */
export declare function unwind(dataObject: object, options: Options): Array<object>

export declare interface Options {
    path: string
    preserveEmptyArray: boolean
}
