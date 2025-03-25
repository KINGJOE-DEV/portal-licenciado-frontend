import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import item from '@iconify/icons-eva/external-link-outline';
import aprovado from '@iconify/icons-eva/checkmark-outline';
import entregaIcon from '@iconify/icons-eva/clock-fill';
import { visuallyHidden } from '@material-ui/utils';
import download from '@iconify/icons-eva/download-outline';

import csv from '@iconify/icons-eva/shuffle-2-outline';

import { CSVLink } from "react-csv";

import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

// material
import {
  Link,
  Card,
  Table,
  Stack,
  Avatar,
  CircularProgress,
  Button,
  Alert,
  TextField,
  Checkbox,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  TableSortLabel,
  Box,
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
import moment from 'moment';

import { AuthContext } from '../../../content/contentGeral';

import { useCookies } from 'react-cookie';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'PEDIDO', label: 'Pedido', alignRight: false },
  { id: 'CLIENTE_ATACADO', label: 'Cliente', alignRight: false },
  { id: 'REPRESENTANTE', label: 'Representante', alignRight: false },
  { id: 'TOT_QTDE_ORIGINAL', label: 'QTDE', alignRight: false },
  { id: 'TOT_VALOR_ORIGINAL', label: 'Total', alignRight: false },
  { id: 'TOT_VALOR_ORIGINAL', label: 'Recebimento', alignRight: false },
  { id: 'ENTREGA', label: 'Entrega Limite', alignRight: false },

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
    return filter(array, (_user) => _user.PEDIDO.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// ----------------------------------------------------------------------


export default function User(props) {

  const { token, tipo_venda, usuario, Sair, setStatusCarregar } = useContext(AuthContext);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [resultado, setResultado] = useState([{
    "PEDIDO": "",
    "CLIENTE_ATACADO": "",
    "REPRESENTANTE": "",
    "TOT_QTDE_ORIGINAL": "CARREGANDO ...",
    "TOT_VALOR_ORIGINAL": "",
    "ENTREGA": ""
  }]);


  const [validarselecao, setValidarselecao] = useState(false);

  const [msgCarregar, setMsgCarregar] = useState(false);
  const [msgResposta, setMsgResposta] = useState(false);
  const [msgInformativo, setMsgInformativo] = useState(false);
  const [ativarBotao, setAtivarBotao] = useState(true);

  const [numeroNota, setNumeroNota] = useState('');
  const [chaveNota, setChaveNota] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [codigoRastreio, setCodigoRastreio] = useState('');

  const [pedido, setPedido] = useState('');
  const [openCampos, setOpenCampos] = useState('');

  const [carregarProduto, setCarregarProduto] = useState(true);
  const [open, setOpen] = useState(false);
  const [openclienteModal, setopenclienteModal] = useState(false);

  const [cliente, setCliente] = useState('');
  const [representante, setRepresentante] = useState('');
  const [razao_social, setRazao_social] = useState('');
  const [email, setEmail] = useState('');

  const [resultado_csv, setResultado_csv] = useState([]);
  const [opencsvModal, setopencsvModal] = useState(false);

  const [telefone2, setTelefone2] = useState('');
  const [ddd2, setDdd2] = useState('');

  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ddd, setDdd] = useState('');
  const [uf, setUf] = useState('');
  const [inscricao_estadual, setInscricao_estadual] = useState('');

  const [selecao, setSelecao] = useState('');
  const [msg, setMsg] = useState('Altere todos os pedidos selecionados');
  const [openentregaModal, setopenentregaModal] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');

  const { REACT_APP_API } = process.env;
  console.log(REACT_APP_API)
  const [autenticado]   = useCookies(['autenticado']);


  useEffect(() => {
    buscarProdutos()
  }, [])


  async function buscarProdutos() {
    //BUSCAR PRODUTOS NA API

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_aprovado',
      headers: {
        'token': autenticado.token
      },
      data: {
        "tipo_venda": autenticado.tipo_venda,

      }

    }).then(async function (response) {
      if (response.status == 200) {
        setStatusCarregar(false)
        setResultado(await response.data)
        console.log(resultado)
        setCarregarProduto(false)

      } else {
        setStatusCarregar(false)
        setCarregarProduto(false)
        console.log(resultado)
      }

    }).catch(function (error) {
      Sair()
      console.log(error);
    });
  }


  //MODAL






  async function csvModal() {
    setopencsvModal(true);

    setMsgCarregar(true);

    console.log(selected)
    //BUSCAR PRODUTOS NA API
    if (selected != []) {

      await axios({
        method: 'POST',
        url: REACT_APP_API + '/parceiro/exportador_csv',
        headers: {
          'token': autenticado.token
        },
        data: {
          "pedidos": selected,
        }
      }).then(async function (response) {

        if (response.status == 200) {

          setResultado_csv(response.data)
          console.log(response.data)
          setMsgCarregar(false)

        } else {
          setMsgCarregar(false)
          setMsg('Erro tente Novamente !')
          console.log(response)
        }


      }).catch(function (error) {
        console.log(error);
      });

    } else {
      setMsgCarregar(false);
      setopenclienteModal(true);
      setMsg('Selecione algum pedido para exportação')
    }

  };


  const fecharcsvModal = () => {
    setopencsvModal(false);
  };







  async function ClienteModal(CLIENTE_ATACADO) {

    setopenclienteModal(true);
    setMsgCarregar(true)


    await axios({
      method: 'POST',
      url: REACT_APP_API + '/cliente_item',
      headers: {
        'token': autenticado.token
      },
      data: {
        "cliente_atacado": CLIENTE_ATACADO,
        "tipo_venda": autenticado.tipo_venda,

      }

    }).then(async function (response) {
      if (response.status == 200) {

        console.log(response)

        setCliente(response.data[0].CLIENTE_ATACADO)
        setRepresentante(response.data[0].REPRESENTANTE)
        setRazao_social(response.data[0].RAZAO_SOCIAL)

        setCnpj(response.data[0].CGC_CPF)
        setEndereco(response.data[0].ENDERECO)
        setNumero(response.data[0].NUMERO)
        setCep(response.data[0].CEP)
        setCidade(response.data[0].CIDADE)
        setBairro(response.data[0].BAIRRO)
        setUf(response.data[0].UF)
        setTelefone(response.data[0].TELEFONE1)
        setDdd(response.data[0].DDD1)
        setEmail(response.data[0].EMAIL_NFE)
        setInscricao_estadual(response.data[0].RG_IE)



        setTelefone2(response.data[0].TELEFONE2)
        setDdd2(response.data[0].DDD2)
        setMsgCarregar(false)

      } else {

        console.log(response)
        setMsgCarregar(false)
      }

    }).catch(function (error) {
      Sair()
      console.log(error);
    });


  };

  const fecharclienteModal = () => {
    setopenclienteModal(false);
  };


  //MODAL

  const FinalizarModal = (PEDIDO) => {
    setMsgInformativo('Deseja Finalizar todo o pedido ' + PEDIDO + ' ?');

    setPedido(PEDIDO);

    setNumeroNota('');
    setChaveNota('');
    setMsgResposta(false);
    setAtivarBotao(true);
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


  const handleClose = () => {
    setOpen(false);
  };


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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


  const Finalizar = async () => {

    setMsgCarregar(true);
    setAtivarBotao(true);
    setOpenCampos(false);

    if (numeroNota != '' && chaveNota != '' && transportadora != '' && codigoRastreio != '') {

      await axios({
        method: 'POST',
        url: REACT_APP_API + '/parceiro/pedido_aprovado_item_finalizar',
        headers: {
          'token': autenticado.token
        },
        data: {
          "tipo": "TODOS",
          "pedido": pedido,
          "fornecedor": autenticado.usuario,
          "numero_nota": numeroNota,
          "chave_nota": chaveNota,
          "codigoRastreio": codigoRastreio,
          "transportadora": transportadora,
          "item": '[]'
        }

      }).then(async function (response) {

        console.log(response)
        setMsgCarregar(false);
        setAtivarBotao(false);

        if (response.status === 200) {
          buscarProdutos();
          setMsgInformativo(response.data.msg);
        } else {
          setMsgInformativo(response.data.msg);
        }

      }).catch(function (error) {
        console.log(error);
      });

    } else {

      setMsgCarregar(false);
      setAtivarBotao(false);
      setMsgInformativo('Preencha todos os campos');
    }

  }

  async function EntregaModal() {
    setopenentregaModal(true);
  };
  const fecharentregaModal = () => {
    setopenentregaModal(false);
  };






  const MudarDataInicio = (event) => {
    console.log(event.target.value)
    setDataInicio(event.target.value);
  };
  const MudarDataFinal = (event) => {
    console.log(event.target.value)
    setDataFinal(event.target.value);
  };



  const SelecionarTodos = async (event) => {

    console.log(event.target.checked)
    console.log('*****************************')
    var status = '';

    if (event.target.checked) {
      const newSelecteds = resultado.map((n) => "'" + n.PEDIDO + "'");
      console.log(newSelecteds)
      setSelected(newSelecteds);
      status = '1';
      setValidarselecao(true)
    } else {
      setSelected([]);
      status = '0';
      setValidarselecao(false)
    }

    console.log(status)
    setSelecao('todos');

  }

  const SelecionarIndividual = async (event, PEDIDO) => {

    setSelecao('individual');

    const selectedIndex = selected.indexOf("'" + PEDIDO + "'");
    const id = "'" + PEDIDO + "'";

    let newSelected = [];
    if (selectedIndex === -1) {
      setValidarselecao(true)
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      setValidarselecao(false)
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      setValidarselecao(true)
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      setValidarselecao(true)
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    console.log(selectedIndex)
    console.log(newSelected)

  };



  const headers = [
    { label: "DATA_RECEBIMENTO", key: "DATA_RECEBIMENTO" },
    { label: "CNPJ", key: "CNPJ" },
    { label: "IE", key: "IE" },
    { label: "CLIENTE", key: "CLIENTE" },
    { label: "DDD", key: "DDD" },
    { label: "TELEFONE", key: "TELEFONE" },
    { label: "CEP", key: "CEP" },
    { label: "NUMERO", key: "NUMERO" },
    { label: "ENDERECO", key: "ENDERECO" },
    { label: "BAIRRO", key: "BAIRRO" },
    { label: "CIDADE", key: "CIDADE" },
    { label: "UF", key: "UF" },
    { label: "REPRESENTANTE", key: "REPRESENTANTE" },
    { label: "PEDIDO", key: "PEDIDO" },
    { label: "PRODUTO", key: "PRODUTO" },
    { label: "COR_PRODUTO", key: "COR_PRODUTO" },
    { label: "DESC_PRODUTO", key: "DESC_PRODUTO" },
    { label: "DESC_COR_PRODUTO", key: "DESC_COR_PRODUTO" },
    { label: "DESC_COND_PGTO", key: "DESC_COND_PGTO" },
    { label: "QTDE_ENTREGAR", key: "QTDE_ENTREGAR" },
    { label: "VALOR_ENTREGAR", key: "VALOR_ENTREGAR" },
    { label: "GRADE", key: "GRADE" },
    { label: "VE1", key: "VE1" },
    { label: "VE2", key: "VE2" },
    { label: "VE3", key: "VE3" },
    { label: "VE4", key: "VE4" },
    { label: "VE5", key: "VE5" },
    { label: "VE6", key: "VE6" },
    { label: "VE7", key: "VE7" },
    { label: "VE8", key: "VE8" },
    { label: "VE9", key: "VE9" },
    { label: "VE10", key: "VE10" },
    { label: "TAMANHO_1", key: "TAMANHO_1" },
    { label: "TAMANHO_2", key: "TAMANHO_2" },
    { label: "TAMANHO_3", key: "TAMANHO_3" },
    { label: "TAMANHO_4", key: "TAMANHO_4" },
    { label: "TAMANHO_5", key: "TAMANHO_5" },
    { label: "TAMANHO_6", key: "TAMANHO_6" },
    { label: "TAMANHO_7", key: "TAMANHO_7" },
    { label: "TAMANHO_8", key: "TAMANHO_8" },
    { label: "TAMANHO_9", key: "TAMANHO_9" },
    { label: "TAMANHO_10", key: "TAMANHO_10" }

  ];




  const ExportarCsv = {
    data: resultado_csv,
    headers: headers,
    filename: 'KINGJOE-PEDIDOS-APROVADOS.csv'
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultado.length) : 0;
  const filteredUsers = applySortFilter(resultado, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="KING&JOE-PARCEIRO">

      <Dialog
        open={opencsvModal}
        onClose={csvModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          EXPORTAÇÃO !
        </DialogTitle>
        <DialogContent>

      { validarselecao == true ? 
       
          msgCarregar == true ?
            <Stack sx={{ color: 'grey.900', marginLeft: 5 }} spacing={2} direction="row">
              <CircularProgress color="success" />
            </Stack>
            :
            <>
              <DialogContentText id="alert-dialog-description">
                Exportar em .csv pedidos selecionados !
              </DialogContentText>

              <Button
                style={{ marginLeft: 80, background: 'blue', marginTop: 20 }}
                variant="contained"
                to="#"
                startIcon={<Icon icon={download} />}

              >
                <CSVLink {...ExportarCsv} style={{ color: '#FFF' }}>Download</CSVLink>
              </Button>
            </>
            :'Nenhum pedido selecionado !'
          }

        </DialogContent>
        <DialogActions>
          <Button onClick={fecharcsvModal}>FECHAR</Button>
        </DialogActions>
      </Dialog>







      <Dialog
        open={openclienteModal}
        onClose={fecharclienteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="alert-dialog-title">
          DADOS DO CLIENTE : {cliente}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">

            {msgCarregar == true ?
              <Stack sx={{ color: 'grey.900' }} spacing={2} direction="row">
                <CircularProgress color="success" />
              </Stack>
              :
              <>
                <TextField
                  style={{ marginTop: 20, width: '60%' }}
                  id="outlined-number"
                  label="RAZÃO SOCIAL"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={razao_social}
                />

                <TextField
                  style={{ marginTop: 20, width: '30%', marginLeft: 4 }}
                  id="outlined-number"
                  label="EMAIL"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={email}
                />

                <TextField
                  style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
                  id="outlined-number"
                  label="CNPJ"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={cnpj}
                />


                <TextField
                  style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
                  id="outlined-number"
                  label="INSCRICAO ESTADUAL"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={inscricao_estadual}
                />

                <TextField
                  style={{ marginTop: 20, width: '30%', marginLeft: 4 }}
                  id="outlined-number"
                  label="TELEFONE"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={ddd + telefone}
                />

                <TextField
                  style={{ marginTop: 20, width: '30%', marginLeft: 4 }}
                  id="outlined-number"
                  label="TELEFONE 2"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={ddd2 + telefone2}
                />



                <TextField
                  style={{ width: '40%', marginTop: 65 }}
                  id="outlined-number"
                  label="ENDEREÇO"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={endereco}
                />
                <TextField
                  style={{ width: '10%', marginTop: 65, marginLeft: 3 }}
                  id="outlined-number"
                  label="N°"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={numero}
                />

                <TextField
                  style={{ width: '20%', marginTop: 65, marginLeft: 3 }}
                  id="outlined-number"
                  label="CEP"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={cep}
                />

                <TextField
                  style={{ marginTop: 20, width: '30%', marginLeft: 3 }}
                  id="outlined-number"
                  label="CIDADE"

                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={cidade}
                //onChange={mudarCampo_1}
                />

                <TextField
                  style={{ marginTop: 20, width: '40%', marginLeft: 3 }}
                  id="outlined-number"
                  label="BAIRRO"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={bairro}
                />

                <TextField
                  style={{ marginTop: 20, width: '10%', marginLeft: 3 }}
                  id="outlined-number"

                  label="ESTADO"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={uf}
                />

              </>
            }

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharclienteModal}>FECHAR</Button>
        </DialogActions>
      </Dialog>






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



      <Container>

        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={12}>
          <Typography variant="h4" gutterBottom>
            Pedidos Aprovados
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={12} style={{ marginTop: -90 }}>
          <Button
            style={{ marginLeft: 20, background: 'rgb(11, 171, 0)' }}
            variant="contained"
            to="#"
            startIcon={<Icon icon={csv} />}
            onClick={csvModal}
          >
            Exportar Csv
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
              <TableContainer sx={{ minWidth: 800 }}>
                <Table id="tabela">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selected.length > 0 && selected.length < resultado.length}
                          checked={resultado.length > 0 && selected.length === resultado.length}
                          onChange={SelecionarTodos}
                        />
                      </TableCell>
                      {TABLE_HEAD.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={headCell.alignRight ? 'right' : 'left'}
                          sortDirection={orderBy === headCell.id ? order : false}
                        >
                          <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                          >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                              <Box sx={{ ...visuallyHidden }}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>


                    {carregarProduto == true ?

                      <Stack sx={{ color: 'grey.900', marginLeft: '30%' }} spacing={2} direction="row">
                        <CircularProgress color="success" />
                      </Stack>
                      :

                      filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {

                          const { DATA_RECEBIMENTO,PEDIDO, CLIENTE_ATACADO, ENTREGA_LIMITE, REPRESENTANTE, TOT_QTDE_ENTREGAR, TOT_VALOR_ENTREGAR, ENTREGA } = row;
                          const URL = "/admin/pedido/pedido_aprovado_item/" + PEDIDO
                          var isItemSelected = selected.indexOf("'" + PEDIDO + "'") !== -1;

                          return (
                            <TableRow
                              hover
                              key={"'" + PEDIDO + "'"}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                            >

                              <TableCell padding="checkbox" >
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={(event) => SelecionarIndividual(event, PEDIDO)}
                                />
                              </TableCell>
                              <TableCell align="left">{PEDIDO}</TableCell>
                              <TableCell align="left">{CLIENTE_ATACADO}</TableCell>
                              <TableCell align="left">{REPRESENTANTE}</TableCell>
                              <TableCell align="left">{TOT_QTDE_ENTREGAR}</TableCell>

                              
                              <TableCell align="left" style={{ fontSize: 13, color: '#800000' }}>R$:{typeof TOT_VALOR_ENTREGAR === 'number' ? TOT_VALOR_ENTREGAR.toFixed(2) : TOT_VALOR_ENTREGAR}</TableCell>
                              <TableCell align="left">{DATA_RECEBIMENTO}</TableCell>
                              {ENTREGA_LIMITE != null ?
                                <TableCell align="left">
                                  {moment(ENTREGA_LIMITE).utc().format('DD/MM/YYYY')}
                                </TableCell>
                                :
                                <TableCell align="left" style={{ fontSize: 12, color: 'red' }}>
                                  ABERTO
                                </TableCell>
                              }


                              <TableCell align="right" >
                                <Button
                                  style={{ backgroundColor: '#808080', fontSize: 12 }}
                                  variant="contained"
                                  startIcon={<Icon icon={cliente} style={{ color: 'white', fontSize: 20 }} />}
                                  onClick={() => ClienteModal(CLIENTE_ATACADO)}
                                >
                                  Cliente
                                </Button>
                              </TableCell>

                              <TableCell align="right" >
                                <Link to={URL} style={{ textDecoration: 'none', cursor: 'pointer' }} component={RouterLink}>
                                  <Button
                                    style={{ backgroundColor: 'blue', fontSize: 12 }}
                                    variant="contained"
                                    startIcon={<Icon icon={item} style={{ color: 'white', fontSize: 20 }} />}
                                  >
                                    Itens
                                  </Button>
                                </Link>
                              </TableCell>


                              <TableCell align="right" >

                                <Button
                                  style={{ backgroundColor: 'green', fontSize: 12 }}
                                  variant="contained"
                                  startIcon={<Icon icon={aprovado} style={{ color: 'white', fontSize: 20 }} />}
                                  onClick={() => FinalizarModal(PEDIDO)}
                                >
                                  Finalizar
                                </Button>

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
    </Page >
  );
}
