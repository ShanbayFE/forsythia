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
        const $parentNode = range.startContainer.parentNode;
        if ($parentNode && utils.isDescendant(this.$content, $parentNode)) {
            return $parentNode;
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
        currentNode.parentNode.insertBefore(addedNode, currentNode.nextSibling);
    }

    getContent() {
        return window.toMarkdown(this.$content.innerHTML);
    }
}

window.Forsythia = Forsythia;
