
$(document).ready(function () {

    debugger;
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "CPF": $(this).find("#CPF").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val()
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                    window.location.href = urlRetorno;
                }
        });
    });

    var modoFormulario = 'incluir'; // Inicialmente definido como 'incluir'
    var beneficiarioId = 0;

    // Função para alternar entre os modos do formulário (incluir ou alterar)
    function alternarModoFormulario(modo) {
        if (modo === 'incluir') {
            $('#btnAcaoBeneficiario').text('Incluir');
        } else if (modo === 'alterar') {
            $('#btnAcaoBeneficiario').text('Alterar');
        }
        modoFormulario = modo;
    }





    $('#btnBeneficiarios').click(function () {

        var clienteId = obj.Id; // Supondo que você tenha o ID do cliente disponível no modelo de visualização
        var modalUrl = '/Cliente/Beneficiarios'; // Caminho para a ação no controlador que retorna a modal e a lista de beneficiários

        $.ajax({
            url: modalUrl,
            type: 'GET',
            data: { clienteId: clienteId }, // Passando o ID do cliente para o servidor
            success: function (data) {

                $('#modalContainer').html(data);
                $('#modalBeneficiarios').modal('show');
            },
            error: function () {
                alert('Erro ao carregar a modal de beneficiários.');
            }
        });
    });

    $('#modalBeneficiarios').on('click', '#btnAcaoBeneficiario', function () {
        debugger;
         
        if (modoFormulario === 'incluir') {
            // Se for uma inclusão, chama a função para incluir o beneficiário
            incluirBeneficiario();
        } else if (modoFormulario === 'alterar') {
            // Se for uma alteração, chama a função para alterar o beneficiário
            alterarBeneficiario(beneficiarioId);
        }
    });
    
    $('#modalBeneficiarios').on('click', '.btn-alterar', function () {
        var row = $(this).closest('tr');
        var cpf = row.find('td:eq(0)').text(); // Obtém o CPF do beneficiário da linha clicada
        var nome = row.find('td:eq(1)').text(); // Obtém o Nome do beneficiário da linha clicada

        // Preenche os campos do formulário com os dados do beneficiário
        $('#cpfBeneficiario').val(cpf);
        $('#nomeBeneficiario').val(nome);

        beneficiarioId = $(this).data('beneficiario-id');

        alternarModoFormulario('alterar');
    });

    // Manipulador de evento para o botão "Excluir"
    $('#modalBeneficiarios').on('click', '.btn-excluir', function () {
        var row = $(this).closest('tr');
        var nome = row.find('td:eq(1)').text(); // Obtém o Nome do beneficiário da linha clicada

        // Exibe uma mensagem de confirmação usando ModalDialog com opção Sim ou Não
        ModalDialogYesNo('Confirmar Exclusão', 'Tem certeza que deseja excluir o beneficiário ' + nome + '?', function () {
            // Se confirmado (opção Sim), chama a função de exclusão
            var id = row.find('.btn-excluir').data('beneficiario-id'); // Obtém o ID do beneficiário a partir do atributo data-*
            excluirBeneficiario(id);
        }, function () {
            // Se negado (opção Não), não faz nada
        });
    });

    
})

function ModalDialogYesNo(titulo, texto, callbackSim, callbackNao) {
    var random = Math.random().toString().replace('.', '');
    var modalHtml = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-success" id="btnSim">Sim</button>                        ' +
        '                    <button type="button" class="btn btn-danger" id="btnNao">Não</button>                         ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(modalHtml);
    $('#' + random).modal('show');

    // Define os manipuladores de evento para os botões Sim e Não
    $('#btnSim').click(function () {
        $('#' + random).modal('hide'); // Esconde o modal
        if (typeof callbackSim === 'function') callbackSim(); // Chama a função de callback para a opção Sim
    });

    $('#btnNao').click(function () {
        $('#' + random).modal('hide'); // Esconde o modal
        if (typeof callbackNao === 'function') callbackNao(); // Chama a função de callback para a opção Não
    });
}



function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}


// Função para incluir um novo beneficiário
function incluirBeneficiario() {
    // Coletar os dados do formulário para inclusão
    var cpf = $('#cpfBeneficiario').val();
    var nome = $('#nomeBeneficiario').val();

    // Criar um objeto com os dados do beneficiário para enviar ao servidor
    var dadosBeneficiario = {
        IdCliente: obj.Id,
        CPF: cpf,
        Nome: nome
    };

    $.ajax({
        url: '/Cliente/IncluirBeneficiario',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dadosBeneficiario),
        success: function (resposta) {
            // Ação a ser tomada em caso de sucesso

            // Limpar o formulário
            $('#cpfBeneficiario').val('');
            $('#nomeBeneficiario').val('');

            // Atualizar a grid de beneficiários
            atualizarGridBeneficiarios();

            // Exibir uma mensagem de sucesso
            alert('Beneficiário incluído com sucesso!');
        },
        error: function (xhr, status, error) {
            // Ação a ser tomada em caso de erro
            alert('Ocorreu um erro ao incluir o beneficiário: ' + error);
        }
    });
}


// Função para alterar um novo beneficiário
function alterarBeneficiario(id) {
    // Coletar os dados do formulário para inclusão
    var cpf = $('#cpfBeneficiario').val();
    var nome = $('#nomeBeneficiario').val();

    // Criar um objeto com os dados do beneficiário para enviar ao servidor
    var dadosBeneficiario = {
        Id: id,
        IdCliente: obj.Id,
        CPF: cpf,
        Nome: nome
    };

    $.ajax({
        url: '/Cliente/AlterarBeneficiario',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dadosBeneficiario),
        success: function (resposta) {
            // Ação a ser tomada em caso de sucesso

            // Limpar o formulário
            $('#cpfBeneficiario').val('');
            $('#nomeBeneficiario').val('');

            // Atualizar a grid de beneficiários
            atualizarGridBeneficiarios();

            // Exibir uma mensagem de sucesso
            alert('Beneficiário alterado com sucesso!');
        },
        error: function (xhr, status, error) {
            // Ação a ser tomada em caso de erro
            alert('Ocorreu um erro ao incluir o beneficiário: ' + error);
        }
    });
}

// Função para excluir um beneficiário
function excluirBeneficiario(id) {
    // Enviar a requisição AJAX para excluir o beneficiário
    $.ajax({
        url: '/Cliente/ExcluirBeneficiario', // URL da action na controller responsável pela exclusão
        method: 'POST', // Método HTTP a ser usado
        data: { id: id }, // Dados a serem enviados para o servidor
        success: function (resposta) {
            // Ação a ser tomada em caso de sucesso

            // Atualizar a grid de beneficiários
            atualizarGridBeneficiarios();

            // Exibir uma mensagem de sucesso
            alert(resposta);
        },
        error: function (xhr, status, error) {
            // Ação a ser tomada em caso de erro
            alert('Ocorreu um erro ao excluir o beneficiário: ' + error);
        }
    });
}


function atualizarGridBeneficiarios() {
    var clienteId = obj.Id; // Supondo que você tenha o ID do cliente disponível no modelo de visualização
    var modalUrl = '/Cliente/BeneficiariosList'; // Caminho para a ação no controlador que retorna a modal e a lista de beneficiários

    $.ajax({
        url: modalUrl,
        type: 'GET',
        data: { clienteId: clienteId }, // Passando o ID do cliente para o servidor
        success: function (data) {

            debugger;
            $('#gridBeneficiarios').empty();

            // Iterar sobre os novos dados e adicionar cada beneficiário à tabela
            $.each(data, function (index, beneficiario) {
                var newRow = '<tr>' +
                    '<td>' + beneficiario.CPF + '</td>' +
                    '<td>' + beneficiario.Nome + '</td>' +
                    '<td>' +
                    '<button type="button" class="btn btn-primary btn-alterar" data-beneficiario-id="' + beneficiario.Id + '">Alterar</button>' +
                    '<button type="button" class="btn btn-secondary btn-excluir" data-beneficiario-id="' + beneficiario.Id + '">Excluir</button>' +
                    '</td>' +
                    '</tr>';
                $('#gridBeneficiarios').append(newRow);
            });
        },
        error: function () {
            alert('Erro ao carregar os beneficiários.');
        }
    });
}


