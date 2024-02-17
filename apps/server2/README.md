```
npm install
npm run start
```

```
open http://localhost:3000
```

```
[
  {
    $setWindowFields: {
      partitionBy: null,
      sortBy: {
        entry: 1,
      },
      output: {
        sideEntries: {
          $addToSet: "$entry",
          window: {
            documents: [-1, 1],
          },
        },
      },
    },
  },
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        entry: "poul",
      },
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        entry: 1,
        variations: 1,
        definitions: 1,
        sideEntries:{ '$filter': {
          input: '$sideEntries',
          as: 's_entry',
          cond: { $ne: ['$$s_entry', 'poul']}
        }
        }
      },
  }
]


[
  {
    $setWindowFields: {
      partitionBy: null,
      sortBy: {
        entry: 1,
      },
      output: {
        sideEntries: {
          $addToSet: "$entry",
          window: {
            documents: [-1, 1],
          },
        },
      },
    },
  },
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        entry: "poul",
      },
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        entry: 1,
        variations: 1,
        definitions: 1,
        sideEntries: {
          $arrayToObject: {
            $map: {
              input: "$sideEntries",
              as: "s_entry",
              in: {
                k: {
                  $cond: {
                    if: {
                      $gt: [
                        "$$s_entry",
                        "$entry",
                      ],
                    },
                    then: {
                      $literal: "next",
                    },
                    else: {
                      $cond: {
                        if: {
                          $lt: [
                            "$$s_entry",
                            "$entry",
                          ],
                        },
                        then: {
                          $literal: "previous",
                        },
                        else: {
                          $literal: "current",
                        },
                      },
                    },
                  },
                },
                v: "$$s_entry",
              },
            },
          },
        },
      },
  },
]
```
