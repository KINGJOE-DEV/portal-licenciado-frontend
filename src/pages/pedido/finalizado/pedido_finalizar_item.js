import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import devolvido from '@iconify/icons-eva/swap-outline';

import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
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
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/dashboard/user';


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
  { id: 'VALOR_ENTREGAR', label: 'Valor', alignRight: false },
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

  const prop = useParams();
  console.log(prop)

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

  const [msgCarregar, setMsgCarregar] = useState(false);
  const [msgResposta, setMsgResposta] = useState(false);
  const [msgInformativo, setMsgInformativo] = useState(false);
  const [ativarBotao, setAtivarBotao] = useState(true);

  const [selecao, setSelecao] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCampos, setOpenCampos] = useState(true);

  const [numeroNotaDevolucao, setNumeroNotaDevolucao] = useState('');
  const [chaveNotaDevolucao, setChaveNotaDevolucao] = useState('');

  const { token, usuario } = useContext(AuthContext);

  const [grade, setGrade] = useState([]);
  const [gradeFinal, setGradeFinal] = useState([]);


  const { REACT_APP_API } = process.env;
  console.log(REACT_APP_API)
  const [autenticado]   = useCookies(['autenticado']);


  useEffect(() => {
    buscarProdutos()

  }, [])


  //MODAL
  const DevolverModal = () => {
    setMsgInformativo('Deseja devolver os items selecionados ?');
    setMsgResposta(false);
    setAtivarBotao(true);

    setChaveNotaDevolucao(false);
    setNumeroNotaDevolucao(false);
    setOpen(true);
    setOpenCampos(true);
  };

  const mudarCampo_1 = (event) => {
    console.log(event.target.value)
    setNumeroNotaDevolucao(event.target.value);
  };
  const mudarCampo_2 = (event) => {
    console.log(event.target.value)
    setChaveNotaDevolucao(event.target.value);
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
      url: REACT_APP_API + '/parceiro/pedido_finalizado_item',
      headers: {
        'token': autenticado.token
      },
      data: {
        "numeroNota": prop.numeroNota
      }

    }).then(async function (response) {

      console.log(resultado)

      if (response.status == 200) {

        setResultado(await response.data)
        console.log(resultado)

      } else {
        setResultado([{

          "SEQUENCIAL_DIGITACAO": "",
          "PRODUTO": "",
          "COR": "CARREGANDO ...",
          "TOT_QTDE_ORIGINAL": "",
          "VALOR_ENTREGAR": "",
          "ENTREGA": "",
          "GRADE": ""

        }])

        console.log(resultado)
      }

    }).catch(function (error) {
      console.log(error);
    });
  }



  const CarregarGrade = async (event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, TAMANHO, PRECO, QUANTIDADE_PEDIDO) => {
    console.log('carregar grade')
    console.log(prop.pedido)
    console.log(prop.numeroNota)
    console.log(ITEM_PEDIDO)
    console.log(TAMANHO)
    console.log(PRECO)
    console.log(ENTREGA)
    console.log(QUANTIDADE_PEDIDO)

    const CHAVE = PRODUTO + COR_PRODUTO + ITEM_PEDIDO + TAMANHO;
    for (var i = 0; i < grade.length; i++) {
      if (grade[i].chave === CHAVE) {
        grade.splice(i, 1);
        console.log('-----------item encontrado para exclusao')
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
        "quantidade": quantidade_digitada,
        "preco": PRECO,
        "entrega": ENTREGA
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


    console.log(grade)


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


  const Devolver = async () => {

    setMsgCarregar(true);
    setAtivarBotao(true);
    setOpenCampos(false);


    var itemsSelecionados = [];
    let gradeItem = [];

    if (prop.numeroNota != '' && numeroNotaDevolucao != '' && chaveNotaDevolucao != '') {

      console.log('Aprovando pedidos novos ...')
      //ENVIAR APENAS OS ITEM SELECIONADOS 
      for (var i = 0; i < grade.length; i++) {

        itemsSelecionados = {
          "fornecedor": grade[i].fornecedor,
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
            url: REACT_APP_API + '/parceiro/pedido_finalizado_item_devolver',
            headers: {
              'token': autenticado.token
            },
            data: {
              "tipo": "INDIVIDUAL",
              "pedido": prop.pedido,
              "fornecedor": autenticado.usuario,
              "numero_nota": prop.numeroNota,
              "numero_nota_devolucao": numeroNotaDevolucao,
              "chave_nota_devolucao": chaveNotaDevolucao,
              "item": gradeItem
            }
          }).then(async function (response) {

            console.log(response)
            setMsgCarregar(false);
            setAtivarBotao(false);

            if (response.status === 200) {
              buscarProdutos();

              setMsgInformativo(response.data.msg);

              if (response.data.msg == 'Devolvido com sucesso !') {
                navigate('/admin/pedido/pedido_devolvido');
              }

            } else {
              setMsgInformativo('Erro interno tente novamente!');
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultado.length) : 0;
  const filteredUsers = applySortFilter(resultado, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

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
                  label="NUMERO DA NOTA DE DEVOLUÇÃO"
                  type="number"
                  InputLabelprop={{
                    shrink: true,
                  }}
                  value={numeroNotaDevolucao}
                  onChange={mudarCampo_1}
                />
                <p>
                  <TextField
                    style={{ marginTop: 20, width: '100%' }}
                    id="outlined-number"
                    label="CHAVE DA NOTA DE DEVOLUÇÃO"
                    type="number"
                    InputLabelprop={{
                      shrink: true,
                    }}
                    value={chaveNotaDevolucao}
                    onChange={mudarCampo_2}
                  />
                </p>

              </>
              : ''
            }


          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>FECHAR</Button>
          {ativarBotao == true ?
            <Button onClick={Devolver} autoFocus  >
              DEVOLVER
            </Button>
            :
            ''
          }
        </DialogActions>
      </Dialog>




      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={12}>
          <Typography variant="h4" gutterBottom>
            Finalizado pedido {prop.pedido} com a nota : {prop.numeroNota}
          </Typography>

        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={12} style={{ marginTop: -90 }}>

          <Button
            style={{ marginLeft: 20, backgroundColor: 'red' }}
            variant="contained"
            to="#"
            startIcon={<Icon icon={devolvido} />}
            onClick={DevolverModal}
          >
            DEVOLVER
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
              <TableContainer sx={{ minWidth: 700, Width: 500 }}  >
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={resultado.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}

                  />
                  <TableBody>
                    {filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {

                        const { ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, DESC_PRODUTO, DESC_COR_PRODUTO, QTDE_ENTREGUE, VALOR_ENTREGUE, PRECO1, ENTREGA, LICENCIADO_ENTREGA, LICENCIADO_ENTREGA_LIMITE, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, FO1, FO2, FO3, FO4, FO5, FO6, FO7, FO8, FO9, FO10, TAMANHO_1, TAMANHO_2, TAMANHO_3, TAMANHO_4, TAMANHO_5, TAMANHO_6, TAMANHO_7, TAMANHO_8, TAMANHO_9, TAMANHO_10 } = row;

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
                            <TableCell align="center" style={{ fontSize: 13, padding: 10 }} >{QTDE_ENTREGUE}</TableCell>
                            <TableCell align="left" style={{ fontSize: 13, color: '#800000', padding: 10 }}>R$:{typeof PRECO1 === 'number' ? PRECO1.toFixed(2) : PRECO1}</TableCell>
                            <TableCell align="left" style={{ fontSize: 13, color: '#800000', padding: 10 }}>R$:{typeof VALOR_ENTREGUE === 'number' ? VALOR_ENTREGUE.toFixed(2) : VALOR_ENTREGUE}</TableCell>

                            <TableCell align="left" style={{ padding: 10 }} >
                              <TableRow >
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

                                {TAMANHO_1 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO1}</TableCell> : ''}
                                {TAMANHO_2 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO2}</TableCell> : ''}
                                {TAMANHO_3 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO3}</TableCell> : ''}
                                {TAMANHO_4 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO4}</TableCell> : ''}
                                {TAMANHO_5 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO5}</TableCell> : ''}
                                {TAMANHO_6 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO6}</TableCell> : ''}
                                {TAMANHO_7 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO7}</TableCell> : ''}
                                {TAMANHO_8 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO8}</TableCell> : ''}
                                {TAMANHO_9 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO9}</TableCell> : ''}
                                {TAMANHO_10 ? <TableCell align="center" style={{ fontSize: 11 }}>{FO10}</TableCell> : ''}
                              </TableRow>
                              <TableRow>


                                {TAMANHO_1 ? F1 ? <TableCell align="center"><form ><input id='QTDE_1' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 1, PRECO1, F1)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_2 ? F2 ? <TableCell align="center"><form ><input id='QTDE_2' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 2, PRECO1, F2)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_3 ? F3 ? <TableCell align="center"><form ><input id='QTDE_3' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 3, PRECO1, F3)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_4 ? F4 ? <TableCell align="center"><form ><input id='QTDE_4' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 4, PRECO1, F4)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_5 ? F5 ? <TableCell align="center"><form ><input id='QTDE_5' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 5, PRECO1, F5)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_6 ? F6 ? <TableCell align="center"><form ><input id='QTDE_6' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 6, PRECO1, F6)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_7 ? F7 ? <TableCell align="center"><form ><input id='QTDE_7' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 7, PRECO1, F7)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_8 ? F8 ? <TableCell align="center"><form ><input id='QTDE_8' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 8, PRECO1, F8)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_9 ? F9 ? <TableCell align="center"><form ><input id='QTDE_9' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 9, PRECO1, F9)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}
                                {TAMANHO_10 ? F10 ? <TableCell align="center"><form ><input id='QTDE_10' onChange={(event) => CarregarGrade(event, ID, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA, 10, PRECO1, F10)} type="number" placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderColor: '#00AB55', borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : <TableCell align="center"><form><input type="number" disabled placeholder='0' style={{ textAlign: 'center', width: 35, height: 30, borderStyle: 'solid', borderWidth: 'medium', borderRadius: 10 }} /></form></TableCell> : ''}

                              </TableRow>


                              <div >
                                Entrega : {moment(LICENCIADO_ENTREGA).utc().format('DD/MM/YYYY')} |  Limite : {moment(LICENCIADO_ENTREGA_LIMITE).utc().format('DD/MM/YYYY')}
                              </div>

                            </TableCell>

                          </TableRow>
                        );
                      })}
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
              </TableContainer>
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
