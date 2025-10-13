import path from 'path'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import Unfonts from 'unplugin-fonts/vite'
import dns from 'dns'

// https://vitejs.dev/config/
dns.setDefaultResultOrder('verbatim')
export default async function config() {
  let server
  // check whether HTTPS is true
  if (process.env.HTTPS === 'true') {
    // please use mkcert to generate the certificate on your local machine
    const key = fs.readFileSync(path.resolve(__dirname, './localhost-key.pem'))
    const cert = fs.readFileSync(path.resolve(__dirname, './localhost.pem'))
    server = {
      https: { key, cert },
    }
  }

  return {
    plugins: [
      Unfonts({
        /* options */
        // Google Fonts API V2
        google: {
          /**
           * enable preconnect link injection
           *   <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
           * default: true
           */
          preconnect: true,

          /**
           * define where the font load tags should be inserted
           * default: 'head-prepend'
           *   values: 'head' | 'body' | 'head-prepend' | 'body-prepend'
           */
          injectTo: 'head-prepend',

          /**
           * Fonts families lists
           */
          families: [
            {
              name: 'Noto Sans TC',
              styles: 'wght@300;400;500;700',
              defer: true,
            },
            {
              name: 'Oepn Sans',
              styles: 'wght@400;600',
              defer: true,
            },
          ],
        },
      }),
      react(),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    server,
  }
}
