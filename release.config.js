module.exports = {
  npmPublish: false,
  verifyConditions: ['@semantic-release/changelog', '@semantic-release/github'],
  prepare: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    {
      path: '@semantic-release/git',
      assets: [
        'package.json',
        'yarn.lock',
        'CHANGELOG.md',
        'docs',
        'dist'
      ]
    }
  ],
  publish: ['@semantic-release/github']
}
