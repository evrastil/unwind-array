# unwind-array

![Node.js CI](https://github.com/evrastil/unwind-array/workflows/Node.js%20CI/badge.svg)

Unwinds arrays in the similar way like MongoDB $unwind. Supports shallow and deep nested paths, defined as a string with dot notation.


* @param {object} dataObject The object to be unwinded.
* @param {Options} options specify path that can be used define deep mapping using dots.
* @returns {Array<object>} The resulting uwinded array.

```typescript
export declare function unwind(dataObject: object, options: Options): Array<object>
export declare interface Options {
    path: string
    preserveEmptyArray: boolean
}
```

## example usage

unwinding deep path 

```javascript 1.8
    const { unwind } = require('unwind-array')
    const result = unwind(
      {
        title: 'foobar',
        topLevelArr: [
          {
            innerOneArr: [{ innerOnePropertyOne: 'test1' }, { innerOnePropertyTwo: 'test2' }],
            name: 'blah',
            innerTwoArr: [{ innerTwoPropertyThree: 'test8' }],
            innerEmptyArr: []
          },
          {
            name: 'blah2'
          }
        ]
      },
      { path: 'topLevelArr.innerOneArr' }
    )
    expect(result.length).to.be.equal(3)
    expect(result).to.be.deep.equal([
      {
        title: 'foobar',
        topLevelArr: {
          innerEmptyArr: [],
          innerOneArr: {
            innerOnePropertyOne: 'test1'
          },
          name: 'blah',
          innerTwoArr: [
            {
              innerTwoPropertyThree: 'test8'
            }
          ]
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerEmptyArr: [],
          innerOneArr: {
            innerOnePropertyTwo: 'test2'
          },
          name: 'blah',
          innerTwoArr: [
            {
              innerTwoPropertyThree: 'test8'
            }
          ]
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          name: 'blah2'
        }
      }
    ])
```

more advanced usage example of unwinding multiple paths, return combination of data defined paths from arrays

```javascript 1.8
   const { unwind } = require('unwind-array')
  const result = unwind(
      {
        title: 'foobar',
        topLevelArr: [
          {
            innerOneArr: [
              { innerOnePropertyOne: 'test1' },
              { innerOnePropertyTwo: 'test2' },
              { innerOnePropertyThree: 'test3' }
            ],
            name: 'blah',
            innerTwoArr: [
              { innerTwoPropertyOne: 'test5' },
              { innerTwoPropertyTwo: 'test3' },
              { innerTwoPropertyThree: 'test8' }
            ],
            innerThreeArr: [{ innerThreeProperty: 'test1', innerInnerOneArr: [{ num: 1 }, { mum: 2 }] }],
            innerEmptyArr: []
          },
          {
            name: 'blah2'
          }
        ]
      },
      { path: 'topLevelArr' }
    )
      .reduce((agg, item) => [...agg, ...unwind(item, { path: 'topLevelArr.innerOneArr' })], [])
      .reduce(
        (agg, item) => [
          ...agg,
          ...unwind(item, {
            path: 'topLevelArr.innerEmptyArr',
            preserveEmptyArray: true
          })
        ],
        []
      )
      .reduce((agg, item) => [...agg, ...unwind(item, { path: 'topLevelArr.innerThreeArr.innerInnerOneArr' })], [])
      .reduce((agg, item) => [...agg, ...unwind(item, { path: 'topLevelArr.innerTwoArr' })], [])
    expect(result.length).to.be.equal(19)
    expect(result).to.be.deep.equal([
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyOne: 'test1'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyOne: 'test5'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              num: 1
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyOne: 'test1'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyTwo: 'test3'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              num: 1
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyOne: 'test1'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyThree: 'test8'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              num: 1
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyOne: 'test1'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyOne: 'test5'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              mum: 2
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyOne: 'test1'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyTwo: 'test3'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              mum: 2
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyOne: 'test1'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyThree: 'test8'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              mum: 2
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyTwo: 'test2'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyOne: 'test5'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              num: 1
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyTwo: 'test2'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyTwo: 'test3'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              num: 1
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyTwo: 'test2'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyThree: 'test8'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              num: 1
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyTwo: 'test2'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyOne: 'test5'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              mum: 2
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyTwo: 'test2'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyTwo: 'test3'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              mum: 2
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyTwo: 'test2'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyThree: 'test8'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              mum: 2
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyThree: 'test3'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyOne: 'test5'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              num: 1
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyThree: 'test3'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyTwo: 'test3'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              num: 1
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyThree: 'test3'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyThree: 'test8'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              num: 1
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyThree: 'test3'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyOne: 'test5'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              mum: 2
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyThree: 'test3'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyTwo: 'test3'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              mum: 2
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyThree: 'test3'
          },
          name: 'blah',
          innerTwoArr: {
            innerTwoPropertyThree: 'test8'
          },
          innerThreeArr: {
            innerThreeProperty: 'test1',
            innerInnerOneArr: {
              mum: 2
            }
          },
          innerEmptyArr: []
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          name: 'blah2'
        }
      }
    ])
```