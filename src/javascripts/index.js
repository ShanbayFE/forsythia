require('../stylesheets/index.less');

import Toolbar from './toolbar';
import utils from './utils';

class Forsythia {
    constructor(id, options) {
        this.el = document.querySelector(`#${id}`);
        this.el.className += ' forsythia';

        const defaultOptions = {
            syntax: 'markdown',
            content: '',
            markdownDisabled: [],
            onContentChange: () => {},
            onAddImg: () => {},
        };
        this.options = Object.assign({}, defaultOptions, options);

        this.md = window.markdownit({ html: true, breaks: true });
        this.md.disable(this.options.markdownDisabled);

        this.toolbar = new Toolbar(this.el, this.options);

        this.initContent();
        this.bindEvents();
    }

    initContent() {
        this.$content = document.createElement('div');
        this.$content.className = 'forsythia-content';

        this.el.appendChild(this.$content);

        this.$content.setAttribute('contenteditable', true);
        this.setContent(this.options.content);
    }

    formatContent(content) {
        // A span tag is needed for getting the currentNode.
        return content.replace(/\n/g, '<br>');
    }

    bindEvents() {
        this.$content.addEventListener('keydown', e => {
            if (!this.getContent().length) {
                // p must have the content
                this.$content.innerHTML = '<p><br></p>';
            }

            if (e.keyCode === 13) {
                document.execCommand('formatBlock', false, 'p');
            }
        });

        this.$content.addEventListener('paste', e => {
            if (!e.clipboardData) return;

            // cancel paste
            e.preventDefault();

            // get text representation of clipboard
            const pastedContent = e.clipboardData.getData('text/plain');

            if (!this.$content.querySelector('p')) {
                this.$content.innerHTML = `<p>${text}</p>`;
            } else {
                // insert text manually
                document.execCommand('insertHTML', false, pastedContent);
            }
        });
    }

    setContent(content) {
        if (this.options.syntax === 'markdown') {
            // Multiple '\n' chars will generate multiple linebreaks.
            this.$content.innerHTML = this.md.render(content);
        } else {
            this.$content.innerHTML = content;
        }
    }

    getRange() {
        const selection = window.getSelection();
        return selection && selection.getRangeAt(0);
    }

    getCurrentNode() {
        const selection = window.getSelection();
        const defaultNode = this.$content.lastElementChild;
        if (!selection || !selection.rangeCount) {
            return defaultNode;
        }
        const range = selection.getRangeAt(0);
        const $startContainer = range.startContainer;
        let $node = $startContainer;
        if ($startContainer.childNodes.length) {
            // If the cursor is in the right of the image,
            // currentNode should be image node, not the next node.
            // Correct it:
            const $beforeNode = $startContainer.childNodes[range.startOffset - 1];
            if ($beforeNode && $beforeNode.nodeName === 'IMG') {
                $node = $beforeNode;
            } else {
                $node = $startContainer.childNodes[range.startOffset];
            }
        }
        if ($node && utils.isDescendant(this.$content, $node)) {
            return $node;
        }
        return defaultNode;
    }

    addContent(data) {
        let html = '';
        utils.getImageMeasure(data.value, ([imgWidth, imgHeight]) => {
            switch (data.type) {
            case 'image':
                html = `<img src="${data.value}" alt="image/${imgWidth}/${imgHeight}"/>`;
                break;
            default:
                html = data.value;
            }
            const currentNode = this.getCurrentNode();
            const addedNode = utils.htmlToNode(html);
            if (currentNode) {
                currentNode.parentNode.insertBefore(addedNode, currentNode.nextSibling);
            } else {
                if (!this.$content.querySelector('p')) {
                    this.$content.innerHTML = '<p><br></p>';
                }
                this.$content.querySelector('p').appendChild(addedNode);
            }
        });
    }

    getContent() {
        // Need to remove unnecessary p tag.
        // Because unnecessary p tag will generate multiple '\n' chars by to-markdown plugin.
        let parsedContent = this.$content.innerHTML.replace(/<p><br><\/p>/g, '<br>');
        // Need to add br tag for linebreaks.
        // Because custom converters add a filter to remove default '\n\n' chars for p tag.
        parsedContent = parsedContent.replace(/<\/p>/g, '</p><br>');
        return window.toMarkdown(parsedContent, {
            converters: [{
                filter: 'br',
                replacement: () => '\n',
            }, {
                filter: 'p',
                replacement: content => content,
            }],
        });
    }
}

window.Forsythia = Forsythia;
