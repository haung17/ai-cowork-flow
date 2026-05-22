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

    // Tag hard-rules table rows with .governance-rule; badge rules >= 8 as v3.8 新增
    var NEW_RULE_THRESHOLD = 8;
    var NEW_RULE_LABEL = 'v3.8 新增';
    // Find h2 containing "硬規則" (marked.js does not parse {#id} custom anchors)
    var hardRulesHeading = null;
    content.querySelectorAll('h2').forEach(function(h) {
      if (h.textContent.indexOf('硬規則') !== -1) hardRulesHeading = h;
    });
    if (hardRulesHeading) {
      var el = hardRulesHeading.nextElementSibling;
      while (el && el.tagName !== 'TABLE') el = el.nextElementSibling;
    }
    if (hardRulesHeading && el) {
      el.querySelectorAll('tbody tr').forEach(function(tr) {
        tr.classList.add('governance-rule');
        var firstTd = tr.querySelector('td');
        if (firstTd) {
          var ruleNum = parseInt(firstTd.textContent.trim(), 10);
          if (ruleNum >= NEW_RULE_THRESHOLD) {
            var badge = document.createElement('span');
            badge.className = 'rule-new';
            badge.textContent = NEW_RULE_LABEL;
            firstTd.appendChild(badge);
          }
        }
      });
    }

    // Add id="status-promotion" to "Status 升等規則摘要" heading (marked doesn't parse {#id})
    content.querySelectorAll('h2').forEach(function(h) {
      if (h.textContent.indexOf('Status 升等規則摘要') !== -1) h.id = 'status-promotion';
    });

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
