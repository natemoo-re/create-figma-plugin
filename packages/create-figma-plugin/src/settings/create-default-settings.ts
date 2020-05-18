import { constants } from '@create-figma-plugin/common'
import * as gitUserName from 'git-user-name'

import { Settings } from '../types/settings'
import { createPluginDisplayName } from './create-plugin-display-name'

export function createDefaultSettings(options: Settings): Settings {
  const { name, template } = options
  const author = gitUserName()
  return {
    name:
      typeof name === 'undefined'
        ? constants.packageJson.defaultPluginName
        : name,
    displayName:
      typeof name === 'undefined'
        ? constants.packageJson.defaultPluginDisplayName
        : createPluginDisplayName(name),
    template:
      typeof template === 'undefined' ? constants.defaultTemplate : template,
    version: constants.packageJson.defaultVersion,
    author: author === null ? undefined : author,
    license: constants.packageJson.defaultLicense
  }
}
