const schema = {
  class: 'Bookmark',
  description: 'bookmark collection',
  vectorIndexType: 'hnsw',
  vectorizer: 'text2vec-transformers',
  invertedIndexConfig: {
    indexNullState: true,
  },
  moduleConfig: {
    'text2vec-transformers': {
      vectorizeClassName: false, // Include the class name in vector calculation (default true)
    },
  },
  properties: [
    {
      name: 'content',
      description: 'Text content of bookmark',
      dataType: ['text'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: false,
          vectorizePropertyName: false,
        },
      },
    },
    {
      name: 'title',
      description: 'Title of the website',
      dataType: ['text'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: false,
          vectorizePropertyName: false,
        },
      },
    },
    {
      name: 'description',
      description: 'Description of the website',
      dataType: ['text'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: false,
          vectorizePropertyName: false,
        },
      },
    },

    {
      name: 'userDescription',
      description: 'User description of the website',
      dataType: ['text'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: false,
          vectorizePropertyName: false,
        },
      },
    },
    {
      name: 'tags',
      description: 'User-defined tags',
      dataType: ['text[]'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: true,
          vectorizePropertyName: false,
        },
      },
    },
    {
      name: 'date',
      description: 'Date of bookmark',
      dataType: ['date'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: true,
          vectorizePropertyName: false,
        },
      },
    },
    {
      name: 'bookmarkID',
      description: 'Associated bookmark id',
      dataType: ['text'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: true,
          vectorizePropertyName: false,
        },
      },
    },
    {
      name: 'userID',
      description: 'Associated user id for more pre-filtering',
      dataType: ['text'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: true,
          vectorizePropertyName: false,
        },
      },
    },
    {
      name: 'summary',
      description: 'Summary of content',
      dataType: ['text'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: false,
          vectorizePropertyName: false,
        },
      },
    },
    {
      name: 'url',
      description: 'Url of content',
      dataType: ['text'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: false,
          vectorizePropertyName: true,
        },
      },
    },
    {
      name: 'user',
      description: 'Associated user',
      dataType: ['text'],
      moduleConfig: {
        'text2vec-transformers': {
          skip: true,
          vectorizePropertyName: false,
        },
      },
    },
  ],
};

export default schema;
