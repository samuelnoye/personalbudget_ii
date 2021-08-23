const submitButton = document.getElementById('submit-enveloppe');
const newEnveloppeContainer = document.getElementById('new-enveloppe');

submitButton.addEventListener('click', () => {
  const payment = document.getElementById('payment').value;
  const description = document.getElementById('description').value;
  const enveloppe_id = document.getElementById('enveloppe_id').value;


  fetch(`/api/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      payment_amount: payment,
      description: description,
      enveloppe_id: enveloppe_id
    })
  })
  .then(response => response.json())
  .then(() => {
    const newEnveloppe = document.createElement('div');
    newEnveloppe.innerHTML = `
    <h3>Congrats, your transaction was created!</h3>
    <p>Go to the <a href="../index.html">home page</a> to request and view everything.</p>
    `
    newEnveloppeContainer.appendChild(newEnveloppe);
  });
});