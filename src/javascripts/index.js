require('../stylesheets/index.less');

class Forsythia {
    constructor(id, options) {
        this.el = document.querySelector(`#${id}`);
        const defaultOptions = {};
        this.options = Object.assign({}, defaultOptions, options);
        this.content = this.options.content;
        this.md = window.markdownit();
        // this.md.disable(['heading', 'code', 'table', 'blockquote',
        //     'hr', 'list', 'link', 'autolink', 'emphasis', 'fence',
        //     'lheading', 'escape', 'reference', 'html_block', 'newline', 'backticks']);
        this.initDom();
    }

    setContent() {
        if (this.options.syntax === 'markdown') {
            this.el.innerHTML = this.md.render(this.content);
        }
    }

    initDom() {
        this.el.className += ' forsythia';
        this.el.setAttribute('contenteditable', true);
        this.setContent();
    }
}

window.Forsythia = Forsythia;
