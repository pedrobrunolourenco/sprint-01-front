
const getList = async () => {
    let url = 'http://127.0.0.1:5000/membro_base';
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      $('#table-base').find('tbody').detach();
      $('#table-base').append($('<tbody>'));        
      data.membros.forEach(item => insertList(item.id, item.nome))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  getList()
  
  const newItem = async () => {
    let inputNome = document.getElementById("newInput").value;
    postItem(inputNome)
    getList();
    $('#newInput').val('');
  }

  const postItem = async (inputNome) => {
    const formData = new FormData();
    formData.append('nome', inputNome);

    let url = 'http://127.0.0.1:5000/membro_base';
    fetch(url, {
      method: 'post',
      body: formData
    })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    })
   }

  const insertList = (id, nome) => {
    let bt1 = '<button type="button" class="btn btn-success btn-sm"><span class="bi bi-tree"></span></button>';
    let bt2 = '<button type="button" class="btn btn-danger btn-sm"><span class="bi bi-trash-fill"></span></button>';

    var employee_data = '';
        employee_data += '<tr>';
        employee_data += '<td>'+nome+'</td>';
        employee_data += '<td id="id="btarvore_' + id + '" name="' + id + '" class="text-center">'+bt1+'</td>';
        employee_data += '<td id="id="btremove_' + id + '" name="' + id + '" class="text-center">'+bt2+'</td>';
        employee_data += '</tr>';
    $('#table-base').append(employee_data); 
  }


  const deleteItem = (item) => {
    let url = 'http://127.0.0.1:5000/produto?nome=' + item;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  


