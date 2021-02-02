/**
 * Automatically imports all the modules and exports as a single module object
 */
const requireModule = require.context(
  // Look for files in the components/globals directory
  '.',
  // Do not look in subdirectories
  false,
  // Only include ".store.js" files
  /\.store\.js$/
)

const modules = {}
// console.log('[auto load store modules] filename', requireModule)

requireModule.keys().forEach((filename) => {
  // create the module name from fileName
  // remove the store.js extension and capitalize
  const moduleName = filename
    .replace(/(\.\/|\.store\.js)/g, '')
    .replace(/^\w/, c => c.toLowerCase())

  modules[moduleName] = requireModule(filename).default || requireModule(filename)
})

export default modules
