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

    focusNode(node) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.setStartAfter(node);
        range.setEndBefore(node);
        range.collapse(false);
        this.setRange(range);
    },

    setRange(range) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    },
};

export default utils;
