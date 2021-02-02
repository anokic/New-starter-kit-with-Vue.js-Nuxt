// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from 'vue'

try {
  // https://webpack.js.org/guides/dependency-management/#require-context
  const components = require.context(
    // Look for files in the components/globals directory
    '@/components/global',
    // Do not look in subdirectories
    false,
    // Only include .vue files
    /[A-Z]\w+\.(vue)$/
  )

  // For each matching file name...
  components.keys().forEach((fileName) => {
    // Get the component config
    const componentConfig = components(fileName)
    const componentName = fileName
      .split('/')
      .pop()
      .split('.')[0]

    // Globally register the component
    Vue.component(componentName, componentConfig.default || componentConfig)
  })
} catch (err) {
  console.error('ERROR: global-components', err)
}
