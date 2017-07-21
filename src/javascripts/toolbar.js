
class Toolbar {
    constructor($forsythia, options) {
        this.$forsythia = $forsythia;
        this.el = document.createElement('div');
        this.el.className = 'forsythia-toolbar';
        this.$forsythia.appendChild(this.el);

        const defaultOptions = {
            disabledOptions: [],
        };
        this.options = Object.assign({}, defaultOptions, options);

        this.buildMenu();
        this.bindEvents();

    }

    buildMenu() {
        const templates = [{
            name: 'emphasis',
            html: ['<p class="">B</p>'],
        }, {
            name: 'image',
            html: [
                '<div class="forsythia-toolbar-btn forsythia-head-btn" data-value="1">',
                '<a href="javascript:;">',
                'H1',
                '</a>',
                '</div>',
                '<div class="forsythia-img-btn forsythia-toolbar-btn" data-type="image">',
                `<input type="file" ${this.options.isMultiple ? 'multiple' : ''}/>`,
                '<i></i>',
                '<span>上传图片</span>',
                '</div>',
            ],
        },];
        const filteredTemplates = [];

        templates
            .filter(item => this.options.disabledOptions.indexOf(item.name) === -1)
            .forEach(item => filteredTemplates.push(...(item.html)));

        // when all menu options are disabled, remove the toolbar element
        if (!filteredTemplates.length) {
            this.el.remove();
        }
        this.el.innerHTML = filteredTemplates.join('');
    }

    bindEvents() {
        const $input = this.el.querySelector('input');
        $input.addEventListener('change', (e) => {
            const files = this.options.isMultiple ? e.target.files : e.target.files[0];
            this.options.onAddImg(files);
        });
    }
}

export default Toolbar;
