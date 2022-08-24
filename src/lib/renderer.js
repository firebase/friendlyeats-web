export function mountComponent(parent, cls, props = {}) {
    parent.innerHTML = '';
    const mounter = document.createElement('div');
    const component = new cls({target: mounter, props});
    parent.append(mounter);
    return component;
};
