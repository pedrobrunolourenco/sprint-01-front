
let id_ = 0;
let nivel_ = 0;

const getList = async () => {
    $('#div-membro-base').show();
    $('#div-membro-comum').hide();
    let url = 'http://127.0.0.1:5000/membro_base';
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      $('#table-base').find('tbody').detach();
      $('#table-base').append($('<tbody>'));        
      data.membros.forEach(item => insertListMembroBase(item.id, item.nome))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  getList()
  

  const getListMembroComum = async (item) => {
    id_base = item;
    $('#div-membro-base').hide();
    $('#idform').hide();
    $('#div-membro-comum').show();

    let url = 'http://127.0.0.1:5000/membro_comun?id_base=' + item;
    fetch(url, {
      method: 'get'
    })
    .then((response) => response.json())
    .then((data) => {
      $('#table-geracao').find('tbody').detach();
      $('#table-geracao').append($('<tbody>'));        
      insertListMembroComum(data);
    })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  
  const newItem = async () => {
    let inputNome = document.getElementById("newInput").value;
    postItem(inputNome)
    getList();
    let nome_base = $('#newInput').val()
    $('#titulo-arvore').val(nome_base);
    $('#newInput').val('');
  }

  const retornarMembrosBase = async () => {
    $('#titulo-arvore').val("Membros Base - Árvore Genealógica");
    $('#newInput').val('');
    $('#div-membro-comum').hide();
    $('#div-membro-base').show();
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

  const insertListMembroBase = (id, nome) => {
    let bt1 = '<button type="button" class="btn btn-success btn-sm"><span class="bi bi-tree"></span></button>';
    let bt2 = '<button type="button" class="btn btn-danger btn-sm"><span class="bi bi-trash-fill"></span></button>';

    var employee_data = '';
        employee_data += '<tr>';
        employee_data += '<td>'+nome+'</td>';
        employee_data += '<td id="id="btarvore_' + id + '" name="' + id + '" onclick=getListMembroComum(' + id  +') class="text-center">'+bt1+'</td>';
        employee_data += '<td id="id="btremove_' + id + '" name="' + id + '" class="text-center">'+bt2+'</td>';
        employee_data += '</tr>';
    $('#table-base').append(employee_data); 
  }

  const insertListMembroComum = (data) => {
    let geracao = 0;
    let g1 = '<div class="card text-white bg-black mb-3">'
    let g2 = '<div class="card-header text-center">'
    let g3 = '</div>';
    let g4 = '</div>';
    let btpai01   = '<button type="button" class="btn btn-primary btn-sm"'
    let btmae01   = '<button type="button" class="btn btn-info btn-sm"'
    let btkid01 = '<button type="button" class="btn btn-warning btn-sm"'
    let btfecha = '</button>';
    for (let i = 0; i < data.membros.length; i++) {
      let nivel = data.membros[i].nivel;
      geracao ++;
      for (j = i; j < data.membros.length && data.membros[j].nivel == nivel; j++) {
         pnGeracao = g1 + g2 + geracao+'a. Geração' +g3 + g4;
         let id = data.membros[j].id;
         var linha =  '<tr>';
             linha += '<td>' + pnGeracao + '</td>';
             linha += '<td>' + btpai01 + 'onclick="add_pai(' + id + ',' + nivel + ')">' + data.membros[j].nome_pai + btfecha + '</td>';
             linha += '<td>' + btmae01 + 'onclick="add_mae(' + id + ',' + nivel + ')">' + data.membros[j].nome_mae +  btfecha + '</td>';
             linha += '<td>' + btkid01 + 'onclick="add_filho(' + id + ',' + nivel + ')">' + data.membros[j].nome + btfecha + '</td>';
             linha += '</tr>'
         $('#table-geracao').append(linha);              
     };
     i=j;
    }
  }

  const add_pai = (id, nivel) => {
    id_ =  id;
    nivel_ = nivel;
    
    $("#idform").show();
    $("#id_pai").show();
    $("#id_mae").hide();
    $("#id_filho").hide();
  }
  
  const add_mae = (id, nivel) => {
    id_ =  id;
    nivel_ = nivel;
    $("#idform").show();
    $("#id_pai").hide();
    $("#id_mae").show();
    $("#id_filho").hide();
  }

  const add_filho = (id, nivel) => {
    id_ =  id;
    nivel_ = nivel;
    $("#idform").show();
    $("#id_pai").hide();
    $("#id_mae").hide();
    $("#id_filho").show();
  }

  const salvar = () => {
    // atençao com id_ e nivel_
    // grava novo registro
    // altera campos de id_ retornando o novo id gravado
    $("#idform").hide();
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

  


