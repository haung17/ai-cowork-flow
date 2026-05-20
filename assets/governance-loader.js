// assets/governance-loader.js
window.GovernanceLoader = {};

GovernanceLoader.init = function() {
  var content = document.getElementById('catalog-content');
  var error = document.getElementById('catalog-error');
  fetch('governance.md').then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.text();
  }).then(function(md) {
    content.innerHTML = marked.parse(md);
    content.querySelectorAll('table').forEach(function(table) {
      var wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }).catch(function() {
    error.classList.remove('hidden');
  });
};
