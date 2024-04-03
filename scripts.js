
let id_ = 0;
let nivel_ = 0;
let id_base_ = 0;
let pai_ = 0;
let mae_ =  0;
let nivel_atual = 0;
let id_origem = 0;


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

  const getPaiPorId = async (id) => {
    id_ = id;
    let url =  'http://127.0.0.1:5000/membro_por_id?id=' + id;
    fetch(url, {
      method: 'get'
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.membro)
      {
         document.getElementById("newInputPai").value = data.membro[0].nome;
         document.getElementById("btnaddpai").style.display = 'none';
         document.getElementById("btnaltpai").style.display = 'block';
      }
      else
      {
        document.getElementById("newInputPai").value = '';
        document.getElementById("btnaddpai").style.display = 'block';
        document.getElementById("btnaltpai").style.display = 'none';
     }

    })
  }


  const getMaePorId = async (id) => {
    let url =  'http://127.0.0.1:5000/membro_por_id?id=' + id;
    fetch(url, {
      method: 'get'
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.membro)
      {
         document.getElementById("newInputMae").value = data.membro[0].nome;
         document.getElementById("btnaddmae").style.display = 'none';
         document.getElementById("btnaltmae").style.display = 'block';
      }
      else
      {
        document.getElementById("newInputMae").value = '';
        document.getElementById("btnaddmae").style.display = 'block';
        document.getElementById("btnaltmae").style.display = 'none';
     }

    })
  }

  const getKidPorId = async (id_origem, pai, mae) => {
    var membroPai = await getMembroPai(id_origem);
    var membroMae = await getMembroMae(id_origem);
    let ePai = false;
    let eMae = false;

    pai_ = 0;
    mae_ = 0;

    document.getElementById("rbpai").checked = false;
    document.getElementById("rbmae").checked = false;

    if(membroPai)
    {
      if(membroPai.id > 0)
      {
          ePai = true;
      }
    }

    if( ePai == false)
    {
      if(membroMae)
      {
        if(membroMae.id > 0)
        {
            eMae = true;
        }
      }
    }

    if(ePai == false && eMae == false)
    {
      document.getElementById("selecionaPaiMae").style.display = 'block';

      let idButtonKid = "id_kid_" + id_origem;

      var textoButton = document.querySelector('#'+idButtonKid).textContent;

      document.querySelector('#cklabelpai').textContent = 'Selecione se ' + textoButton + ' for o PAI do filho que será adicionado';
      document.querySelector('#cklabelmae').textContent = 'Selecione se ' + textoButton + ' for a MÃE do filho que será adicionado';
    }

    if(ePai || eMae)
    {
      document.getElementById("selecionaPaiMae").style.display = 'none';
      if( ePai )
      {
        pai_ = id_origem;
        mae_ = 0;
      }

      if( eMae )
      {
        pai_ = 0;
        mae_ = id_origem;
      }
    }
  }

  const getMembroPai = async (id) => {
    let url =  'http://127.0.0.1:5000/membro_pai?id=' + id;
    const response = await fetch(url, {
      method: 'get'
    });
   const data = await response.json();
    if (data.membro) {
        return data.membro[0];
    } else {
        return null; 
    }
  }

  const getMembroMae = async (id) => {
    let url =  'http://127.0.0.1:5000/membro_mae?id=' + id;
    const response = await fetch(url, {
      method: 'get'
    });
   const data = await response.json();
    if (data.membro) {
        return data.membro[0];
    } else {
        return null; 
    }
  }

  const getMembroFilho = async (id) => {
    let url =  'http://127.0.0.1:5000/membro_por_id?id=' + id
    const response = await fetch(url, {
      method: 'get'
    });
   const data = await response.json();
    if (data.membro) {
        return data.membro[0];
    } else {
        return null; 
    }
  }

  const insertListMembroComum = async (data) => {
    let geracao = 0;
    let g0 = '<div class="btn btn-danger btn-sm largura-100 cursor-none">'
    let g1 = '<div class="btn btn-warning btn-sm largura-100 cursor-none">'
    let g2 = '</div>';
    let btpai01   = '<button type="button" class="btn btn-primary btn-sm largura-100" data-toggle="modal" data-target="#ModalPai"'
    let btmae01   = '<button type="button" class="btn btn-success btn-sm largura-100" data-toggle="modal" data-target="#ModalMae"'
    let btkid01   = '<button type="button" class="btn btn-secondary btn-sm largura-100" data-toggle="modal" data-target="#ModalFilho"'
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
            if( data.membros[j].id_base == 0 ) {
              pnGeracao = g0 + geracao+'a. Geração' +g2;
            }
            else
            {
              pnGeracao = g1 + geracao+'a. Geração' +g2;
            }
            linha += '<td>' + pnGeracao + '</td>';
            linha += '<td>' + btpai01 + 'id="id_pai_' + data.membros[j].id  + '" onclick="add_pai(' + data.membros[j].id + ',' + data.membros[j].nivel + ',' + data.membros[j].pai + ')">' + data.membros[j].nome_pai + btfecha + '</td>';
            linha += '<td>' + btmae01 + 'id="id_mae_' + data.membros[j].id  + '" onclick="add_mae(' + data.membros[j].id + ',' + data.membros[j].nivel + ',' + data.membros[j].mae + ')">' + data.membros[j].nome_mae + btfecha + '</td>';
            linha += '<td>' + btkid01 + 'id="id_kid_' + data.membros[j].id  + '" onclick="add_kid(' + data.membros[j].id + ',' + data.membros[j].nivel + ',' + data.membros[j].pai + ',' + data.membros[j].mae + ')">' + data.membros[j].nome     + btfecha + '</td>';
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
      if(data.sucesso)      
         showToastrOk(data.mensagem);

      if(!data.sucesso)      
         showToastrErro(data.mensagem);

      getList();
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


  const add_pai = async (id, nivel, pai) => {
    id_origem =  id;
    nivel_ = nivel;
    pai_ = pai;
    id_ = id;
    getPaiPorId(pai);
  }
  
  const add_mae = async (id, nivel, mae) => {
    id_origem =  id;
    nivel_ = nivel; 
    mae_ = mae;
    id_ = id;
    getMaePorId(mae);
  }

  const add_kid = async (id, nivel, pai, mae) => {
    id_origem =  id;
    nivel_ = nivel;
    filho = id;
    getKidPorId(filho, pai, mae);
  }

  const cancelar = async () => {
    $("#ModalPai").modal("hide");
    $("#ModalMae").modal("hide");
    $("#ModalFilho").modal("hide");
    await getListMembroComum(id_base_);
  }

  $('.modal').on('hidden.bs.modal', function() {
    $(this).find('input:text').val('');
  });


  const adicionaPai = async () => {
    nivel_atual = nivel_ - 1;
    let inputNomePai = document.getElementById("newInputPai").value;
    if(inputNomePai != '' && inputNomePai != null)
    {
      await  postItemComum( 'http://127.0.0.1:5000/add_membro_comum_pai', id_origem, inputNomePai,nivel_atual, 0, 0);
    }
    else
    {
      showToastrErro('Necessário informar o nome do pai');
    }
  }

  const alteraPai = async () => {
    let inputNomePai = document.getElementById("newInputPai").value;
    if(inputNomePai != '' && inputNomePai != null)
    {
      await  putItemComumPai( 'http://127.0.0.1:5000/altera_membro_comum_pai', pai_, id_origem, inputNomePai);
    }
    else
    {
      showToastrErro('Necessário informar o nome do pai');
    }
  }

  const adicionaMae = async () => {
    nivel_atual = nivel_ - 1;
    let inputNomeMae = document.getElementById("newInputMae").value;
    if(inputNomeMae != '' && inputNomeMae != null)
    {
      await postItemComum( 'http://127.0.0.1:5000/add_membro_comum_mae',id_origem, inputNomeMae,nivel_atual,0,0);
    }
    else
    {
      showToastrErro('Necessário informar o nome da Mãe');
    }
  }

  const alteraMae = async () => {
    let inputNomeMae = document.getElementById("newInputMae").value;
    if(inputNomeMae != '' && inputNomeMae != null)
    {
      await  putItemComumMae( 'http://127.0.0.1:5000/altera_membro_comum_mae', mae_, id_origem, inputNomeMae);
    }
    else
    {
      showToastrErro('Necessário informar o nome da Mãe');
    }
  }

  const adicionaFilho = async () => {
    nivel_atual = nivel_ + 1;
    let inputNomeFilho = document.getElementById("newInputFilho").value;
    if(inputNomeFilho != '' && inputNomeFilho != null)
    {
      console.log('passei 1')
      console.log(pai_)
      console.log(mae_)
      if(pai_ == 0 && mae_ == 0)
      {
          // buscar o checked
          let rdb = obterRadioMarcado();
          if( rdb == "Pai")
          {
            pai_ = id_origem;
            mae_ = 0;
            await  postItemComum( 'http://127.0.0.1:5000/add_membro_comum_filho',id_origem, inputNomeFilho, nivel_atual, pai_, 0 );
          }

          if( rdb == "Mae")
          {
            pai_ = 0;
            mae_ = id_origem;
            await  postItemComum( 'http://127.0.0.1:5000/add_membro_comum_filho',id_origem, inputNomeFilho, nivel_atual, 0, mae_ );
          }

          if( rdb == null)
          {
            showToastrErro('Necessário informar se é Pai ou Mãe');
          }
      }
      else
      {
          await  postItemComum( 'http://127.0.0.1:5000/add_membro_comum_filho',id_origem, inputNomeFilho, nivel_atual, pai_, mae_ );
      }
      document.getElementById("rbpai").checked = false;
      document.getElementById("rbmae").checked = false;
    }
    else
    {
      document.getElementById("rbpai").checked = false;
      document.getElementById("rbmae").checked = false;      
      showToastrErro('Necessário informar o nome do Filho');
    }
  }

  const alteraFilho = async () => {
    let inputNomeFilho= document.getElementById("newInputFilho").value;
    if(inputNomeFilho != '' && inputNomeFilho != null)
    {
      await  putItemComumFilho('http://127.0.0.1:5000/altera_membro_comum_filho', id_origem, inputNomeFilho);
    }
    else
    {
      showToastrErro('Necessário informar o nome do flho');
    }
  }


  function obterRadioMarcado() {
    var radioPai = document.getElementById('rbpai');
    if (radioPai.checked) {
        return 'Pai';
    }
    var radioMae = document.getElementById('rbmae');
    if (radioMae.checked) {
        return 'Mae';
    }
    return null;
  }

  const postItemComum = async (url, id_origem, inputNome, nivel, pai, mae) => {

    const formData = new FormData();
    formData.append('id_base', id_base_);
    formData.append('nivel', nivel);
    formData.append('nome', inputNome);
    formData.append('pai', pai);
    formData.append('mae', mae);
    formData.append('id_origem', id_origem);

    await  fetch(url, {
      method: 'post',
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      showToastrOk("Membro cadastrado com sucesso");
      cancelar();      
    })
    .catch((error) => {
      showToastrErro("Erro ao cadastrar um novo membro");
      console.error('Error:', error);
    })
   }

   const putItemComumPai = async (url, id_pai, id_origem, inputNome) => {
    const formData = new FormData();
    formData.append('id_pai', id_pai);
    formData.append('id_filho', id_origem);
    formData.append('nome', inputNome);

    await  fetch(url, {
      method: 'put',
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      showToastrOk("Membro alterado com sucesso");
      cancelar();      
    })
    .catch((error) => {
      showToastrErro("Erro ao alterar membro");
      console.error('Error:', error);
    })
   }

   const putItemComumMae = async (url, id_mae, id_origem, inputNome) => {
    const formData = new FormData();
    formData.append('id_mae', id_mae);
    formData.append('id_filho', id_origem);
    formData.append('nome', inputNome);

    await  fetch(url, {
      method: 'put',
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      showToastrOk("Membro alterado com sucesso");
      cancelar();      
    })
    .catch((error) => {
      showToastrErro("Erro ao alterar membro");
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

  


