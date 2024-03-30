
let id_ = 0;
let nivel_ = 0;
let id_base_ = 0;
let nivel_atual = 0;
let id_origem = 0;
let origem = "";
e_pai_ou_mae = "";

function showToastrOk(msg) {
  toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "timeOut": "5000"
  };

  toastr.success(msg, "Sucesso");
}

function showToastrErro(msg) {
  toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "timeOut": "5000"
  };
  toastr.error(msg, "Erro");
}


const getList = () => {
    $('#div-membro-base').show();
    $('#div-membro-comum').hide();
    let  url = 'http://127.0.0.1:5000/membro_base';
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

  getList();


  const getListMembroComum = async (item) => {
    id_base_ = item;
    $('#div-membro-base').hide();
    $('#div-membro-comum').show();
    $('#idform').hide();

    let url =  'http://127.0.0.1:5000/membro_comun?id_base=' + item;
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

  const insertListMembroComum = async (data) => {
    let geracao = 0;
    let g1 = '<div class="card text-white bg-black mb-3">'
    let g2 = '<div class="card-header text-center">'
    let g3 = '</div>';
    let g4 = '</div>';
    let btpai01   = '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#ModalPai"'
    let btmae01   = '<button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#ModalMae"'
    let btkid01   = '<button type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#ModalFilho"'
    let btfecha = '</button>';
    if(data.membros != null)
    {
      for (let i = 0; i < data.membros.length; i++) {
        let nivel = data.membros[i].nivel;
        geracao ++;
        var linha = "";
        if(data.membros != null)
        {
           for (j = i; j < data.membros.length && data.membros[j].nivel == nivel; j++) {
            linha =  '<tr>';
            pnGeracao = g1 + g2 + geracao+'a. Geração' +g3 + g4;
            linha += '<td>' + pnGeracao + '</td>';
            let id = data.membros[j].id;
            linha += '<td>' + btpai01 + 'onclick="add_pai(' + id + ',' + nivel + ')">' + data.membros[j].nome_pai + btfecha + '</td>';
            linha += '<td>' + btmae01 + 'onclick="add_mae(' + id + ',' + nivel + ')">' + data.membros[j].nome_mae +  btfecha + '</td>';
            linha += '<td>' + btkid01 + 'onclick="add_filho(' + id + ',' + nivel + ')">' + data.membros[j].nome + btfecha + '</td>';
            linha += '</tr>'
            $('#table-geracao').append(linha);              
          };
         i=j-1;
        }
      }
    }
  }

  
  const newItem = async () => {
    let inputNome = document.getElementById("newInput").value;
    await postItem(inputNome)
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

  const postItem = async (inputNome) =>  {
    const formData = new FormData();
    formData.append('nome', inputNome);

    let url = await 'http://127.0.0.1:5000/membro_base';
    fetch(url, {
      method: 'post',
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      $('#table-geracao').find('tbody').detach();
      $('#table-geracao').append($('<tbody>'));        
      getList();
    })
    .catch((error) => {
      console.error('Error:', error);
    })
   }

  const insertListMembroBase = async (id, nome) => {
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


  const add_pai = async (id, nivel) => {
    $("#newInputPai").hide('');
    id_origem =  id;
    nivel_ = nivel;
    $("#idform").show();
    $("#id_pai").show();
    $("#id_mae").hide();
    $("#id_filho").hide();

  }
  
  const add_mae = async (id, nivel) => {
    $("#newInputMae").hide('');
    id_origem =  id;
    nivel_ = nivel;
    $("#idform").show();
    $("#id_pai").hide();
    $("#id_mae").show();
    $("#id_filho").hide();
  }

  const add_filho = async (id, nivel, id_pai, id_mae) => {
    $("#newInputMae").hide('');
    id_origem =  id;
    nivel_ = nivel;

    $("#idform").show();
    $("#id_pai").hide();
    $("#id_mae").hide();
    $("#id_filho").show();
  }

  const cancelar = async () => {
    $("#ModalPai").modal("hide");
    await getListMembroComum(id_base_);
  }

  $('.modal').on('hidden.bs.modal', function() {
    $(this).find('input:text').val('');
  });

  const salvarPai = async () => {
    nivel_atual = nivel_ - 1;
    let inputNomePai = document.getElementById("newInputPai").value;
    await  postItemComum( 'http://127.0.0.1:5000/membro_comum_pai', id_origem, inputNomePai,nivel_atual);
    $("#idform").hide();
  }

  const salvarMae = async () => {
    nivel_atual = nivel_ - 1;
    let inputNomeMae = document.getElementById("newInputMae").value;
    await postItemComum( 'http://127.0.0.1:5000/membro_comum_mae',id_origem, inputNomeMae,nivel_atual);
    $("#idform").hide();
  }

  const salvarFilho = async () => {
    nivel_atual = nivel_ + 1;
    let inputNomeMae = document.getElementById("newInputFilho").value;
    await  postItemComum( 'http://127.0.0.1:5000/membro_comum_filho',id_origem, inputNomeMae,nivel_atual);
    $("#idform").hide();
  }



  const postItemComum = async (url, id_origem, inputNome, nivel) => {
    const formData = new FormData();
    formData.append('id_base', id_base_);
    formData.append('nivel', nivel);
    formData.append('nome', inputNome);
    formData.append('pai', 0);
    formData.append('mae', 0);
    formData.append('id_origem', id_origem);



    await  fetch(url, {
      method: 'post',
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      cancelar(id_base_);      
    })
    .catch((error) => {
      console.error('Error:', error);
    })
   }


  
  const deleteItem = async (item) => {
    let url = await 'http://127.0.0.1:5000/produto?nome=' + item;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  


