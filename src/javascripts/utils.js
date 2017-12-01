/* global Image */
const utils = {
    isDescendant: (parent, child) => {
        let node = child.parentNode;
        let deep = 0;
        while (node != null) {
            deep++;
            if (node === parent) {
                return deep;
            }
            node = node.parentNode;
        }
        return false;
    },

    htmlToNodes: (html) => {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content.childNodes;
    },

    htmlToNode: (html) => {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content.childNodes[0];
    },

    getImageMeasure: (imgUrl, callback = () => {}) => {
        const img = new Image();
        img.onload = () => callback([img.width, img.height]);
        img.src = imgUrl;
    },
    colorRGB2Hex: (color) => {
        const rgb = color.split(',');
        const r = parseInt(rgb[0].split('(')[1], 10);
        const g = parseInt(rgb[1], 10);
        const b = parseInt(rgb[2].split(')')[0], 10);

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)}`;
        return hex;
    },
};

export default utils;
