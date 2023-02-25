import mongoose from 'mongoose'

const definitionSchema = mongoose.Schema(
  {
    nature: {
      type: [
        {
          type: 'String',
          enum: [
            'adjectif',
            'adverbe',
            'article',
            'conjonction',
            'exclamation',
            'expression',
            'interjection',
            'locution',
            'nom',
            'nom propre',
            'nombre',
            'particule',
            'préfixe',
            'préposition',
            'pronom',
            'suffixe',
            'verbe',
          ],
          required: true,
        },
      ],
    },
    meaning: {
      gp: {
        type: 'String',
      },
      fr: {
        type: 'String',
      },
    },
    usage: {
      type: ['String'],
    },
    synonyms: {
      type: ['String'],
    },
    quotes: {
      type: ['String'],
    },
  },
  { timestamps: true }
)

const wordSchema = mongoose.Schema(
  {
    entry: {
      type: 'String',
      required: true,
      unique: true,
    },
    variations: {
      type: ['String'],
      index: true,
    },
    definitions: {
      gp: {
        type: [definitionSchema],
      },
    },
    publishedAt: {
      type: 'Date',
      default: null,
      index: true,
    },
  },
  { strict: false, timestamps: true }
)

wordSchema.method('toClient', function () {
  var obj = this.toObject()
  obj.definitions.gp.forEach((def) => {
    //Rename fields
    def.id = def._id
    delete def._id
  })

  //Rename fields
  obj.id = obj._id
  delete obj._id

  return obj
})

export const wordModel = mongoose.model('Word', wordSchema)
