const { Telegraph, Parser } = require('../dist');
require('dotenv').config();

const TOKEN = process.env.TELEGRAPH_ACCESS_TOKEN;

const client = new Telegraph(TOKEN);
const content = `# Header
## Header but smaller

---

Item list :
- Item 1 with _italic_
- Item 2 with *bold*
- Item 3 with *bold* and _italic_
- Item 4 with ~strikethrough~
- Item 5 with Hyperlink [nugraizy](https://github.com/nugraizy)

> Blockquote _edited_

\`\`\`js
function spawnCatWithCaption(){
  // code to spawn cat
}

spawnCatWithCaption()
\`\`\`
<figure>
<img src="https://cataas.com/cat">
<figcaption>I Love Cats.</figcaption>
</figure>`;
(async () => {
  const parsed = Parser.parse(content, 'markdown');

  const page = await client.editPage({
    author_name: 'nugraizy',
    author_url: 'https://authorurl.com',
    content: parsed,
    path: 'Example-Article-09-28',
    return_content: false,
    title: 'Example Article Edited',
  });

  console.log(page.url);
})();
