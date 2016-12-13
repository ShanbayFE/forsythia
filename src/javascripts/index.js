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

        this.md = window.markdownit({ html: true });
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
            // cancel paste
            e.preventDefault();

            // get text representation of clipboard
            const text = e.clipboardData.getData('text/plain');

            // insert text manually
            document.execCommand('insertHTML', false, text);
        });
    }

    setContent(content) {
        if (this.options.syntax === 'markdown') {
            // Multiple '\n' chars will generate multiple linebreaks.
            const parsedContent = content.replace(/\n/g, '<br>');
            this.$content.innerHTML = this.md.render(parsedContent);
        } else {
            this.$content.innerHTML = content;
        }
    }

    getCurrentNode() {
        const selection = window.getSelection();
        const defaultNode = this.$content.lastElementChild;
        if (!selection || !selection.rangeCount) {
            return defaultNode;
        }
        const range = selection.getRangeAt(0);
        const $node = range.startContainer;
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
                currentNode.parentNode.insertBefore(addedNode, currentNode.nextElementSibling);
            } else {
                this.$content.appendChild(addedNode);
            }
        });
    }

    getContent() {
        return window.toMarkdown(this.$content.innerHTML, {
            converters: [{
                filter: 'br',
                replacement: () => '\n',
            }],
        });
    }
}

window.Forsythia = Forsythia;
