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
    enveloppes.forEach(enveloppe => {
      const newEnveloppe = document.createElement('div');
      newEnveloppe.className = 'single-enveloppe';
      newEnveloppe.innerHTML = `<div class="enveloppe-id">~ ${enveloppe.id} ~</div>
      <div class="enveloppe-title">${enveloppe.title}</div>
      <div class="enveloppe-budget">$${enveloppe.budget}</div>`;
      enveloppeContainer.appendChild(newEnveloppe);
    });
  } else {
    enveloppeContainer.innerHTML = '<p>Your request returned no enveloppes.</p>';
  };
};


fetchAllButtonEnv.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/enveloppes')
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
  } catch (error) {
    console.error(error.message);
  };
});