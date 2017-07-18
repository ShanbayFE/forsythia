require('../stylesheets/index.less');

import utils from './utils';

class Forsythia {
    constructor(id, options) {
        this.id = id;
        this.el = document.querySelector(`#${id}`);

        const defaultDisabledOptions = ['fence', 'lheading', 'reference', 'html_block', 'newline', 'autolink'];
        const defaultOptions = {
            syntax: 'markdown',
            content: '',
            // 'heading', 'code', 'table', 'blockquote',
            //     'backticks', 'hr', 'list', 'link', 'emphasis', 'img'
            markdownDisabled: [],
            onContentChange: () => {},
            onAddImg: () => {},
        };

        this.options = Object.assign({}, defaultOptions, options);
        this.options.markdownDisabled = [
            ...defaultDisabledOptions,
            ...this.options.markdownDisabled,
        ];
        this.md = window.markdownit({ html: true, breaks: true });
        this.md.disable(this.options.markdownDisabled);

        this.setToolBarOptions();
        this.render();

        this.insertImage = this.insertImage.bind(this);
    }

    setToolBarOptions() {
        const options = {
            heading: 'size',
            emphasis: 'bold',
            list: 'list',
            color: 'color',
        };
        const allToolbarOptions = [
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }],
            ['link'],
        ];

        this.toolbarOptions = allToolbarOptions;
    }

    render() {
        const html = this.md.render(this.options.content);

        this.el.innerHTML = html;
        this.editor = new Quill(`#${this.id}`, {
            modules: { toolbar: this.toolbarOptions },
            theme: 'snow',
        });
        this.editorEl = this.el.querySelector('.ql-editor');
    }

    update(content) {
        const html = this.md.render(content);

        this.editorEl.innerHTML = html;
    }

    setContent(content) {
        this.update(content);
    }

    addContent(data) {
        if (data.type === 'image') {
            utils.getImageMeasure(data.value, info =>
                this.insertImage(data.value, info),
            );
        }
    }

    insertImage(src, [width, height]) {
        const range = this.editor.getSelection() || {};

        this.editor.insertEmbed(range.index, 'image', src);

        // 增加图片高宽
        const imgsEl = this.editorEl.querySelectorAll(`[src="${src}"]`);

        imgsEl.forEach((el) => {
            el.setAttribute('alt', `${width}/${height}`);
        });
    }

    getContent() {
        const html = this.editorEl.innerHTML;

        const result = toMarkdown(html, {
            converters: [
                {
                    filter(node) {
                        return node.getAttribute('style');
                    },
                    replacement(content, node) {
                        return node.outerHTML;
                    },
                },
            ],
        });

        return result;
    }
}

window.Forsythia = Forsythia;
