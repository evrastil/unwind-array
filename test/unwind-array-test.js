const chai = require('chai')
const { expect } = chai
const { unwindArrays } = require('../src')

describe('Unwind array', () => {
  const testDataObject = {
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
  }

  it('#has expected data for single paths', () => {
    const result = unwindArrays(testDataObject, 'topLevelArr.innerOneArr')
    expect(result.length).to.be.equal(4)
    expect(result).to.be.deep.equal([
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyOne: 'test1'
          },
          name: 'blah',
          innerTwoArr: [
            {
              innerTwoPropertyOne: 'test5'
            },
            {
              innerTwoPropertyTwo: 'test3'
            },
            {
              innerTwoPropertyThree: 'test8'
            }
          ],
          innerThreeArr: [
            {
              innerThreeProperty: 'test1',
              innerInnerOneArr: [
                {
                  num: 1
                },
                {
                  mum: 2
                }
              ]
            }
          ]
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyTwo: 'test2'
          },
          name: 'blah',
          innerTwoArr: [
            {
              innerTwoPropertyOne: 'test5'
            },
            {
              innerTwoPropertyTwo: 'test3'
            },
            {
              innerTwoPropertyThree: 'test8'
            }
          ],
          innerThreeArr: [
            {
              innerThreeProperty: 'test1',
              innerInnerOneArr: [
                {
                  num: 1
                },
                {
                  mum: 2
                }
              ]
            }
          ]
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          innerOneArr: {
            innerOnePropertyThree: 'test3'
          },
          name: 'blah',
          innerTwoArr: [
            {
              innerTwoPropertyOne: 'test5'
            },
            {
              innerTwoPropertyTwo: 'test3'
            },
            {
              innerTwoPropertyThree: 'test8'
            }
          ],
          innerThreeArr: [
            {
              innerThreeProperty: 'test1',
              innerInnerOneArr: [
                {
                  num: 1
                },
                {
                  mum: 2
                }
              ]
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
  })
  it('#handles incorrect path', () => {
    const result = unwindArrays(testDataObject, 'test')
    expect(result.length).to.be.equal(1)
    expect(result).to.be.deep.equal([testDataObject])
  })
  const testArray = [
    {
      topLevelProperty: 'test1',
      topLevelPropertyArray: [{ levelOneProperty: 'test3' }, { levelOneProperty: 'test4' }]
    },
    { topLevelProperty: 'test2' }
  ]
  it('#array has expected data for single path', () => {
    const result = testArray
      .map(piece => unwindArrays(piece, 'topLevelPropertyArray'))
      .reduce((agg, arr) => {
        return [...agg, ...arr]
      }, [])
    expect(result.length).to.be.equal(3)
    expect(result).to.be.deep.equal([
      {
        topLevelProperty: 'test1',
        topLevelPropertyArray: {
          levelOneProperty: 'test3'
        }
      },
      {
        topLevelProperty: 'test1',
        topLevelPropertyArray: {
          levelOneProperty: 'test4'
        }
      },
      {
        topLevelProperty: 'test2'
      }
    ])
  })
  it('#has combination of expected data for multiple paths', () => {
    const result = unwindArrays(testDataObject, 'topLevelArr')
      .reduce((agg, item) => [...agg, ...unwindArrays(item, 'topLevelArr.innerOneArr')], [])
      .reduce((agg, item) => [...agg, ...unwindArrays(item, 'topLevelArr.innerEmptyArr')], [])
      .reduce((agg, item) => [...agg, ...unwindArrays(item, 'topLevelArr.innerThreeArr.innerInnerOneArr')], [])
      .reduce((agg, item) => [...agg, ...unwindArrays(item, 'topLevelArr.innerTwoArr')], [])
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
        }
      },
      {
        title: 'foobar',
        topLevelArr: {
          name: 'blah2'
        }
      }
    ])
  })
})
