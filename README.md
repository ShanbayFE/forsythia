# Forsythia

> A WYSIWYG(what you see is what you get) HTML text editors

# Basic Usage

The easiest way to use Forsythia is to simply load the script and stylesheet:

```html
<link rel="stylesheet" href="forsythia.css" />
<script type="text/javascript" src="markdown-it.js"></script>
<script type="text/javascript" src="to-markdown.js"></script>
<script type="text/javascript" src="forsythia.js"></script>
```

You can also use the baydn(Shanbay CDN):

```html
<link rel="stylesheet" href="forsythia.css" />
<script type="text/javascript" src="forsythia.js"></script>
<script type="text/javascript" src="markdown-it.js"></script>
<script type="text/javascript" src="to-markdown.js"></script>
```

Having done this, an editor instance can be created:

```js
var forsythia = new Forsythia('editor', {
    syntax: 'markdown',
    content: 'Hello world',
    onAddImg: function(file) {
        console.log(file);
    },
    markdownDisabled: ['heading', 'code', 'table', 'blockquote',
        'hr', 'list', 'link', 'autolink', 'emphasis', 'fence',
        'lheading', 'escape', 'reference', 'html_block', 'newline', 'backticks'],
});
```

Just by passing `markdownDisabled` option, You can easily disable some markdown rules like heading, code and so on.

The callBack `onAddImg` is triggerred when the user has selected a file in toolbar.

## Get the content

To get the content of the editor you can use:

```js
forsythia.getContent();
```

## Set the content

You can reset the whole content of the editor by the following code:

```js
forsythia.getContent();
```

Or just add some content like image:

```js
var url = 'https://xbay.17bdc.com/images/logo.png';
forsythia.addContent({type: 'image', value: url});
```
