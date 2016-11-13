require('../stylesheets/index.less');

class Forsythia {
    constructor(id, options) {
        this.el = document.querySelector(`#${id}`);
        const defaultOptions = {
            syntax: 'markdown',
            content: '',
            markdownDisabled: [],
        };
        this.options = Object.assign({}, defaultOptions, options);
        this.content = this.options.content;
        this.md = window.markdownit();
        this.md.disable(this.options.markdownDisabled);
        this.initDom();
    }

    setContent() {
        if (this.options.syntax === 'markdown') {
            this.$content.innerHTML = this.md.render(this.content);
        }
    }

    initDom() {
        this.$toolbar = document.createElement('div');
        this.$toolbar.className = 'editor-toolbar';
        this.$content = document.createElement('div');
        this.$content.className = 'editor-content';

        this.el.appendChild(this.$toolbar);
        this.el.appendChild(this.$content);

        this.el.className += ' forsythia';
        this.$content.setAttribute('contenteditable', true);
        this.setContent();
        this.buildToolbar();
    }

    buildToolbar() {
        const $imgBtn = document.createElement('div');
        $imgBtn.className = 'editor-img-btn';

        const template = {
            img: [
                '<div class="editor-img-btn">',
                '<input type="file"/>',
                '<i></i>',
                '<span>上传图片</span>',
                '</div>',
            ],
        };

        const btns = template.img;

        this.$toolbar.innerHTML = btns.join('');
    }
}

window.Forsythia = Forsythia;
