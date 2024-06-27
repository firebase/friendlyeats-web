const { build } = require('esbuild')
require('dotenv').config()
const args = process.argv.slice(2)
const define = {}

for (const k in process.env) {
  if (k.startsWith('NEXT_')) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k])
    console.log("compiling in", k)
  }
}

const options = {
  entryPoints: ['auth-service-worker.js'],
  outfile: 'public/auth-service-worker.js',
  bundle: true,
  minify: false,
  define
}

build(options).catch(() => process.exit(1))
