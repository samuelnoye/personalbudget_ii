const fetchAllButtonEnv = document.getElementById('fetch-enveloppes');

const enveloppeContainer = document.getElementById('enveloppe-container');


const resetEnveloppes = () => {
  enveloppeContainer.innerHTML = '';
};

const renderError = response => {
    enveloppeContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
};

const renderEnveloppes = (enveloppes = [{}]) => {
  resetEnveloppes();
  if (enveloppes.length > 0) {
    enveloppes.forEach(transaction => {
      const newEnveloppe = document.createElement('div');
      newEnveloppe.className = 'single-enveloppe';
      newEnveloppe.innerHTML = `<div class="enveloppe-id">~Transaction's id:  ${transaction.id} ~</div>
      <div class="enveloppe-title">Description:  ${transaction.description}</div>
      <div class="enveloppe-title">Enveloppe's id:  ${transaction.enveloppe_id}</div>
      <div class="enveloppe-budget">Payment:   $${transaction.payment_amount}</div>`;
      enveloppeContainer.appendChild(newEnveloppe);
    });
  } else {
    enveloppeContainer.innerHTML = '<p>Your request returned no transactions.</p>';
  };
};


fetchAllButtonEnv.addEventListener('click', () => {
  fetch('/api/transactions')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    };
  })
  .then(response => {
    let enveloppes = response.data;
    renderEnveloppes(enveloppes);
  });
});