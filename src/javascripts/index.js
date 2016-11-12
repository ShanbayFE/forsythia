require('../stylesheets/index.less');

const md = window.markdownit();
md.disable(['heading', 'code', 'table', 'blockquote',
    'hr', 'list', 'link', 'autolink', 'emphasis', 'fence',
    'lheading', 'escape', 'reference', 'html_block', 'newline', 'backticks']);

class Forsythia {
    constructor(id, options) {
        this.el = document.querySelector(`#${id}`);
        const defaultOptions = {};
        this.options = Object.assign({}, defaultOptions, options);
    }
}

window.Forsythia = Forsythia;
