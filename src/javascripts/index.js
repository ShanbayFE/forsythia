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

        this.md = window.markdownit();
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
        this.$content.addEventListener('keydown', () => {
            if (!this.getContent().length) {
                // p must have the content
                this.$content.innerHTML = '<p><br></p>';
            }
        });
    }

    setContent(content) {
        if (this.options.syntax === 'markdown') {
            this.$content.innerHTML = this.md.render(content);
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
        switch (data.type) {
        case 'image':
            html = `<img src="${data.value}" alt="image"/>`;
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

    }

    getContent() {
        return window.toMarkdown(this.$content.innerHTML);
    }
}

window.Forsythia = Forsythia;
