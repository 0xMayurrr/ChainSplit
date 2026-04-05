const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'stitch-screens');
const destDir = path.join(__dirname, 'src', 'pages');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function kebabToCamelCase(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function htmlToJsx(html) {
  let jsx = html;
  
  // class to className
  jsx = jsx.replace(/class=/g, 'className=');
  // for to htmlFor
  jsx = jsx.replace(/ for=/g, ' htmlFor=');
  
  // self closing tags
  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
  selfClosingTags.forEach(tag => {
    // regex to find unclosed tags and close them
    // like <img ... > to <img ... />
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    jsx = jsx.replace(regex, `<${tag}$1 />`);
  });

  // SVG specific attributes (strok-width, fill-opacity, fill-rule, stroke-linecap, stroke-linejoin, clip-rule)
  const svgAttrs = ['stroke-width', 'fill-opacity', 'fill-rule', 'stroke-linecap', 'stroke-linejoin', 'clip-rule', 'stroke-dasharray', 'stroke-dashoffset'];
  svgAttrs.forEach(attr => {
    const camel = kebabToCamelCase(attr);
    const regex = new RegExp(`${attr}=`, 'g');
    jsx = jsx.replace(regex, `${camel}=`);
  });

  // HTML comments to JSX comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  return jsx;
}

const files = fs.readdirSync(srcDir);
files.forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(srcDir, file);
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Extract body
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let bodyHtml = bodyMatch ? bodyMatch[1] : html;
    
    const jsx = htmlToJsx(bodyHtml);
    
    // Generate component name from filename (e.g., 1_Landing_Page.html -> LandingPage)
    // 9_Profile_Settings.html -> ProfileSettings
    let compName = file.replace(/^\d+_/, '').replace('.html', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    
    const componentCode = `// @ts-nocheck\nexport default function ${compName}() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`;
    
    const destPath = path.join(destDir, `${compName}.tsx`);
    fs.writeFileSync(destPath, componentCode, 'utf-8');
    console.log(`Converted ${file} to ${compName}.tsx`);
  }
});
