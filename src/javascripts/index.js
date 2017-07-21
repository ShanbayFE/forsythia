require('../stylesheets/index.less');

import MarkdownIt from 'markdown-it';
import toMarkdown from 'to-markdown';
import Quill from 'quill';

import utils from './utils';

class Forsythia {
    constructor(id, options) {
        this.id = id;
        this.el = document.querySelector(`#${id}`);

        const defaultDisabledOptions = ['fence', 'lheading', 'reference', 'html_block', 'newline', 'autolink', 'html_inline'];
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

        const markdownDisabled = this.options.markdownDisabled.filter(item => item !== 'color');

        this.md = new MarkdownIt({ html: true, breaks: true });
        this.md.disable(markdownDisabled);

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

        if (imgEl) {
            imgEl.addEventListener('change', (e) => {
                const files = this.options.isMultiple ? e.target.files : e.target.files[0];
                this.options.onAddImg(files);
            });
        }
    }

    // 设置工具箱
    setToolBarOptions() {
        const { markdownDisabled } = this.options;

        const options = {
            heading: { header: [1, 2, 3, 4, 5, 6, false] },
            generalOptions: [],
            color: { color: [] },
            blockquote: 'blockquote',
            code: 'code-block',
            list: [{ list: 'bullet' }, { list: 'ordered' }],
            link: 'link',
            image: 'image',
        };
        const generalOptions = {
            emphasis: ['bold', 'italic'],
            html_inline: 'underline',
            strikethrough: 'strike',
        };

        const toolbarOptions = [];

        Object.keys(options).forEach((key) => {
            if (markdownDisabled.indexOf(key) !== -1) {
                return;
            }

            if (key === 'generalOptions') {
                // 加在一个分组里，yeah~
                toolbarOptions.push([]);
                const arr = toolbarOptions[toolbarOptions.length - 1];
                Object.keys(generalOptions).forEach((nestKey) => {
                    if (markdownDisabled.indexOf(nestKey) !== -1) {
                        return;
                    }

                    const option = generalOptions[nestKey];

                    if (option.constructor === Array) {
                        Array.prototype.push.apply(arr, option);
                    } else {
                        arr.push(option);
                    }
                });
            } else if (options[key].constructor === Array) {
                toolbarOptions.push(options[key]);
            } else {
                toolbarOptions.push([options[key]]);
            }
        });

        this.toolbarOptions = toolbarOptions;
    }

    // 更新工具箱
    // 更新上传图片按钮
    updateTool() {
        const imgEl = document.querySelector('.ql-image');

        if (imgEl) {
            imgEl.outerHTML = `
            <div class="forsythia-img-btn forsythia-toolbar-btn" data-type="image">
                <input type="file" ${this.options.isMultiple ? 'multiple' : ''} />
                <i></i>
                <span>上传图片</span>
            </div>
            `;
        }
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

    // 对外提供的接口，获得编辑器的内容（markdown 格式）
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
                {
                    filter(node) {
                        return node.nodeName === 'S';
                    },
                    replacement(content, node) {
                        return `~~${node.innerHTML}~~`;
                    },
                },
            ],
        });

        return result;
    }
}

window.Forsythia = Forsythia;
