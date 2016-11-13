const utils = {
    isDescendant: (parent, child) => {
        let node = child.parentNode;
        while (node != null) {
            if (node === parent) {
                return true;
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
};

export default utils;
