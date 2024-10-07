import fs from 'fs'
// import Handlebars from 'handlebars'
// import inlineCSS from 'inline-css'
import path from 'path'

// const template = fs.readFileSync
//   ? fs.readFileSync(path.join(__dirname, './template.html'), 'utf8')
//   : ''

// Compile the template
// const getHTML = Handlebars.compile(template)

const generateEmailHTML = async (data): Promise<string> => {
  // const preInlinedCSS = getHTML(data)
  //
  // const html = await inlineCSS(preInlinedCSS, {
  //   url: ' ',
  //   removeStyleTags: false,
  // })

  return `
  <!DOCTYPE html>
    <html lang="en">
    <meta charset="UTF-8">
    <title>Page Title</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="">
    <style>
    html,body {font-family:"Verdana",sans-serif}
    h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",sans-serif}
    </style>
    <script src=""></script>
    <body>
    
    <img src="img_la.jpg" alt="LA" style="width:100%">
    
    <h1>This is a Heading</h1>
    <p>This is a paragraph.</p>
    <p>This is a another paragraph.</p>
    
    </body>
    </html>

  `
}

export default generateEmailHTML
