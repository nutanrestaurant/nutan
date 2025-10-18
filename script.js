const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const buttonText = button.textContent.trim();

    if (buttonText === 'Zomato') {
      window.open('https://www.zomato.com/ahmedabad/nutan-restaurant-lal-darwaja/order', '_blank');
    } else if (buttonText === 'Swiggy') {
      window.open('https://www.swiggy.com/city/ahmedabad/nutan-restaurant-lal-darwaja-rest126693', '_blank');
    }
  });
});

