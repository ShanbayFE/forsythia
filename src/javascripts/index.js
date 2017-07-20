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

    renderEditor(content) {
        let html = this.md.render(content);
        const reg = /\^\[text\]\((.*)?\)(.*)?/g;

        html = html.replace(reg, (...args) => `<span style="color: ${args[1]}">${args[2]}</span>`);
        this.editor.clipboard.dangerouslyPasteHTML(html);
    }

    // 渲染编辑器
    render() {
        this.editor = new Quill(`#${this.id}`, {
            modules: { toolbar: this.toolbarOptions },
            theme: 'snow',
        });

        this.renderEditor(this.options.content);

        this.editorEl = this.el.querySelector('.ql-editor');
        this.updateTool();
        this.bindEvents();
    }

    // 绑定事件
    bindEvents() {
        const imgEl = document.querySelector('.forsythia-img-btn');

        imgEl.addEventListener('change', (e) => {
            const files = this.options.isMultiple ? e.target.files : e.target.files[0];
            this.options.onAddImg(files);
        });
    }

    // 设置工具箱
    setToolBarOptions() {
        const { markdownDisabled } = this.options;

        // TODO: 此处对应的格式不全
        // ['italic', 'underline', 'strike']
        // 'heading', 'code', 'table', 'blockquote',
        // 'backticks', 'hr', 'list', 'link', 'emphasis', 'img'
        const options = {
            heading: { header: [1, 2, 3, 4, 5, 6, false] },
            list: [{ list: 'bullet' }, { list: 'ordered' }],
            color: { color: [] },
            code: 'code-block',
            blockquote: 'blockquote',
            img: 'image',
            link: 'link',
        };
        const generalOptions = {
            emphasis: 'bold',
        };

        const toolbarOptions = [];

        Object.keys(options).forEach((key) => {
            if (markdownDisabled.indexOf(key) === -1) {
                if (options[key].constructor === Array) {
                    toolbarOptions.push(options[key]);
                } else {
                    toolbarOptions.push([options[key]]);
                }
            }
        });

        toolbarOptions.push([]);

        // 加在最后一个分组里，yeah~
        Object.keys(generalOptions).forEach((key) => {
            if (markdownDisabled.indexOf(key) === -1) {
                toolbarOptions[toolbarOptions.length - 1].push(options[key]);
            }
        });

        this.toolbarOptions = toolbarOptions;
    }

    // 更新工具箱
    // 更新上传图片按钮
    updateTool() {
        const imgEl = document.querySelector('.ql-image');
        imgEl.outerHTML = `
            <div class="forsythia-img-btn forsythia-toolbar-btn" data-type="image">
                <input type="file" ${this.options.isMultiple ? 'multiple' : ''} />
                <i></i>
                <span>上传图片</span>
            </div>
        `;
    }

    // 插入图片
    insertImage(src, [width, height]) {
        const range = this.editor.getSelection() || {};

        this.editor.insertEmbed(range.index, 'image', src);

        // 增加图片高宽
        const imgsEl = this.editorEl.querySelectorAll(`[src="${src}"]`);

        imgsEl.forEach((el) => {
            el.setAttribute('alt', `${width}/${height}`);
        });
    }

    // 对外提供的接口，更新编辑器内容
    setContent(content) {
        this.renderEditor(content);
    }

    // 对外提供的接口，添加编辑器内容
    addContent(data) {
        if (data.type === 'image') {
            utils.getImageMeasure(data.value, info =>
                this.insertImage(data.value, info),
            );
        }
    }

    // 获得编辑器的内容（markdown 格式）
    getContent() {
        const html = this.editorEl.innerHTML;

        const result = toMarkdown(html, {
            converters: [
                {
                    filter(node) {
                        return node.getAttribute('style');
                    },
                    replacement(content, node) {
                        const style = node.getAttribute('style');
                        const reg = /color:\s(.*)?;/;
                        const colorArr = reg.exec(style);

                        return `^[text](${colorArr[1]})${node.innerHTML}`;
                    },
                },
            ],
        });

        return result;
    }
}

window.Forsythia = Forsythia;
