module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [2, 'always', [
        'feat',
        'fix',
        'style',
        'chore',
        'refactor',
        'docs',
        'test',
        'perf',
        'ci'
      ]]
    }
  };
  