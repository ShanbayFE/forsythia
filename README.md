# Forsythia

> A WYSIWYG(what you see is what you get) HTML text editors.

This project is **working in progress**.

# Basic Usage

The easiest way to use Forsythia is to load the built stylesheet and scripts:

```html
<link rel="stylesheet" href="forsythia.css" />
<script type="text/javascript" src="forsythia.js"></script>
```

You can also use the baydn(Shanbay CDN):

```html
<link rel="stylesheet" href="https://static.baydn.com/baydn/public/forsythia/v1.1.0/forsythia.css" />
<script type="text/javascript" src="https://static.baydn.com/baydn/public/forsythia/v1.1.0/forsythia.js"></script>
```

Having include the dependencies, an editor instance can be created:

```js
var forsythia = new Forsythia('editor', {
    syntax: 'markdown',
    content: 'Hello world',
    onAddImg: function(file) {
        console.log(file);
    },
    isMultiple: false,
    markdownDisabled: ['heading', 'color', 'blockquote', 'code', 'list', 'link', 'image', 'emphasis',  'strikethrough'],
});
```

Just by passing `markdownDisabled` option, You can easily disable some markdown rules like heading, code and so on.

The callBack `onAddImg` is triggerred when the user has selected a file in toolbar.

## Set the content

You can reset the whole content of the editor by the following code:

```js
forsythia.setContent('# Hello world');
```

Or just add some content like image:

```js
var url = 'https://xbay.17bdc.com/images/logo.png';
forsythia.addContent({type: 'image', value: url});
```

## Get the content

To get the content of the editor you can use:

```js
forsythia.getContent();
```
