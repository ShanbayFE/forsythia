require('../stylesheets/index.less');

import Toolbar from './toolbar';

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

        this.toolbar = new Toolbar(this.el, options);

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

    getContnet() {
        return window.toMarkdown(this.$content.innerHTML);
    }
}

window.Forsythia = Forsythia;
