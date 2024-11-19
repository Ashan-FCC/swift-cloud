import { IndicesIndexSettings } from '@elastic/elasticsearch/lib/api/types'

export const settings: IndicesIndexSettings = {
  index: {
    max_ngram_diff: 18,
  },
  analysis: {
    filter: {
      lowercase_filter: {
        type: 'lowercase',
      },
    },
    tokenizer: {
      edge_ngram_tokenizer: {
        type: 'edge_ngram',
        min_gram: 2,
        max_gram: 20,
        token_chars: ['letter', 'digit'],
      },
    },
    analyzer: {
      edge_ngram_analyzer: {
        type: 'custom',
        tokenizer: 'edge_ngram_tokenizer',
        filter: ['lower_case_filter'],
      },
    },
  },
}
