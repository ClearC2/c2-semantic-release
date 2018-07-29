# c2-semantic-release

A shareable configuration for [semantic-release](https://github.com/semantic-release/semantic-release).

## Install
```
yarn add -D ClearC2/c2-semantic-release#^1.0.0
```

### `package.json`
Add the following to your project's `package.json` file.

```
"scripts": {
  // other scripts
  "cm": "git-cz",
  "semantic-release": "semantic-release"
},
"config": {
  "commitizen": {
    "path": "./node_modules/cz-conventional-changelog"
  }
},
"release": {
  "branch": "<default-branch>",
  "extends": "c2-semantic-release"
},
```

Replace `<default-branch>` with your project's actual default branch. semantic-release will only create releases when the CircleCI build branch matches this branch.

### CircleCI
Next, add the following as a run step in your project's `.circleci/config.yml` file.
```
- run: yarn run semantic-release
```

By default, the release commit done by semantic-release will include any changes to the following after the build:

- `package.json`
- `yarn.lock`
- `CHANGELOG.md`

There shouldn't be any changes to `package.json` or `yarn.lock`(if you have a frozen lockfile). This just ensures that _if_ the build happens to update these files and the build passes, we will get those updates.

If your project produces or changes other assets that you'd like to keep under version control set an `ASSETS` environment variable with the asset names. Ex:
```
- run:
  command: yarn run semantic-release
  environment:
    ASSETS: dist,docs
```

If you don't have a `.circleci/config.yml`, create one using this project's as a template.

Ping me(David Adams) when you get to this step. I will need to add a `GH_TOKEN` environment variable to your project's build on CircleCI for
semantic-release to be able to push releases to GitHub.

## Usage
After you `git add <files>`, use `yarn cm` instead of `git commit` from now on. This will trigger commitizen
to walk you through creating a formatted commit message. The commit will end up in this format:

```
<type>(<scope>): <short imperative subject>
<BLANK LINE>
<a longer description if necessary>
<BLANK LINE>
BREAKING CHANGES: <description of breaking changes>
<BLANK LINE>
<github issue references>
```

Example with breaking changes:
```
refactor(form): rename form HOC

The original export name was ambiguous. The new name conveys its use much more clearly.

BREAKING CHANGES: Renamed "form" export to "formHOC"

closes #154. closes #157.
```

Example without breaking changes, long description, or issue references:
```
feat(project): add project form
```

If you ever mess up in the middle of creating a commit with commitizen, `ctrl + c` to abort and start over.

## Project Maintainers
When squashing and merging a PR that contains multiple commits you will need to reformat the message. Luckily, GitHub let's you do this in the
web UI. For example, if the PR was titled "Add project form" and contained the following commits:

```
- feat(project): add presentational project form component
- feat(project): add redux actions, reducers, selectors
- fix(project): fix typo in selector
- feat(project): add project form container
- refactor(project): restructured container
```

When you go to squash, all of the above will be in the commit message textarea in the GitHub UI. It would be reasonable to delete all of the
above text and retitle the squashed commit `feat(project): add project form`.

### Maintaining a previous major version
- Checkout the latest version tag on that major version. `git checkout v1.3.2`
- Create a maintenance branch for that major version. `git checkout -b 1x`
- Change the release branch name in `package.json` to the maintenance branch name. `1x`
- Commit this change with the `chore` type. Commit message: `chore(1x): create maintenance branch`
- Push this branch. `git push -u origin 1x`
- Create a bug fix branch for you fix. `git checkout -b v1-fixes-thing`
- Add and commit your bug fix.
- Push this branch. `git push -u origin v1-fixes-thing`
- Create a PR to merge the bug fix branch into the maintenance branch.

It's important to create a distinct `chore` commit that doesn't include changes to the code when creating the maintenance branch. This will allow you to
cherry pick the bug fix commit over to your current version branch in a PR without bringing the branch name change in `package.json`.
