const chai = require('chai')
const { expect } = chai
const { unwind } = require('../src')

describe('Unwind array', () => {
  it('#has expected data for single paths', () => {
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
  })
  it('#has expected data for single paths primitive int array', () => {
    const result = unwind(
      {
        title: 'foobar',
        topLevelArr: [1, 2]
      },
      { path: 'topLevelArr' }
    )
    expect(result.length).to.be.equal(2)
    expect(result).to.be.deep.equal([
      {
        title: 'foobar',
        topLevelArr: 1
      },
      {
        title: 'foobar',
        topLevelArr: 2
      }
    ])
  })
  it('#handles incorrect path', () => {
    const result = unwind(
      {
        title: 'foobar',
        topLevelArr: [
          {
            innerOneArr: [{ innerOnePropertyOne: 'test1' }, { innerOnePropertyTwo: 'test2' }],
            name: 'blah',
            innerEmptyArr: []
          },
          {
            name: 'blah2'
          }
        ]
      },
      { path: 'test' }
    )
    expect(result.length).to.be.equal(1)
    expect(result).to.be.deep.equal([
      {
        title: 'foobar',
        topLevelArr: [
          {
            innerOneArr: [{ innerOnePropertyOne: 'test1' }, { innerOnePropertyTwo: 'test2' }],
            name: 'blah',
            innerEmptyArr: []
          },
          {
            name: 'blah2'
          }
        ]
      }
    ])
  })
  it('#empty array will be removed', () => {
    const result = unwind(
      {
        title: 'foobar',
        topLevelArr: [
          {
            name: 'blah',
            innerEmptyArr: []
          },
          {
            name: 'blah2'
          }
        ]
      },
      { path: 'topLevelArr.innerEmptyArr' }
    )
    expect(result.length).to.be.equal(2)
    expect(result).to.be.deep.equal([
      {
        title: 'foobar',
        topLevelArr: {
          name: 'blah'
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
  it('#array has expected data for single path', () => {
    const result = [
      {
        topLevelProperty: 'test1',
        topLevelPropertyArray: [{ levelOneProperty: 'test3' }, { levelOneProperty: 'test4' }]
      },
      { topLevelProperty: 'test2' }
    ]
      .map(piece => unwind(piece, { path: 'topLevelPropertyArray' }))
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
  })
})
