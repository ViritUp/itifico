export default function forms () {
  const form = document.querySelectorAll('form');
  const input = document.querySelectorAll('input');
  let valid = true;

  const message = {
    loading: "Завантаження...",
    successMailing: "Дякуємо за підписку на розсилку!",
    successMsg: "Дякуємо за вашу заявку. Ми зв'яжемося з вами найближчим часом!",
    failure: "Щось пішло не так..."
  };

  const postData = async (url, data) => {
    document.querySelector('.status').textContent = message.loading;

    let res = await fetch(url, {
      method: 'POST',
      body: data
    });

    return await res.text();
  };

  const clearInputs = () => {
    input.forEach(item => {
        item.value = '';
    });
  };


  form.forEach(item => { 
    item.addEventListener('submit', e => {
      e.preventDefault();

      // validation check
      valid = true;
      item.querySelectorAll('input').forEach(element => {
        if (element.classList.contains('invalid')) {
          valid = false;
        }
      });
      
      if (valid) {
        let statusMessage = document.createElement('div');
        statusMessage.classList.add('status');
        item.appendChild(statusMessage);
  
        const formData = new FormData(item);
  
        postData('./server.php', formData)
          .then(res => {
            console.log(res);
            if (item.hasAttribute('data-contact')) {
              statusMessage.textContent = message.successMsg;        
            } else if (item.hasAttribute('data-mailing')) {
              statusMessage.textContent = message.successMailing;
            }
            statusMessage.classList.add('ok');
          })
          .catch(() => {
            statusMessage.textContent = message.failure;
            statusMessage.classList.add('error');
          })
          .finally(() => {
            clearInputs();
            setTimeout(() => {
              statusMessage.classList.remove('ok');
              statusMessage.classList.remove('error');
              statusMessage.remove();
            }, 3000);
        });
      }

    });
  });
}