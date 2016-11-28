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

    htmlToNodes: html => {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content.childNodes;
    },

    htmlToNode: html => {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content.childNodes[0];
    },

    getImageMeasure: (imgUrl, callback = () => {}) => {
        const img = new Image();
        img.onload = () => callback([img.width, img.height]);
        img.src = imgUrl;
    },
};

export default utils;
