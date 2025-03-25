import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import aprovado from '@iconify/icons-eva/checkmark-outline';
import cancelado from '@iconify/icons-eva/close-outline';
import impresao from '@iconify/icons-eva/printer-outline';

import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { experimentalStyled as styled } from '@material-ui/core/styles';

// material
import {
  Card,
  Table,
  Stack,
  TextField,
  CircularProgress,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  Toolbar,
  Typography,
  OutlinedInput,

} from '@material-ui/core';
// components
import Page from '../../../components/Page';
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

import PrintButton from '../../../components/print/html_print';
import { useCookies } from 'react-cookie';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'PRODUTO', label: 'Produto', alignRight: false },
  { id: 'COR_PRODUTO', label: 'Cor', alignRight: false },
  { id: 'TOT_QTDE_ORIGINAL', label: 'QTDE', alignRight: false },
  { id: 'TOT_QTDE_ORIGINAL', label: 'Valor', alignRight: false },
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
    var filtro = ''
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

  const [msgCarregar_aprovar, setMsgCarregar_aprovar] = useState(false);
  const [msgCarregar_cancelar, setMsgCarregar_cancelar] = useState(false);
  const [msgResposta_aprovar, setMsgResposta_aprovar] = useState(false);
  const [msgResposta_cancelar, setMsgResposta_cancelar] = useState(false);

  const [msgInformativo_aprovar, setMsgInformativo_aprovar] = useState(false);
  const [ativarBotao_aprovar, setAtivarBotao_aprovar] = useState(true);
  const [msgInformativo_cancelar, setMsgInformativo_cancelar] = useState(false);
  const [ativarBotao_cancelar, setAtivarBotao_cancelar] = useState(true);
  const [carregarProduto, setCarregarProduto] = useState(true);

  const [openAprovar, setOpenAprovar] = useState(false);
  const [openCancelar, setOpenCancelar] = useState(false);
  const [openCancelarObs, setOpenCancelarObs] = useState(true);

  const [openclienteModal, setopenclienteModal] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [dataFim, setDataFim] = useState(false);


  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [motivoCancelamento_total, setMotivoCancelamento_total] = useState('');

  const [msgInformativo_cancelar_total, setMsgInformativo_cancelar_total] = useState('');
  const [msgResposta_cancelar_total, setMsgResposta_cancelar_total] = useState('');
  const [ativarBotao_cancelar_total, setAtivarBotao_cancelar_total] = useState(true);
  const [openCancelar_total, setOpenCancelar_total] = useState(false);
  const [openCancelarObs_total, setOpenCancelarObs_total] = useState(true);




  const [msgCarregar_cancelar_total, setMsgCarregar_cancelar_total] = useState(false);

  const [produto, setProduto] = useState('');
  const [cor_produto, setCor_produto] = useState('');
  const [item_pedido, setItem_pedido] = useState('');
  const [entrega, setEntrega] = useState('');

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lx');
  const [minHeight, setMinHeight] = useState(200);
  const [msg, setMsg] = useState('Insira o periodo de entrega');

  const [qtde_total, setQtde_total] = useState(0);
  const [valor_total, setValor_total] = useState(0);


  const { REACT_APP_API } = process.env;
  console.log(REACT_APP_API)

  const [autenticado]   = useCookies(['autenticado']);

  useEffect(() => {
    buscarProdutos()

  }, [])

  //MODAL APROVAR
  const AprovarModal = () => {
    setMsgInformativo_aprovar('Deseja APROVAR todo pedido ?');
    setMsgResposta_aprovar(false)
    setAtivarBotao_aprovar(true)
    setOpenAprovar(true);
  };
  const AprovarModalFechar = () => {
    setOpenAprovar(false);
  };


  //MODAL CANCELAR INDIVIDUAL
  const CancelarModalIndividual = (event, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA) => {

    setProduto(PRODUTO)
    setCor_produto(COR_PRODUTO)
    setItem_pedido(ITEM_PEDIDO)
    setEntrega(ENTREGA)

    console.log(ENTREGA)

    console.log('clicou no cancelar')
    setMotivoCancelamento('')
    setMsgInformativo_cancelar('Deseja CANCELAR esse Item ?');

    setMsgResposta_cancelar(false)
    setAtivarBotao_cancelar(true)

    setOpenCancelar(true);
    setOpenCancelarObs(true);
  };



  const CancelarModalIndividual_Fechar = () => {
    buscarProdutos();
    setOpenCancelar(false);
  };


  //MODAL CANCELAR TOTAL
  const CancelarModalTotal = () => {
    console.log('clicou no cancelar')
    setMotivoCancelamento('')
    setMsgInformativo_cancelar_total('Deseja CANCELAR todos os Itens ?');

    setMsgCarregar_cancelar_total(false);
    setMsgResposta_cancelar_total(false)
    setAtivarBotao_cancelar_total(true)
    setOpenCancelar_total(true);
    setOpenCancelarObs_total(true);
  };
  const CancelarModalTotal_Fechar = () => {
    buscarProdutos();
    setOpenCancelar_total(false);
  };



  const mudarCampo = (event) => {
    console.log(event.target.value)
    setMotivoCancelamento(event.target.value);
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
      url: REACT_APP_API + '/parceiro/pedido_novo_item',
      headers: {
        'token': autenticado.token
      },
      data: {
        "pedido": pedido
      }

    }).then(async function (response) {

      console.log(response)

      if (response.status == 200) {

        if(response.data.length > 0){

              setCarregarProduto(false)
      
              setDataInicio(response.data[0]['LICENCIADO_ENTREGA'])
              setDataFinal(response.data[0]['LICENCIADO_ENTREGA_LIMITE'])
              setResultado(await response.data)
              console.log(response)
              console.log(response.data[0]['LICENCIADO_ENTREGA_LIMITE'])

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

          }else{
              navigate('/admin/pedido/pedido_novo');
          }


      } else {
        setCarregarProduto(false)
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






  const Aprovar = async () => {

    setMsgCarregar_aprovar(true);
    setAtivarBotao_aprovar(true);

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_novo_item_aprovar',
      headers: {
        'token': autenticado.token
      },
      data: {
        "pedido": pedido.pedido
      }
    }).then(async function (response) {

      console.log(response)
      setMsgCarregar_aprovar(false);
      setAtivarBotao_aprovar(false);

      if (response.status === 200) {
        navigate('/admin/pedido/pedido_novo');
      } else {
        setMsgInformativo_aprovar(response.data.msg);
      }

    }).catch(function (error) {
      console.log(error);
    });

  }



  const CancelarIndividual = async () => {

    setAtivarBotao_cancelar(true);
    setMsgCarregar_cancelar(true);
    setOpenCancelarObs(false);

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_novo_item_cancelar',
      headers: {
        'token': autenticado.token
      },
      data: {
        "usuario":autenticado.usuario,
        "tipo": 'INDIVIDUAL',
        "pedido": pedido.pedido,
        "produto": produto,
        "cor_produto": cor_produto,
        "item_pedido": item_pedido,
        "entrega": entrega,
        "motivo_cancelamento": motivoCancelamento
      }
    }).then(async function (response) {

      console.log(response)
      setMsgCarregar_cancelar(false);
      setAtivarBotao_cancelar(false);

      if (response.status === 200) {
        setMsgInformativo_cancelar('Cancelado com sucesso !');

      } else {
        setMsgInformativo_cancelar('Erro interno tente novamente!');
      }

    }).catch(function (error) {
      console.log(error);
    });

  }


  const CancelarTotal = async () => {

    setMsgCarregar_cancelar_total(true);
    setAtivarBotao_cancelar_total(false);
    setOpenCancelarObs_total(false);

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_novo_item_cancelar',
      headers: {
        'token': autenticado.token
      },
      data: {
        "usuario":autenticado.usuario,
        "tipo": 'TODOS',
        "pedido": pedido.pedido,
        "produto": 'TODOS',
        "cor_produto": 'TODOS',
        "item_pedido": 'TODOS',
        "entrega": 'TODOS',
        "motivo_cancelamento": motivoCancelamento
      }
    }).then(async function (response) {

      console.log(response)
      setMsgCarregar_cancelar_total(false);


      if (response.status === 200) {
        setMsgInformativo_cancelar_total(response.data.msg);

      } else {
        setMsgInformativo_cancelar('Erro interno tente novamente!');
      }

    }).catch(function (error) {
      console.log(error);
    });

  }


  async function ClienteModal() {
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

            <PrintButton data={resultado} qtde_total={qtde_total} valor_total={valor_total} entrega={dataInicio} limite={dataFinal} />

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharclienteModal}>FECHAR</Button>

        </DialogActions>
      </Dialog>




      <Dialog
        open={openAprovar}
        onClose={AprovarModalFechar}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ATENÇÃO !
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msgCarregar_aprovar == true ?
              <Stack sx={{ color: 'grey.900', marginLeft: '30%' }} spacing={2} direction="row">
                <CircularProgress color="success" />
              </Stack>
              :
              <h4>{msgInformativo_aprovar}</h4>
            }
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={AprovarModalFechar}>FECHAR</Button>
          {ativarBotao_aprovar == true ?
            <Button onClick={Aprovar} autoFocus  >
              APROVAR
            </Button>
            :
            ''
          }
        </DialogActions>
      </Dialog>




      <Dialog
        open={openCancelar_total}
        onClose={CancelarModalTotal_Fechar}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ATENÇÃO !
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msgCarregar_cancelar_total ?
              <Stack sx={{ color: 'grey.900', marginLeft: '30%' }} spacing={2} direction="row">
                <CircularProgress color="success" />
              </Stack>
              :
              <h4>{msgInformativo_cancelar_total}</h4>

            }

            {openCancelarObs_total ?

              <TextField
                style={{ width: 400, height: 200, marginTop: 15 }}
                id="outlined-multiline-static"
                label="Motivo do cancelamento"
                placeholder="Digite aqui"
                multiline
                rows={7}
                value={motivoCancelamento}
                onChange={mudarCampo}
              />
              : ''
            }

          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={CancelarModalTotal_Fechar}>FECHAR</Button>
          {ativarBotao_cancelar_total == true ?
            <Button onClick={CancelarTotal} autoFocus style={{ color: 'red' }} >
              CANCELAR TODOS
            </Button>
            :
           ''
            
          }
        </DialogActions>
      </Dialog>




      <Dialog
        open={openCancelar}
        onClose={CancelarModalIndividual_Fechar}
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
                placeholder="Digite aqui !"
                multiline
                rows={7}
                value={motivoCancelamento}
                onChange={mudarCampo}
              />
              : ''
            }

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={CancelarModalIndividual_Fechar}>FECHAR</Button>
          {ativarBotao_cancelar == true ?
            <Button onClick={CancelarIndividual} autoFocus style={{ color: 'red' }} >
              CANCELAR
            </Button>
            :
             ''
          }
        </DialogActions>
      </Dialog>






      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={12}>
          <Typography variant="h4" gutterBottom>
            Items do Pedido :{pedido.pedido}
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
            style={{ marginLeft: 20, background: 'red' }}
            variant="contained"
            to="#"
            startIcon={<Icon icon={cancelado} />}
            onClick={CancelarModalTotal}
          >
            Cancelar
          </Button>

          <Button
            style={{ marginLeft: 20 }}
            variant="contained"
            to="#"
            startIcon={<Icon icon={aprovado} />}
            onClick={AprovarModal}
          >
            Aprovar
          </Button>
        </Stack>


        <Card>

          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          {carregarProduto == true ?

            <Stack sx={{ color: 'grey.900', marginLeft: '50%' }} spacing={2} direction="row">
              <CircularProgress color="success" />
            </Stack>
            :


            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 900 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={resultado.length}
                      numSelected={selected.length}

                    />
                    <TableBody>
                      {

                        filteredUsers
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {

                            const { PRODUTO, COR_PRODUTO, ITEM_PEDIDO, DESC_PRODUTO, DESC_COR_PRODUTO, QTDE_ENTREGAR, VALOR_ENTREGAR, PRECO1, ENTREGA, VE1, VE2, VE3, VE4, VE5, VE6, VE7, VE8, VE9, VE10, TAMANHO_1, TAMANHO_2, TAMANHO_3, TAMANHO_4, TAMANHO_5, TAMANHO_6, TAMANHO_7, TAMANHO_8, TAMANHO_9, TAMANHO_10 } = row;

                            var isItemSelected = selected.indexOf(ITEM_PEDIDO) !== -1;


                            return (
                              <TableRow
                                hover
                                key={ITEM_PEDIDO}
                                tabIndex={-1}
                                role="checkbox"
                                selected={isItemSelected}
                                aria-checked={isItemSelected}
                              >


                                <TableCell align="left" style={{ fontSize: 13 }} >{DESC_PRODUTO} <p style={{ fontSize: 13, color: '#800000' }}>{PRODUTO}</p></TableCell>
                                <TableCell align="left" style={{ fontSize: 13 }} >{DESC_COR_PRODUTO}  <p style={{ fontSize: 13, color: '#800000' }}>{COR_PRODUTO}</p></TableCell>
                                <TableCell align="center" style={{ fontSize: 13 }} >{QTDE_ENTREGAR}</TableCell>
                                <TableCell align="left" style={{ fontSize: 13, color: '#800000' }}>R$:{typeof PRECO1 === 'number' ? PRECO1.toFixed(2) : PRECO1}</TableCell>
                                <TableCell align="left" style={{ fontSize: 13, color: '#800000' }}>R$:{typeof VALOR_ENTREGAR === 'number' ? VALOR_ENTREGAR.toFixed(2) : VALOR_ENTREGAR}</TableCell>

                                <TableCell align="center" >
                                  <TableRow >
                                    {TAMANHO_1 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_1}</TableCell> : ''}
                                    {TAMANHO_2 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_2}</TableCell> : ''}
                                    {TAMANHO_3 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_3}</TableCell> : ''}
                                    {TAMANHO_4 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_4}</TableCell> : ''}
                                    {TAMANHO_5 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_5}</TableCell> : ''}
                                    {TAMANHO_6 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_6}</TableCell> : ''}
                                    {TAMANHO_7 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_7}</TableCell> : ''}
                                    {TAMANHO_8 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_8}</TableCell> : ''}
                                    {TAMANHO_9 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_9}</TableCell> : ''}
                                    {TAMANHO_10 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF', fontSize: 14, width: 50 }} align="center" >{TAMANHO_10}</TableCell> : ''}
                                  </TableRow>
                                  <TableRow>
                                    {TAMANHO_1 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE1}</TableCell> : ''}
                                    {TAMANHO_2 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE2}</TableCell> : ''}
                                    {TAMANHO_3 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE3}</TableCell> : ''}
                                    {TAMANHO_4 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE4}</TableCell> : ''}
                                    {TAMANHO_5 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE5}</TableCell> : ''}
                                    {TAMANHO_6 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE6}</TableCell> : ''}
                                    {TAMANHO_7 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE7}</TableCell> : ''}
                                    {TAMANHO_8 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE8}</TableCell> : ''}
                                    {TAMANHO_9 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE9}</TableCell> : ''}
                                    {TAMANHO_10 ? <TableCell align="center" style={{ fontSize: 14 }}>{VE10}</TableCell> : ''}
                                  </TableRow>

                                  <Button
                                    style={{ backgroundColor: 'red', fontSize: 12, marginLeft: -220 }}
                                    variant="contained"
                                    to="#"
                                    startIcon={<Icon icon={cancelado} />}
                                    onClick={(event) => CancelarModalIndividual(event, PRODUTO, COR_PRODUTO, ITEM_PEDIDO, ENTREGA)}
                                  >
                                    CANCELAR GRADE
                                  </Button>

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
          }

        </Card>
      </Container>
    </Page>
  );
}
