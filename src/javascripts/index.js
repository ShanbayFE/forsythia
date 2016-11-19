/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint max-len: ["off"] */
import Toolbar from './toolbar';
import utils from './utils';

require('../stylesheets/index.less');

class Forsythia {
    constructor(id, options) {
        this.el = document.querySelector(`#${id}`);
        this.el.classList.add('forsythia');

        const defaultOptions = {
            syntax: 'markdown',
            content: '',
            markdownDisabled: [],
            markdownEnableOnly: [],
            onAddImg: () => {},
            onContentChange: () => {},
        };

        this.options = Object.assign({}, defaultOptions, options);
        const markdownTagList = ['heading', 'code', 'table', 'blockquote', 'hr', 'list', 'link', 'autolink', 'emphasis', 'fence', 'lheading', 'escape', 'reference', 'html_block', 'newline', 'backticks'];

        this.md = window.markdownit();

        if (this.options.markdownEnableOnly.length) {
            this.options.markdownDisabled = markdownTagList.filter(lint => !(this.options.markdownEnableOnly.indexOf(lint) !== -1));
        }

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
        currentNode.parentNode.insertBefore(addedNode, currentNode.nextElementSibling);
    }

    getContent() {
        return window.toMarkdown(this.$content.innerHTML);
    }
}

window.Forsythia = Forsythia;
