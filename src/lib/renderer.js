export function render(el, data) {
    if (!data) {
      return;
    }
  
    var modifiers = {
      'data-fir-foreach': function(tel) {
        var field = tel.getAttribute('data-fir-foreach');
        var values = getDeepItem(data, field);
  
        values.forEach(function(value, index) {
          var cloneTel = tel.cloneNode(true);
          tel.parentNode.append(cloneTel);
  
          Object.keys(modifiers).forEach(function(selector) {
            var children = Array.prototype.slice.call(
              cloneTel.querySelectorAll('[' + selector + ']')
            );
            children.push(cloneTel);
            children.forEach(function(childEl) {
              var currentVal = childEl.getAttribute(selector);
  
              if (!currentVal) {
                return;
              }
              childEl.setAttribute(
                selector,
                currentVal.replace('~', field + '/' + index)
              );
            });
          });
        });
  
        tel.parentNode.removeChild(tel);
      },
      'data-fir-content': function(tel) {
        var field = tel.getAttribute('data-fir-content');
        tel.innerText = getDeepItem(data, field);
      },
      'data-fir-click': function(tel) {
        tel.addEventListener('click', function() {
          var field = tel.getAttribute('data-fir-click');
          getDeepItem(data, field)();
        });
      },
      'data-fir-if': function(tel) {
        var field = tel.getAttribute('data-fir-if');
        if (!getDeepItem(data, field)) {
          tel.style.display = 'none';
        }
      },
      'data-fir-if-not': function(tel) {
        var field = tel.getAttribute('data-fir-if-not');
        if (getDeepItem(data, field)) {
          tel.style.display = 'none';
        }
      },
      'data-fir-attr': function(tel) {
        var chunks = tel.getAttribute('data-fir-attr').split(':');
        var attr = chunks[0];
        var field = chunks[1];
        tel.setAttribute(attr, getDeepItem(data, field));
      },
      'data-fir-style': function(tel) {
        var chunks = tel.getAttribute('data-fir-style').split(':');
        var attr = chunks[0];
        var field = chunks[1];
        var value = getDeepItem(data, field);
  
        if (attr.toLowerCase() === 'backgroundimage') {
          value = 'url(' + value + ')';
        }
        tel.style[attr] = value;
      }
    };
  
    var preModifiers = ['data-fir-foreach'];
  
    preModifiers.forEach(function(selector) {
      var modifier = modifiers[selector];
      useModifier(el, selector, modifier);
    });
  
    Object.keys(modifiers).forEach(function(selector) {
      if (preModifiers.indexOf(selector) !== -1) {
        return;
      }
  
      var modifier = modifiers[selector];
      useModifier(el, selector, modifier);
    });
  };

export function replaceElement(parent, content) {
    parent.innerHTML = '';
    parent.append(content);
};

export function mountComponent(parent, cls, props = {}) {
    parent.innerHTML = '';
    const mounter = document.createElement('div');
    const component = new cls({target: mounter, props});
    parent.append(mounter);
    return component;
};

function useModifier(el, selector, modifier) {
    el.querySelectorAll('[' + selector + ']').forEach(modifier);
}
  
function getDeepItem(obj, path) {
    path.split('/').forEach(function(chunk) {
        obj = obj[chunk];
    });
    return obj;
}
  