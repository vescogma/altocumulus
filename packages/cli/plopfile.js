import listDeployFunction from './src/list-deploy-functions.js'
import prepCloudFunction from './src/prep-cloud-function.js'

/**
 * @param {import('plop').NodePlopAPI} plop
 */
export default function main(plop) {
  listDeployFunction(plop)
  prepCloudFunction(plop)
}
