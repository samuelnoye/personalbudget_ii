const submitButton = document.getElementById('submit-enveloppe');
const newEnveloppeContainer = document.getElementById('new-enveloppe');

submitButton.addEventListener('click', () => {
  const id = document.getElementById('id').value;
  const title = document.getElementById('title').value;
  const budget = document.getElementById('budget').value;

  fetch(`/api/enveloppes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      budget: budget
    })
  })
  .then(response => response.json())
  .then(() => {
    const newEnveloppe = document.createElement('div');
    newEnveloppe.innerHTML = `
    <h3>Congrats, your enveloppe was updated!</h3>
    <p>Go to the <a href="../index.html">home page</a> to request and view all enveloppes.</p>
    `
    newEnveloppeContainer.appendChild(newEnveloppe);
  });
});