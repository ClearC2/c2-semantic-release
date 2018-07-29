let assets = [
  'package.json',
  'yarn.lock',
  'CHANGELOG.md'
]

const assetsEnv = String(process.env.ASSETS || '').trim()
if (assetsEnv.length > 0) {
  const additionalAssets = assetsEnv.split(',')
  assets = assets.concat(additionalAssets)
}

module.exports = {
  npmPublish: false,
  verifyConditions: ['@semantic-release/changelog', '@semantic-release/github'],
  prepare: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    {
      path: '@semantic-release/git',
      assets: assets
    }
  ],
  publish: ['@semantic-release/github']
}
