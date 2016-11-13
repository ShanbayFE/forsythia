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
            name: 'img',
            html: [
                '<div class="forsythia-img-btn">',
                '<input type="file"/>',
                '<i></i>',
                '<span>上传图片</span>',
                '</div>',
            ],
        }];
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

    }
}

export default Toolbar;
