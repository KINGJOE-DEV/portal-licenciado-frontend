import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useRef } from 'react';
import aprovado from '@iconify/icons-eva/checkmark-outline';
import download from '@iconify/icons-eva/cloud-download-outline';
import impresao from '@iconify/icons-eva/printer-outline';

import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

import searchFill from '@iconify/icons-eva/search-fill';
import cancelado from '@iconify/icons-eva/close-outline';

import ReactToPrint from "react-to-print";

import moment from 'moment';
// material
import {
  Link,
  Card,
  Table,
  Stack,
  Avatar,
  TextField,
  CircularProgress,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/dashboard/user';
import PrintButton from '../../../components/print/html_print';

import axios from 'axios';
import React, { useEffect, useContext } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { AuthContext } from '../../../content/contentGeral';

import { useCookies } from 'react-cookie';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID', label: '', alignRight: false },
  { id: 'PRODUTO', label: 'Produto', alignRight: false },
  { id: 'COR_PRODUTO', label: 'Cor', alignRight: false },
  { id: 'TOT_QTDE_ORIGINAL', label: 'QTDE', alignRight: false },
  { id: 'VALOR', label: 'Valor', alignRight: false },
  { id: 'VALOR_ENTREGAR', label: 'Total', alignRight: false },
  { id: 'GRADE', label: 'Grade', alignRight: false },
];
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.PRODUTO.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// ----------------------------------------------------------------------



export default function User(props) {


  const pedido = useParams();
  console.log('prop', pedido)
  const navigate = useNavigate();



  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [resultado, setResultado] = useState([{
    "SEQUENCIAL_DIGITACAO": "",
    "PRODUTO": "",
    "COR": "CARREGANDO ...",
    "TOT_QTDE_ORIGINAL": "",
    "VALOR_ENTREGAR": "",
    "ENTREGA": "",
    "GRADE": ""
  }]);
  const { token, usuario } = useContext(AuthContext);

  const [msgCarregar, setMsgCarregar] = useState(false);
  const [msgResposta, setMsgResposta] = useState(false);
  const [msgInformativo, setMsgInformativo] = useState(false);
  const [ativarBotao, setAtivarBotao] = useState(true);
  const [selecao, setSelecao] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCampos, setOpenCampos] = useState(true);
  const [numeroNota, setNumeroNota] = useState('');
  const [chaveNota, setChaveNota] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [codigoRastreio, setCodigoRastreio] = useState('');
  const [paginacaoJson, setPaginacaoJson] = useState(10);
  const [fecharGrade, setFecharGrade] = useState([]);
  const [grade, setGrade] = useState([]);
  const [gradeFinal, setGradeFinal] = useState([]);
  const [msgQuantidade, setmsgQuantidade] = useState([]);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [msgInformativo_cancelar, setMsgInformativo_cancelar] = useState(false);
  const [msgResposta_cancelar, setMsgResposta_cancelar] = useState(false);
  const [ativarBotao_cancelar, setAtivarBotao_cancelar] = useState(true);
  const [openCancelar, setOpenCancelar] = useState(false);
  const [openCancelarObs, setOpenCancelarObs] = useState(true);
  const [msgCarregar_cancelar, setMsgCarregar_cancelar] = useState(false);
  const [produto, setProduto] = useState('');
  const [cor_produto, setCor_produto] = useState('');
  const [item_pedido, setItem_pedido] = useState('');
  const [entrega, setEntrega] = useState('');
  const [carregarProduto, setCarregarProduto] = useState(true);

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');
  const [minHeight, setMinHeight] = useState(200);


  const [qtde_total, setQtde_total] = useState(0);
  const [valor_total, setValor_total] = useState(0);



  const [openclienteModal, setopenclienteModal] = useState(false);

  const { REACT_APP_API } = process.env;
  console.log(REACT_APP_API)

  const dataExecel = '[]';

  const [autenticado]   = useCookies(['autenticado']);

  useEffect(() => {
    buscarProdutos()
  }, [])

  //MODAL CANCELAR
  const CancelarModal = (PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA) => {
    console.log('clicou no cancelar')
    setMotivoCancelamento('')
    setMsgInformativo_cancelar('Deseja CANCELAR o item do pedido selecionado ?');

    setProduto(PRODUTO)
    setCor_produto(COR_PRODUTO)
    setItem_pedido(ITEM_PEDIDO)
    setEntrega(ENTREGA)

    setMsgResposta_cancelar(false)
    setAtivarBotao_cancelar(true)
    setOpenCancelar(true);
    setOpenCancelarObs(true);
  };
  const CancelarModalFechar = () => {
    setOpenCancelar(false);
  };

  //MODAL
  const FinalizarModal = () => {
    setMsgInformativo('Deseja finalizar os items selecionados ?');
    setMsgResposta(false);
    setAtivarBotao(true);
    setNumeroNota(false);
    setChaveNota(false);
    setOpen(true);
    setOpenCampos(true);
  };
  const mudarCampo_1 = (event) => {
    console.log(event.target.value)
    setNumeroNota(event.target.value);
  };
  const mudarCampo_2 = (event) => {
    console.log(event.target.value)
    setChaveNota(event.target.value);
  };
  const mudarCampo_3 = (event) => {
    console.log(event.target.value)
    setTransportadora(event.target.value);
  };
  const mudarCampo_4 = (event) => {
    console.log(event.target.value)
    setCodigoRastreio(event.target.value);
  };
  const mudarCampoCancelar = (event) => {
    console.log(event.target.value)
    setMotivoCancelamento(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  async function buscarProdutos() {
    //BUSCAR PRODUTOS NA API
    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_aprovado_item',
      headers: {
        'token': autenticado.token
      },
      data: {
        "pedido": pedido
      }

    }).then(async function (response) {

      if (response.status == 200) {

        setResultado(await response.data)



        console.log(response.data)
        setCarregarProduto(false)
        var Qtde_total = 0;
        var Valor_total = 0;

        response.data.forEach(element => {

          Qtde_total = Qtde_total + element.VE1 + element.VE2 + element.VE3 + element.VE4 + element.VE5 + element.VE6 + element.VE7 + element.VE8 + element.VE9 + element.VE10;
          Valor_total = Valor_total + (element.PRECO1 * (element.VE1 + element.VE2 + element.VE3 + element.VE4 + element.VE5 + element.VE6 + element.VE7 + element.VE8 + element.VE9 + element.VE10));

        });

        setQtde_total(Qtde_total)
        setValor_total(Valor_total)

      } else {
        setCarregarProduto(false)
      }

    }).catch(function (error) {
      console.log(error);
    });
  }






  const CarregarGrade = async (event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, TAMANHO, PRECO, QUANTIDADE_PEDIDO) => {

    console.log('carregar grade')
    console.log(pedido.pedido)
    console.log(pedido.pedido)
    console.log(ITEM_PEDIDO)
    console.log(TAMANHO)
    console.log(PRECO)
    console.log(ENTREGA)
    console.log(QUANTIDADE_PEDIDO)

    const CHAVE = PRODUTO + COR_PRODUTO + ITEM_PEDIDO + TAMANHO;

    for (var i = 0; i < grade.length; i++) {
      if (grade[i].chave === CHAVE) {
        grade.splice(i, 1);
        console.log('-----------novo')
        console.log(grade)
        console.log('-----------novo')

      }
    }

    var quantidade_digitada = parseInt(event.target.value);
    console.log(quantidade_digitada)
    var validacaoQuantidade = false;

    if (quantidade_digitada > QUANTIDADE_PEDIDO) {
      validacaoQuantidade = true;
      console.log('Quantidade maior que o pedido tamanho :' + TAMANHO)
    }
    if (quantidade_digitada < 0) {
      validacaoQuantidade = true;
      console.log('Quantidade menor que zero :' + TAMANHO)
    }
    if (isNaN(quantidade_digitada)) {
      validacaoQuantidade = true;
      console.log('Quantidade zerada :' + TAMANHO)
    }
    if (quantidade_digitada == 0) {
      validacaoQuantidade = true;
      console.log('Quantidade zerada :' + TAMANHO)
    }

    if (validacaoQuantidade == false) {

      var item = {
        "id": ID,
        "chave": CHAVE,
        "item_pedido": ITEM_PEDIDO,
        "produto": PRODUTO,
        "cor_produto": COR_PRODUTO,
        "tamanho": TAMANHO,
        "preco": PRECO,
        "entrega": ENTREGA,
        "quantidade": quantidade_digitada
      }

      const gradeItemIndex = grade.indexOf(item);
      let gradeItem = [];
      if (gradeItemIndex === -1) {
        gradeItem = gradeItem.concat(grade, item);
      } else if (gradeItemIndex === 0) {
        gradeItem = gradeItem.concat(grade.slice(1));
      } else if (gradeItemIndex === grade.length - 1) {
        gradeItem = gradeItem.concat(grade.slice(0, -1));
      } else if (gradeItemIndex > 0) {
        gradeItem = gradeItem.concat(
          grade.slice(0, gradeItemIndex),
          grade.slice(gradeItemIndex + 1)
        );
      }
      setGrade(gradeItem);

      console.log(gradeItem)
    }

  };



  const SelecionarIndividual = async (event, ID) => {

    setSelecao('individual');

    const selectedIndex = selected.indexOf(ID);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, ID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    console.log(selected)

  };




  const Finalizar = async () => {

    console.log(grade)
    setMsgCarregar(true);
    setAtivarBotao(true);
    setOpenCampos(false);

    var itemsSelecionados = [];
    let gradeItem = [];

    if (numeroNota != '' && chaveNota != '' && codigoRastreio != '') {

      console.log('Aprovando pedidos novos ...')
      //ENVIAR APENAS OS ITEM SELECIONADOS 
      for (var i = 0; i < grade.length; i++) {

        itemsSelecionados = {
          "item_pedido": grade[i].item_pedido,
          "produto": grade[i].produto,
          "cor_produto": grade[i].cor_produto,
          "tamanho": grade[i].tamanho,
          "preco": grade[i].preco,
          "entrega": grade[i].entrega,
          "quantidade": grade[i].quantidade
        }

        function verificaSelecionados(id) {
          return id == grade[i].id;
        }

        if (selected.some(verificaSelecionados) === true) {
          // console.log('Items selecionados'+grade[i].item)
          console.log('entrou aqui')

          const gradeItemIndex = gradeFinal.indexOf(itemsSelecionados);

          if (gradeItemIndex === -1) {
            gradeItem = gradeItem.concat(gradeFinal, itemsSelecionados);
          } else if (gradeItemIndex === 0) {
            gradeItem = gradeItem.concat(gradeFinal.slice(1));
          } else if (gradeItemIndex === gradeFinal.length - 1) {
            gradeItem = gradeItem.concat(gradeFinal.slice(0, -1));
          } else if (gradeItemIndex > 0) {
            gradeItem = gradeItem.concat(
              gradeFinal.slice(0, gradeItemIndex),
              gradeFinal.slice(gradeItemIndex + 1)
            );
          }
          console.log('----------ITEM SELECIONADO---------------------')
          console.log(grade[i].item)

        } else {

          console.log('----------ITEM COM GRADE ALTERADA---------------------')
          console.log(grade)
          console.log(selected.some(verificaSelecionados));

        }
      }


      if (selected.length > 0) {
        if (grade.length > 0) {

          await axios({
            method: 'POST',
            url: REACT_APP_API + '/parceiro/pedido_aprovado_item_finalizar',
            headers: {
              'token': autenticado.token
            },
            data: {
              "tipo": "INDIVIDUAL",
              "pedido": pedido.pedido,
              "fornecedor": autenticado.usuario,
              "numero_nota": numeroNota,
              "chave_nota": chaveNota,
              "transportadora": transportadora,
              "codigo_rastreio": codigoRastreio,
              "item": gradeItem
            }
          }).then(async function (response) {

            console.log(response)
            setMsgCarregar(false);
            setAtivarBotao(false);


            if (response.status === 200) {

              setGrade([]);
              setGradeFinal([]);
              buscarProdutos();

              setMsgInformativo(response.data.msg);

              if (response.data.msg == 'Finalizado com sucesso !') {
                navigate('/admin/pedido/pedido_finalizado');
              }

            } else {
              setMsgInformativo(response.data.msg);
            }



          }).catch(function (error) {
            console.log(error);
          });


        } else {
          setMsgCarregar(false);
          setAtivarBotao(false);

          setMsgInformativo('Não possui nenhuma quantidade nos campos!');
        }

      } else {
        setMsgCarregar(false);
        setAtivarBotao(false);
        setMsgInformativo('Não possui nenhum Item selecionado !');
      }

    } else {
      setMsgCarregar(false);
      setAtivarBotao(false);
      setMsgInformativo('Por favor preencha todos os campo !');
    }

  }



  const Cancelar = async () => {

    setMsgCarregar_cancelar(true);
    setAtivarBotao_cancelar(true);
    setOpenCancelarObs(false);

    if (motivoCancelamento != '') {

      await axios({
        method: 'POST',
        url: REACT_APP_API + '/parceiro/pedido_aprovado_item_cancelar',
        headers: {
          'token': autenticado.token
        },
        data: {
          "usuario":autenticado.usuario,
          "pedido": pedido.pedido,
          "produto": produto,
          "cor_produto": cor_produto,
          "item_pedido": item_pedido,
          "entrega": entrega,
          "motivo_cancelamento": motivoCancelamento
        }


      }).then(async function (response) {

        console.log(  {
          "usuario":autenticado.usuario,
          "pedido": pedido.pedido,
          "produto": produto,
          "cor_produto": cor_produto,
          "item_pedido": item_pedido,
          "entrega": entrega,
          "motivo_cancelamento": motivoCancelamento
        })
        console.log(response)
        setMsgCarregar_cancelar(false);
        setAtivarBotao_cancelar(false);

        if (response.status === 200) {
          buscarProdutos();
          setGrade([]);
          setGradeFinal([]);
          setMsgInformativo_cancelar(response.data.msg);
        } else {
          setMsgInformativo_cancelar('Erro interno tente novamente!');
        }

      }).catch(function (error) {
        console.log(error);
      });

    } else {
      setMsgCarregar_cancelar(false);
      setAtivarBotao_cancelar(true);
      setOpenCancelarObs(true);
      setMsgInformativo_cancelar('Por favor preencha qual o motivo do cancelamento !');
    }


  }



  async function ClienteModal(CLIENTE_ATACADO) {

    setopenclienteModal(true);

  };

  const fecharclienteModal = () => {
    setopenclienteModal(false);
  };





  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultado.length) : 0;
  const filteredUsers = applySortFilter(resultado, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;


  const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
  }));

  const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`
    }
  }));

  return (
    <Page title="KING&JOE-PARCEIRO">








      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ATENÇÃO !
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">

            {msgCarregar == true ?
              <Stack sx={{ color: 'grey.900', marginLeft: '30%' }} spacing={2} direction="row">
                <CircularProgress color="success" />
              </Stack>
              :
              <h4>{msgInformativo}</h4>
            }
            {openCampos ?
              <>
                <TextField
                  style={{ marginTop: 20, width: '100%' }}
                  id="outlined-number"
                  label="NUMERO DA NOTA"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={numeroNota}
                  onChange={mudarCampo_1}
                />
                <p>
                  <TextField
                    style={{ marginTop: 20, width: '100%' }}
                    id="outlined-number"
                    label="CHAVE DA NOTA"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={chaveNota}
                    onChange={mudarCampo_2}
                  />
                </p>
                <TextField
                  style={{ marginTop: 15, width: '100%' }}
                  id="outlined-number"
                  label="TRANSPORTADORA"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={transportadora}
                  onChange={mudarCampo_3}
                />
                <TextField
                  style={{ marginTop: 15, width: '100%' }}
                  id="outlined-number"
                  label="CÓDIGO RASTREIO"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={codigoRastreio}
                  onChange={mudarCampo_4}
                />
              </>
              : ''
            }


          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>FECHAR</Button>
          {ativarBotao == true ?
            <Button onClick={Finalizar} autoFocus  >
              FINALIZAR
            </Button>
            :
            ''
          }

        </DialogActions>
      </Dialog>




      <Dialog
        open={openCancelar}
        onClose={CancelarModalFechar}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ATENÇÃO !
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msgCarregar_cancelar ?
              <Stack sx={{ color: 'grey.900', marginLeft: '30%' }} spacing={2} direction="row">
                <CircularProgress color="success" />
              </Stack>
              :
              <h4>{msgInformativo_cancelar}</h4>

            }

            {openCancelarObs ?

              <TextField
                style={{ width: 400, height: 200, marginTop: 15 }}
                id="outlined-multiline-static"
                label="Motivo do cancelamento"
                placeholder="Digite aqui"
                multiline
                rows={7}
                value={motivoCancelamento}
                onChange={mudarCampoCancelar}
              />
              : ''
            }

          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={CancelarModalFechar}>FECHAR</Button>
          {ativarBotao_cancelar == true ?
            <Button onClick={Cancelar} autoFocus style={{ color: 'red' }} >
              CANCELAR
            </Button>
            :
            ''
          }


        </DialogActions>
      </Dialog>





      <Dialog
        open={openclienteModal}
        onClose={fecharclienteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        minHeight={minHeight}
      >
        <DialogTitle id="alert-dialog-title">

        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">

            <PrintButton data={resultado} qtde_total={qtde_total} valor_total={valor_total} />


          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharclienteModal}>FECHAR</Button>

        </DialogActions>

      </Dialog>




      <Container>


        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={12}>
          <Typography variant="h4" gutterBottom>
            Produzindo Items do Pedido : {pedido.pedido}
          </Typography>

        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={12} style={{ marginTop: -90 }}>

          <Button
            style={{ marginLeft: 20, background: 'blue' }}
            variant="contained"
            to="#"
            startIcon={<Icon icon={impresao} />}
            onClick={ClienteModal}
          >
            Imprimir
          </Button>


          <Button
            style={{ marginLeft: 20 }}
            variant="contained"

            to="#"
            startIcon={<Icon icon={aprovado} />}
            onClick={FinalizarModal}
          >
            FINALIZAR
          </Button>


        </Stack>

        <Card>

          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />



          <>
            <Scrollbar>

              <Table sx={{ minWidth: 700, Width: 500 }}  >
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={resultado.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}

                />
                <TableBody >



                  {carregarProduto == true ?

                    <Stack sx={{ color: 'grey.900', marginLeft: '50%' }} spacing={2} direction="row">
                      <CircularProgress color="success" />
                    </Stack>
                    :

                    filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {

                        const { ID, LICENCIADO_ENTREGA, LICENCIADO_ENTREGA_LIMITE, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, DESC_PRODUTO, DESC_COR_PRODUTO, QTDE_ENTREGAR, VALOR_ENTREGAR, PRECO1, ENTREGA, VE1, VE2, VE3, VE4, VE5, VE6, VE7, VE8, VE9, VE10, TAMANHO_1, TAMANHO_2, TAMANHO_3, TAMANHO_4, TAMANHO_5, TAMANHO_6, TAMANHO_7, TAMANHO_8, TAMANHO_9, TAMANHO_10 } = row;

                        var isItemSelected = selected.indexOf(ID) !== -1;


                        return (
                          <TableRow
                            hover
                            key={ID}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}

                          >
                            <TableCell padding="checkbox" >
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => SelecionarIndividual(event, ID)}
                              />

                            </TableCell>

                            <TableCell align="left" style={{ fontSize: 13, padding: 10 }} >{DESC_PRODUTO} <p style={{ fontSize: 13, color: '#800000' }}>{PRODUTO}</p></TableCell>
                            <TableCell align="left" style={{ fontSize: 13, padding: 10 }} >{DESC_COR_PRODUTO}  <p style={{ fontSize: 13, color: '#800000' }}>{COR_PRODUTO}</p></TableCell>
                            <TableCell align="center" style={{ fontSize: 13, padding: 10 }} >{QTDE_ENTREGAR}</TableCell>
                            <TableCell align="left" style={{ fontSize: 13, color: '#800000', padding: 10 }}>R$:{typeof PRECO1 === 'number' ? PRECO1.toFixed(2) : PRECO1}</TableCell>
                            <TableCell align="left" style={{ fontSize: 13, color: '#800000', padding: 10 }}>R$:{typeof VALOR_ENTREGAR === 'number' ? VALOR_ENTREGAR.toFixed(2) : VALOR_ENTREGAR}</TableCell>

                            <TableCell align="left" style={{ padding: 10 }} >
                              <TableRow>
                                {TAMANHO_1 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_1}</TableCell> : ''}
                                {TAMANHO_2 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_2}</TableCell> : ''}
                                {TAMANHO_3 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_3}</TableCell> : ''}
                                {TAMANHO_4 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_4}</TableCell> : ''}
                                {TAMANHO_5 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_5}</TableCell> : ''}
                                {TAMANHO_6 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_6}</TableCell> : ''}
                                {TAMANHO_7 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_7}</TableCell> : ''}
                                {TAMANHO_8 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_8}</TableCell> : ''}
                                {TAMANHO_9 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_9}</TableCell> : ''}
                                {TAMANHO_10 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 11 }} align="center" >{TAMANHO_10}</TableCell> : ''}
                              </TableRow>
                              <TableRow>
                                {TAMANHO_1 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE1}</TableCell> : ''}
                                {TAMANHO_2 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE2}</TableCell> : ''}
                                {TAMANHO_3 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE3}</TableCell> : ''}
                                {TAMANHO_4 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE4}</TableCell> : ''}
                                {TAMANHO_5 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE5}</TableCell> : ''}
                                {TAMANHO_6 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE6}</TableCell> : ''}
                                {TAMANHO_7 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE7}</TableCell> : ''}
                                {TAMANHO_8 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE8}</TableCell> : ''}
                                {TAMANHO_9 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE9}</TableCell> : ''}
                                {TAMANHO_10 ? <TableCell align="center" style={{ fontSize: 11 }}>{VE10}</TableCell> : ''}
                              </TableRow>
                              <TableRow>

                                {TAMANHO_1 ? VE1 ? <TableCell align="center"><form ><input id='QTDE_1' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 1, PRECO1, VE1)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_2 ? VE2 ? <TableCell align="center"><form ><input id='QTDE_2' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 2, PRECO1, VE2)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_3 ? VE3 ? <TableCell align="center"><form ><input id='QTDE_3' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 3, PRECO1, VE3)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_4 ? VE4 ? <TableCell align="center"><form ><input id='QTDE_4' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 4, PRECO1, VE4)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_5 ? VE5 ? <TableCell align="center"><form ><input id='QTDE_5' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 5, PRECO1, VE5)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_6 ? VE6 ? <TableCell align="center"><form ><input id='QTDE_6' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 6, PRECO1, VE6)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_7 ? VE7 ? <TableCell align="center"><form ><input id='QTDE_7' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 7, PRECO1, VE7)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_8 ? VE8 ? <TableCell align="center"><form ><input id='QTDE_8' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 8, PRECO1, VE8)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_9 ? VE9 ? <TableCell align="center"><form ><input id='QTDE_9' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 9, PRECO1, VE9)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_10 ? VE10 ? <TableCell align="center"><form ><input id='QTDE_10' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 10, PRECO1, VE10)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}



                              </TableRow>

                              <Button
                                style={{ backgroundColor: 'red', fontSize: 12 }}
                                variant="contained"
                                to="#"
                                startIcon={<Icon icon={cancelado} />}
                                onClick={() => CancelarModal(PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA)}
                              >
                                CANCELAR GRADE
                              </Button>
                              <div style={{ marginLeft: '15%', marginTop: -40, position: 'absolute' }}>

                                {LICENCIADO_ENTREGA != null ?
                                  <TableCell align="left" >
                                    Entrega : {moment(LICENCIADO_ENTREGA).utc().format('DD/MM/YYYY')} |  Limite : {moment(LICENCIADO_ENTREGA_LIMITE).utc().format('DD/MM/YYYY')}
                                  </TableCell>
                                  :
                                  <TableCell align="left" style={{ fontSize: 12, color: 'red' }}>
                                    FALTA PREENCHER A ENTREGA E LIMITE DA ENTREGA
                                  </TableCell>
                                }
                              </div>



                            </TableCell>



                          </TableRow>
                        );
                      })

                  }


                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>

            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={resultado.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

          </>

        </Card>
      </Container>
    </Page>
  );
}
