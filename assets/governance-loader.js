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

    // Tag hard-rules table rows with .governance-rule; badge last 3 as v3.8 新增
    var tables = content.querySelectorAll('table');
    if (tables.length > 0) {
      var hardTable = tables[0];
      var rows = hardTable.querySelectorAll('tbody tr');
      var total = rows.length;
      rows.forEach(function(tr, i) {
        tr.classList.add('governance-rule');
        if (i >= total - 3) {
          var firstTd = tr.querySelector('td');
          if (firstTd) {
            var badge = document.createElement('span');
            badge.className = 'rule-new';
            badge.textContent = 'v3.8 新增';
            firstTd.appendChild(badge);
          }
        }
      });
    }

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
